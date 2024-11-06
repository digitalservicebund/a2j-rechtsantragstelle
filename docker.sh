#!/usr/bin/env bash
set -euo pipefail

HELP_TEXT="USAGE: ./docker.sh (--contentHash | --contentHashFromImage | --contentFromImage | --appFromImage | --prodImageTag | --build (app | content | prod) | --push (app | content | prod))"
REGISTRY=ghcr.io
IMAGE_NAME=digitalservicebund/a2j-rechtsantragstelle
APP_IMAGE=$REGISTRY/$IMAGE_NAME-app
CONTENT_IMAGE=$REGISTRY/$IMAGE_NAME-content
PROD_IMAGE=$REGISTRY/$IMAGE_NAME
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
    app | content | prod) TARGET=$2 ;;
    *)
        echo "Unknown target $2, aborting..."
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
    esac

    ;;
--push)
    parseValidTarget "$@"

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
    esac
    ;;
--sign)
    echo "Signing images with cosign"
    DOCKER_IMAGE_DIGEST=$(docker inspect --format='{{ index .RepoDigests 0 }}' ghcr.io/digitalservicebund/a2j-rechtsantragstelle:latest)
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
