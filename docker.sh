#!/usr/bin/env bash
set -euo pipefail

HELP_TEXT="USAGE: ./docker.sh (--contentHash | --contentHashFromImage | --contentFromImage | --appFromImage | --prodImageTag | --prodTestingFeatureImageTag | --build (app | app-testing-feature | content | prod | prod-testing-feature) | --push (app | content | prod | prod-testing-feature) | --sign (prod | prod-testing-feature))"
REGISTRY=ghcr.io
IMAGE_NAME=digitalservicebund/a2j-rechtsantragstelle
APP_IMAGE=$REGISTRY/$IMAGE_NAME-app
APP_IMAGE_TESTING_FEATURE=$REGISTRY/$IMAGE_NAME-app-testing-feature
CONTENT_IMAGE=$REGISTRY/$IMAGE_NAME-content
PROD_IMAGE=$REGISTRY/$IMAGE_NAME
PROD_IMAGE_TESTING_FEATURE=$REGISTRY/$IMAGE_NAME-prod-testing-feature
DOCKERFILE=Dockerfile

if [ "$#" -eq 0 ]; then
    echo "Missing action"
    echo "$HELP_TEXT"
    exit 1
fi

function parseValidTarget() {
    if [ "$#" -le 1 ]; then
        echo "Missing target, aborting..."
        echo "$HELP_TEXT"
        exit 1
    fi
    case $2 in
    app | content | prod | app-testing-feature | prod-testing-feature) TARGET=$2 ;;
    *)
        echo "Unknown target $2, aborting..."
        echo "$HELP_TEXT"
        exit 1
        ;;
    esac
}

function parseValidPushTarget() {
    if [ "$#" -le 1 ]; then
        echo "Missing target, aborting..."
        echo "$HELP_TEXT"
        exit 1
    fi
    case $2 in
    app | content | prod | prod-testing-feature) TARGET=$2 ;;
    *)
        echo "Unknown push target $2, aborting..."
        echo "$HELP_TEXT"
        exit 1
        ;;
    esac
}

function parseValidSignTarget() {
    if [ "$#" -le 1 ]; then
        echo "Missing sign target, aborting..."
        echo "$HELP_TEXT"
        exit 1
    fi
    case $2 in
    prod | prod-testing-feature) TARGET=$2 ;;
    *)
        echo "Unknown sign target $2, aborting..."
        echo "$HELP_TEXT"
        exit 1
        ;;
    esac
}

# The content file lives inside $CONTENT_IMAGE. To get its sha256 hash:
# Create tmp container, copy content.json to provided location, delete container
function getContentFromLatestImage() {
    local tmp_container_id
    tmp_container_id=$(docker create $CONTENT_IMAGE null)
    docker cp --quiet "$tmp_container_id:/content.json" "$1" && docker rm "$tmp_container_id" &>/dev/null
}
function getAppFromLatestImage() {
    local tmp_container_id
    tmp_container_id=$(docker create $APP_IMAGE null)
    docker cp --quiet "$tmp_container_id:/a2j-app/." "$1" && docker rm "$tmp_container_id" &>/dev/null
}

function hashFromContentFile() {
    sha256sum "$1" | cut -d' ' -f1
}

function hashFromImage() {
    docker image inspect "$1" &>/dev/null || docker pull "$1" --quiet &>/dev/null
    docker image inspect "$1" --format '{{ json .Config.Labels.hash }}' | tr -d '"'
}

function prodImageTag() {
    CONTENT_HASH=$(hashFromImage $CONTENT_IMAGE)
    APP_HASH=$(hashFromImage $APP_IMAGE)
    echo "$APP_HASH-$CONTENT_HASH"
}

function prodTestingFeatureImageTag() {
    CONTENT_HASH=$(hashFromImage $CONTENT_IMAGE)
    APP_HASH=$(hashFromImage $APP_IMAGE_TESTING_FEATURE)
    echo "$APP_HASH-$CONTENT_HASH"
}

case $1 in
--appFromImage)
    DESTINATION=./a2j-app
    echo "Extraction app from $APP_IMAGE into $DESTINATION..."
    getAppFromLatestImage $DESTINATION
    exit 0
    ;;
--contentFromImage)
    IMAGE_CONTENT_FILE=./content_from_image.json
    echo "Extracting content from $CONTENT_IMAGE into $IMAGE_CONTENT_FILE..."
    getContentFromLatestImage $IMAGE_CONTENT_FILE
    exit 0
    ;;
--contentHashFromImage)
    hashFromImage $CONTENT_IMAGE
    exit 0
    ;;
--contentHash)
    hashFromContentFile content.json
    exit 0
    ;;
--prodImageTag)
    prodImageTag
    exit 0
    ;;
