FROM node:18-alpine3.18 AS build

ARG COMMIT_SHA
ENV APP_VERSION=$COMMIT_SHA

# Create app directory
WORKDIR /src
# Required files are whitelisted in dockerignore
COPY . ./
RUN npm pkg delete scripts.prepare && npm ci && npm run build && npm run build-storybook && npm prune --production

FROM node:18-alpine3.18
RUN apk add --no-cache dumb-init \
  && rm -rf /var/cache/apk/*

USER node
ENV ENVIRONMENT=production
ARG COMMIT_SHA
ENV APP_VERSION=$COMMIT_SHA

WORKDIR /home/node/src
COPY --chown=node:node --from=build /src ./
# Purge source maps
RUN find public/build -name '*.map' -exec rm {} \;
EXPOSE 3000
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["sh", "./start.sh"]
