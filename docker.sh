#!/usr/bin/env bash
set -euo pipefail

HELP_TEXT="USAGE: --contentHash, --contentHashFromImage, --contentFromImage, --build [app/content], --push [app/content]"
REGISTRY=ghcr.io
IMAGE_NAME=digitalservicebund/a2j-rechtsantragstelle
APP_IMAGE=$REGISTRY/$IMAGE_NAME-app
CONTENT_IMAGE=$REGISTRY/$IMAGE_NAME-content
PROD_IMAGE=$REGISTRY/$IMAGE_NAME
DOCKERFILE=Dockerfile

function parseValidTarget() {
    if [ "$#" -le 1 ]; then
        echo "Missing target, aborting..."
        echo $HELP_TEXT
        exit 1
    fi
    case $2 in
    app | content) TARGET=$2 ;;
    *)
        echo "Unknown target $2, aborting..."
        echo $HELP_TEXT
        exit 1
        ;;
    esac
}

# The content file lives inside $CONTENT_IMAGE. To get its sha256 hash:
# Create tmp container, copy content.json to provided location, delete container
function getContentFromLatestImage() {
    local tmp_container_id=$(docker create $CONTENT_IMAGE null)
    docker cp --quiet $tmp_container_id:/content.json $1 && docker rm $tmp_container_id &>/dev/null
}
function hashFromContentFile() {
    echo $(sha256sum $1 | cut -d' ' -f1)
}
function getContentHashFromLatestImage() {
    local tmp_content_file="./content.tmp"
    getContentFromLatestImage $tmp_content_file
    local content_hash=$(hashFromContentFile $tmp_content_file)
    rm $tmp_content_file
    echo $content_hash
}

case $1 in
--contentFromImage)
    IMAGE_CONTENT_FILE=./content_from_image.json
    echo "Extracting content from $CONTENT_IMAGE into $IMAGE_CONTENT_FILE..."
    getContentFromLatestImage $IMAGE_CONTENT_FILE
    exit 0
    ;;
--contentHashFromImage)
    getContentHashFromLatestImage
    exit 0
    ;;
--contentHash)
    hashFromContentFile content.json
    exit 0
    ;;
--build)
    parseValidTarget "$@"

    case ${TARGET} in
    app)
        npm run build
        npm run build-storybook
        # npm prune --omit=dev
        echo "Building $APP_IMAGE..."
        docker build -t $APP_IMAGE -f $DOCKERFILE --target app .
        ;;
    content)
        docker build -t $CONTENT_IMAGE -f $DOCKERFILE --target content .
        ;;
    esac

    echo "Building $PROD_IMAGE..."
    docker build -t $PROD_IMAGE -f $DOCKERFILE --build-arg="APP_IMAGE=$APP_IMAGE" --build-arg="CONTENT_IMAGE=$CONTENT_IMAGE" --target prod .
    ;;
--push)
    parseValidTarget "$@"
    LATEST_GIT_TAG=$(git rev-parse HEAD)

    case ${TARGET} in
    app)
        CONTENT_HASH=$(getContentHashFromLatestImage)
        APP_IMAGE_TAG=$APP_IMAGE:$LATEST_GIT_TAG
        echo "Tagging and pushing $APP_IMAGE_TAG"
        docker tag $APP_IMAGE $APP_IMAGE_TAG
        docker push --all-tags $APP_IMAGE
        ;;
    content)
        CONTENT_HASH=$(hashFromContentFile content.json)
        CONTENT_IMAGE_TAG=$CONTENT_IMAGE:$CONTENT_HASH
        echo "Tagging and pushing $CONTENT_IMAGE_TAG"
        docker tag $CONTENT_IMAGE $CONTENT_IMAGE:$CONTENT_HASH
        docker push --all-tags $CONTENT_IMAGE
        ;;
    esac

    PROD_IMAGE_TAG=$PROD_IMAGE:$LATEST_GIT_TAG-$CONTENT_HASH
    echo "Tagging and pushing $PROD_IMAGE_TAG"
    docker tag $PROD_IMAGE $PROD_IMAGE_TAG
    docker push --all-tags $PROD_IMAGE
    ;;

*)
    echo "Unknown command $1"
    echo "$HELP_TEXT"
    exit 1
    ;;
esac
