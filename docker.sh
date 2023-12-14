#!/usr/bin/env bash
set -eo pipefail

HELP_TEXT="USAGE: --build (--push, --rebuild, --registry link.to.registry) [app/content/prod]"
if [ "$#" -le 1 ]; then
    echo $HELP_TEXT
    exit 1
fi

PROJECT_NAME=a2j-rechtsantragstelle
DOCKERFILE=split.Dockerfile

while [[ "$#" -gt 0 ]]; do
    case $1 in
    --registry)
        REGISTRY="$2"
        shift
        ;;
    -b | --build) build=1 ;;
    -p | --push) push=1 ;;
    -r | --rebuild) rebuild=1 ;;
    content | app | prod) TARGET=$1 ;;
    *)
        echo "Unknown parameter passed: $1"
        echo "$HELP_TEXT"
        exit 1
        ;;
    esac
    shift
done

if [[ -n "$REGISTRY" ]]; then
    PROJECT_NAME="$REGISTRY/$PROJECT_NAME"
fi

## BUILD ARGUMENTS
case ${TARGET} in
app) ;;
content)
    # Load .env file if STRAPI_API or STRAPI_ACCESS_KEY isn't available
    if [[ -z "$STRAPI_API" || -z "$STRAPI_ACCESS_KEY" ]]; then
        [ ! -f .env ] || export $(grep -v '^#' .env | xargs)
    fi
    if [[ -z "$STRAPI_API" || -z "$STRAPI_ACCESS_KEY" ]]; then
        echo "Can't build content without STRAPI_API and STRAPI_ACCESS_KEY. Either pass via ENV variables or add to .env file"
        exit 1
    fi
    BUILD_ARGS="--build-arg=STRAPI_API=$STRAPI_API --build-arg=STRAPI_ACCESS_KEY=$STRAPI_ACCESS_KEY"
    ;;
prod)
    BUILD_ARGS="--build-arg=CONTENT_IMAGE=$PROJECT_NAME-content --build-arg=APP_IMAGE=$PROJECT_NAME-app"
    ;;
*)
    echo "no valid target, aborting"
    echo "$HELP_TEXT"
    exit -1
    ;;
esac

if [ -n "$rebuild" ]; then
    echo "rebuilding without docker cache"
    BUILD_ARGS="$BUILD_ARGS --no-cache"
fi

IMAGE_NAME=$PROJECT_NAME-$TARGET

## BUILD ARGUMENTS
if [ -n "$build" ]; then
    echo "Building $IMAGE_NAME"
    docker build -t $IMAGE_NAME --target $TARGET $BUILD_ARGS -f $DOCKERFILE .
fi

## PUSHING
# The content file lives inside container. To get its sha256 hash:
# Create tmp container, copy content.json out, store hash, delete tmp file & container
function contentHashFromImage() {
    tmp_container_id=$(docker create $PROJECT_NAME-content null)
    docker cp --quiet $tmp_container_id:/content.json ./content.json.tmp && docker rm $tmp_container_id &>/dev/null
    CONTENT_HASH=$(sha256sum content.json.tmp | cut -d' ' -f1)
    rm content.json.tmp
}

if [ -n "$push" ]; then
    LATEST_GIT_TAG=$(git rev-parse HEAD)

    ## TAGGING
    case ${TARGET} in
    app)
        IMAGE_TAG="$LATEST_GIT_TAG"
        ;;
    content)
        contentHashFromImage
        IMAGE_TAG="$CONTENT_HASH"
        ;;
    prod)
        contentHashFromImage
        IMAGE_TAG="$LATEST_GIT_TAG-$CONTENT_HASH"
        ;;
    esac

    echo "Tagging as $IMAGE_NAME:$IMAGE_TAG"
    docker tag $IMAGE_NAME $IMAGE_NAME:$IMAGE_TAG

    echo "Pushing to $IMAGE_NAME"
    docker push --all-tags $IMAGE_NAME
fi
