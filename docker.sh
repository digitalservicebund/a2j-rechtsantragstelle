#!/usr/bin/env bash
set -euo pipefail

HELP_TEXT="USAGE: --contentFromImage, --contentHashFromImage, --build [app/content], --push [app/content]"
REGISTRY=ghcr.io
IMAGE_NAME=digitalservicebund/a2j-rechtsantragstelle
CONTENT_FILENAME=content_from_image.json
DOCKERFILE=Dockerfile
APP_IMAGE=$REGISTRY/$IMAGE_NAME-app
CONTENT_IMAGE=$REGISTRY/$IMAGE_NAME-content
PROD_IMAGE=$REGISTRY/$IMAGE_NAME

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
# Create tmp container, copy content.json out, store hash, delete tmp file & container
function getContentFromLatestImage() {
    tmp_container_id=$(docker create $CONTENT_IMAGE null)
    docker cp --quiet $tmp_container_id:/content.json ./$CONTENT_FILENAME && docker rm $tmp_container_id &>/dev/null
}
function getContentHashFromLatestImage() {
    getContentFromLatestImage
    CONTENT_HASH=$(sha256sum $CONTENT_FILENAME | cut -d' ' -f1)
    rm $CONTENT_FILENAME
}
function printContentHashFromLatestImage() {
    getContentHashFromLatestImage
    echo $CONTENT_HASH
}

case $1 in
--contentFromImage)
    echo "Extracting content from $CONTENT_IMAGE into ./$CONTENT_FILENAME..."
    getContentFromLatestImage
    exit 0
    ;;
--contentHashFromImage)
    printContentHashFromLatestImage
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
    APP_IMAGE_TAG=$APP_IMAGE:$LATEST_GIT_TAG
    CONTENT_IMAGE_TAG=$CONTENT_IMAGE:$CONTENT_HASH

    case ${TARGET} in
    app)
        echo "Tagging and pushing $APP_IMAGE_TAG"
        docker tag $APP_IMAGE $APP_IMAGE:$LATEST_GIT_TAG
        docker push --all-tags $APP_IMAGE
        getContentHashFromLatestImage # populates $CONTENT_HASH
        ;;
    content)
        echo "Tagging and pushing $CONTENT_IMAGE_TAG"
        CONTENT_HASH=$(sha256sum content.json | cut -d' ' -f1)
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
