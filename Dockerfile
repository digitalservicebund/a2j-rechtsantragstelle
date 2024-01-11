# Needed for specifying source image as --build-arg, which is then used as COPY --from=
ARG CONTENT_IMAGE=content
ARG APP_IMAGE=app

FROM node:20-alpine AS app-base
WORKDIR /a2j-rast
COPY ./node_modules ./node_modules/
COPY ./build ./build/
COPY ./public ./public/
COPY ./start.sh ./server.js package.json package-lock.json ./
RUN npm prune --omit=dev

FROM scratch AS app
COPY --link --from=app-base  /a2j-rast/node_modules /node_modules/
COPY --link --from=app-base  /a2j-rast/build /build/
COPY --link --from=app-base  /a2j-rast/public /public/
COPY --link --from=app-base  /a2j-rast/start.sh  /a2j-rast/server.js /

FROM scratch AS content
COPY ./content.json ./server.js /

# === PROD IMAGE
FROM ${CONTENT_IMAGE} AS contentStageForCopy
FROM ${APP_IMAGE} AS appStageForCopy
FROM node:20-alpine AS prod
RUN apk add --no-cache dumb-init && rm -rf /var/cache/apk/*

USER node
WORKDIR /a2j-rast
COPY --link --chown=node:node --from=appStageForCopy / ./
COPY --link --from=contentStageForCopy /content.json ./
EXPOSE 3000
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["sh", "./start.sh"]
