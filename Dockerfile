# Needed for specifying source image as --build-arg, which is then used as COPY --from=
ARG CONTENT_IMAGE=content
ARG APP_IMAGE=app

FROM node:20-alpine AS app-base
WORKDIR /a2j
COPY package.json package-lock.json ./
RUN npm ci --include=prod

FROM scratch AS app
WORKDIR /a2j-app
COPY --link --from=app-base /a2j/node_modules ./node_modules/
COPY ./build ./build/
COPY ./public ./public/
COPY ./app/services ./app/services/
COPY ./start.sh  ./server.js ./

FROM scratch AS content
COPY ./content.json /

# === PROD IMAGE
FROM ${CONTENT_IMAGE} AS contentStageForCopy
FROM ${APP_IMAGE} AS appStageForCopy
FROM node:20-alpine AS prod
RUN apk add --no-cache dumb-init && rm -rf /var/cache/apk/*

USER node
WORKDIR /a2j
COPY --link --chown=node:node --from=appStageForCopy /a2j-app/ ./
COPY --link --from=contentStageForCopy /content.json ./
EXPOSE 3000
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["sh", "./start.sh"]
