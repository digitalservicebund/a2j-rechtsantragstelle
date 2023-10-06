# This multi-stage docker build splits into three images.
# This allows independent rebuilding of the app or the content:
# 1. content image: scratch (empty) image, only containing the content.json
# 2. app image: npm build (including storybook)
# 3. prod image: combine content from (1.) and app build from (2.)

FROM node:18.18.0-alpine3.18 AS base
WORKDIR /a2j-rast
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./

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

# This meta image allows for specifying --build-arg="CONTENT_IMAGE=a2j-rechtsantragstelle-content"
# This is later used to copy from, see `COPY --link --from=contentStageForCopy`
ARG CONTENT_IMAGE=content
FROM ${CONTENT_IMAGE} AS contentStageForCopy

# === APP BUILD
FROM base AS app-build
WORKDIR /a2j-rast
ADD app/ app/
ADD public/ public/
ADD .storybook/ .storybook/
ADD stories/ stories/
COPY remix.config.js tailwind.config.js postcss.config.js .babelrc.json ./
RUN npm run build && npm run build-storybook && npm prune --omit=dev

# === PROD IMAGE
FROM node:18.18.0-alpine3.18 AS app
ARG CONTENT_IMAGE
RUN apk add --no-cache dumb-init && rm -rf /var/cache/apk/*

USER node
WORKDIR /a2j-rast
COPY --chown=node:node --from=app-build /a2j-rast/node_modules ./node_modules/
COPY --chown=node:node --from=app-build /a2j-rast/build ./build/
COPY --chown=node:node --from=app-build /a2j-rast/public ./public/
COPY --link --from=contentStageForCopy /content.json ./
COPY start.sh server.js package.json tsconfig.json ./
EXPOSE 3000
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["sh", "./start.sh"]