--prodTestingFeatureImageTag)
    prodTestingFeatureImageTag
    exit 0
    ;;
--build)
    parseValidTarget "$@"

    case ${TARGET} in
    app)
        LATEST_GIT_TAG=$(git rev-parse HEAD)
        APP_IMAGE_TAG=$APP_IMAGE
        
        pnpm run build
        echo "Building $APP_IMAGE..."
        docker build -t $APP_IMAGE --label "hash=$LATEST_GIT_TAG" -f $DOCKERFILE --target app --quiet .

        echo "Tagging latest app image as $APP_IMAGE_TAG"
        docker tag $APP_IMAGE "$APP_IMAGE_TAG"
        ;;
    content)
        CONTENT_HASH=$(hashFromContentFile content.json)
        CONTENT_IMAGE_TAG=$CONTENT_IMAGE:$CONTENT_HASH

        echo "Building $CONTENT_IMAGE..."
        docker build -t $CONTENT_IMAGE --label "hash=$CONTENT_HASH" -f $DOCKERFILE --target content --quiet .

        echo "Tagging latest content image as $CONTENT_IMAGE_TAG"
        docker tag $CONTENT_IMAGE "$CONTENT_IMAGE:$CONTENT_HASH"
        ;;
    prod)
        echo -e "\nBuilding $PROD_IMAGE..."
        docker build -t $PROD_IMAGE -f $DOCKERFILE --build-arg="APP_IMAGE=$APP_IMAGE" --build-arg="CONTENT_IMAGE=$CONTENT_IMAGE" --target prod --quiet .

        PROD_IMAGE_TAG=$PROD_IMAGE:$(prodImageTag)
        echo "Tagging latest prod image as $PROD_IMAGE_TAG"
        docker tag $PROD_IMAGE "$PROD_IMAGE_TAG"
        ;;
    app-testing-feature)
        LATEST_GIT_TAG=$(git rev-parse HEAD)
        APP_IMAGE_TAG=$APP_IMAGE_TESTING_FEATURE
        
        pnpm run build
        echo "Building $APP_IMAGE_TESTING_FEATURE..."
        docker build -t $APP_IMAGE_TESTING_FEATURE --label "hash=$LATEST_GIT_TAG" -f $DOCKERFILE --target app --quiet .

        echo "Tagging latest app image as $APP_IMAGE_TAG"
        docker tag $APP_IMAGE_TESTING_FEATURE "$APP_IMAGE_TAG"
        ;;
    prod-testing-feature)
        echo -e "\nBuilding $PROD_IMAGE_TESTING_FEATURE..."
        docker build -t $PROD_IMAGE_TESTING_FEATURE -f $DOCKERFILE --build-arg="APP_IMAGE=$APP_IMAGE_TESTING_FEATURE" --build-arg="CONTENT_IMAGE=$CONTENT_IMAGE" --target prod --quiet .

        PROD_IMAGE_TAG=$PROD_IMAGE_TESTING_FEATURE:$(prodTestingFeatureImageTag)
        echo "Tagging latest prod image as $PROD_IMAGE_TAG"
        docker tag $PROD_IMAGE_TESTING_FEATURE "$PROD_IMAGE_TAG"
        ;;
    esac

    ;;
--push)
    parseValidPushTarget "$@"

    case ${TARGET} in
    app)
        echo "Pushing $APP_IMAGE..."
        docker push --all-tags $APP_IMAGE
        ;;
    content)
        echo "Pushing $CONTENT_IMAGE..."
        docker push --all-tags $CONTENT_IMAGE
        ;;
    prod)
        echo "Pushing $PROD_IMAGE..."
        docker push --all-tags $PROD_IMAGE
        ;;
    prod-testing-feature)
        echo "Pushing $PROD_IMAGE_TESTING_FEATURE..."
        docker push --all-tags $PROD_IMAGE_TESTING_FEATURE
        ;;
    esac
    ;;
--sign)
    parseValidSignTarget "$@"
    echo "Signing images with cosign"
    case ${TARGET} in
    prod)
        IMAGE_TO_SIGN=$PROD_IMAGE:latest
        ;;
    prod-testing-feature)
        IMAGE_TO_SIGN=$PROD_IMAGE_TESTING_FEATURE:latest
        ;;
    esac
    DOCKER_IMAGE_DIGEST=$(docker inspect --format='{{ index .RepoDigests 0 }}' "$IMAGE_TO_SIGN")
    cosign sign --yes $DOCKER_IMAGE_DIGEST
    echo "Attest images with cosign"
    cosign attest --yes --replace --predicate vulnerabilities.json --type vuln $DOCKER_IMAGE_DIGEST
    ;;
*)
    echo "Unknown command $1"
    echo "$HELP_TEXT"
    exit 1
    ;;
esac
