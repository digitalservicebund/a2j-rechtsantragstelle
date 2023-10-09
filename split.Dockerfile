# This multi-stage docker build splits into three images.
# This allows independent rebuilding of the app or the content:
# 1. content image: scratch (empty) image, only containing the content.json
# 2. app image: npm build (including storybook)
# 3. prod image: combine content from (1.) and app build from (2.)

# This images allow for specifying source image as --build-arg, which is then used as COPY --from=
ARG CONTENT_IMAGE=content
ARG APP_IMAGE=app

FROM node:18.18.0-alpine3.18 AS base
WORKDIR /a2j-rast
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci

# === CONTENT BUILD
FROM base AS content-fetch
ARG STRAPI_API
ARG STRAPI_ACCESS_KEY
ENV STRAPI_API=$STRAPI_API
ENV STRAPI_ACCESS_KEY=$STRAPI_ACCESS_KEY
ADD app/services/ app/services/
RUN npm run dumpCmsToFile 

FROM scratch AS content
COPY --from=content-fetch /a2j-rast/content.json /

# === APP BUILD
FROM base AS app-builder
WORKDIR /a2j-rast
ADD app/ app/
ADD public/ public/
ADD .storybook/ .storybook/
ADD stories/ stories/
COPY remix.config.js tailwind.config.js postcss.config.js .babelrc.json start.sh server.js ./
RUN npm run build && npm run build-storybook && npm prune --omit=dev

FROM scratch AS app
# Specify here exactly what files & folders should end up in the final app image
COPY --from=app-builder /a2j-rast/node_modules /node_modules/
COPY --from=app-builder /a2j-rast/build /build/
COPY --from=app-builder /a2j-rast/public /public/
COPY --from=app-builder start.sh server.js package.json tsconfig.json /
COPY --from=app-builder /a2j-rast/app /app/

# === PROD IMAGE
FROM ${CONTENT_IMAGE} AS contentStageForCopy
FROM ${APP_IMAGE} AS appStageForCopy
FROM node:18-alpine AS prod
RUN apk add --no-cache dumb-init && rm -rf /var/cache/apk/*

USER node
WORKDIR /a2j-rast
COPY --link --chown=node:node --from=appStageForCopy / ./
COPY --link --from=contentStageForCopy /content.json ./
EXPOSE 3000
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["sh", "./start.sh"]
