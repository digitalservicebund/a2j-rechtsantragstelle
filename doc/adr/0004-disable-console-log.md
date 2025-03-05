# 4. Disable console.log

## Status

- 2024-04-24: Drafted
- 2024-04-26: Merged
- 2024-05-17: Edited (Fixed title index)
- 2025-04-04: Edited (Added chronological status)

## Context

Currently, `console.log` is utilized for logging in our codebase, often left temporarily during development. This occasionally results in unexpected debug logs being committed to the main branch.

To address this, research has been conducted to identify a suitable logger to replace permanent `console.log` instances in our application. The following options have been explored:

1. [Pino](https://getpino.io/#/)
2. [Winston](https://github.com/winstonjs/winston#readme)
3. [Log4js-node](https://log4js-node.github.io/log4js-node/)
4. [Bunyan](https://github.com/trentm/node-bunyan#readme)
5. Keep console.log and integrate eslint to disable it

The pros and cons of these options are described below:

| Options                                                | Pro                                                                                                                                                                                                                                                                                                                              | Cons                                                                                                                                                                                              |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1) Pino                                                | 1. Stable and maintainable dependency (5 millions weekly downloads ) <br> 2. No default configuration and very easy to use <br> 3. Supports Nodejs framework integrations (Express, Fastify and etc.) <br> 4. High customization logger <br> 5. Can be used either in back or front-end <br> 6. Supports JSON logging by default | 1. Not possible to logging uncaught exceptions                                                                                                                                                    |
| 2) Winston                                             | 1. Stable and maintainable dependency (9 millions weekly downloads ) <br> 2. High customization logger <br> 3. Possible to logging uncaught exceptions <br> 4. Supports JSON logging by default                                                                                                                                  | 1. It is recommend to create your own logger <br> 2. It is a Nodejs logger, it might require other dependencies to logger in the client-side                                                      |
| 3) Log4js-node                                         | 1. Stable dependency (3 millions weekly downloads) <br> 2. High customization logger <br> 3. Integration with Express                                                                                                                                                                                                            | 1. Not so well maintained, last publish version was one year ago <br> 2. Does not support JSON logging by default <br> 3. It is a Nodejs logger, it might require other dependencies to logger it |
| 4) Bunyan                                              | 1. Stable dependency (1 millions weekly downloads) <br> 2. Supports JSON logging by default <br> 3. Possible to logging uncaught exceptions <br> 4. Can be used either in back or front-end (in the frontend better to use another tool) <br>                                                                                    | 1. Not maintained anymore, last publish version was 3 years ago <br> 2. Partially customizable, it doesn't have so many options as Pino, Winston and Log4js-node                                  |
| 5) Keep console.log and integrate eslint to disable it | 1. No need to add a new dependency <br> 2. Less work <br> 3. Can be used either in back and front-end                                                                                                                                                                                                                            | 1. We are forced to add eslint disabled comments where we need logs <br> 2. We lose NodeJs framework integrations and future possibilities to monitoring our service                              |

## Decision

As a group we decided for the option 5 (`Keep console.log and integrate eslint to disable it`)

- This option requires minimal configuration and is easily implemented.
- Existing infrastructure logs in our Ingress framework allow for monitoring webpage access

While the team is content with this decision, we acknowledge the potential consideration of options 1 and 2 for long-term planning.

## Consequences

- Continued usage of `console.log` in the codebase, supplemented by eslint disabled comments for logging.
- Absence of a robust logger framework may limit integration with Node.js frameworks and impede comprehensive monitoring and alerting for webpage access.
