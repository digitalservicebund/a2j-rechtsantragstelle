# Needed for specifying source image as --build-arg, which is then used as COPY --from=
ARG CONTENT_IMAGE=content
ARG APP_IMAGE=app

FROM node:20-alpine AS app-base
WORKDIR /a2j

# TODO: Remove this Linux update and the force update for cross-spawn once the issue is fixed
RUN apk update && \
  apk add --no-cache libcrypto3=3.3.2-r1 libssl3=3.3.2-r1
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --omit=optional && \
  # Update npm and fix cross-spawn vulnerability
  npm uninstall -g cross-spawn && \
  npm cache clean --force && \
  find /usr/local/lib/node_modules -name "cross-spawn" -type d -exec rm -rf {} + && \
  npm install -g cross-spawn@7.0.6 --force

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

# TODO: Remove this Linux update and the force update for cross-spawn once the issue is fixed
RUN apk update && \
  apk add --no-cache dumb-init libcrypto3=3.3.2-r1 libssl3=3.3.2-r1 && \
  npm uninstall -g cross-spawn && \
  npm cache clean --force && \
  find /usr/local/lib/node_modules -name "cross-spawn" -type d -exec rm -rf {} + && \
  npm install -g cross-spawn@7.0.6 --force

USER node
WORKDIR /a2j
COPY --link --chown=node:node --from=appStageForCopy /a2j-app/ ./
COPY --link --from=contentStageForCopy /content.json ./
EXPOSE 3000
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["sh", "./start.sh"]
