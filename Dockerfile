# Needed for specifying source image as --build-arg, which is then used as COPY --from=
ARG CONTENT_IMAGE=content
ARG APP_IMAGE=app

FROM node:20-alpine AS app-base

# update the latest alpine version and resolve security issues
RUN apk update && apk upgrade --no-cache

WORKDIR /a2j

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --omit=optional

FROM scratch AS app
WORKDIR /a2j-app
COPY --link --from=app-base /a2j/node_modules ./node_modules/
COPY ./build ./build/
COPY ./app/services ./app/services/
COPY ./data ./data/
COPY ./public ./public/
COPY ./start.sh ./server.js package.json ./

FROM scratch AS content
COPY ./content.json /

# === PROD IMAGE
FROM ${CONTENT_IMAGE} AS contentStageForCopy
FROM ${APP_IMAGE} AS appStageForCopy
FROM node:20-alpine AS prod

# TODO: Check https://hub.docker.com/r/library/node/tags?name=alpine3.20
# - Remove npm upgrade if CVE-2024-21538 is fixed (https://scout.docker.com/vulnerabilities/id/CVE-2024-21538?s=github) 
RUN npm update -g npm && npm cache clean --force && \
    apk add --no-cache dumb-init && rm -rf /var/cache/apk/*

USER node
WORKDIR /a2j
COPY --link --chown=node:node --from=appStageForCopy /a2j-app/ ./
COPY --link --from=contentStageForCopy /content.json ./
EXPOSE 3000
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["sh", "./start.sh"]
