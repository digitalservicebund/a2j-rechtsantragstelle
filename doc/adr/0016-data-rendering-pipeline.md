# 16. Data Rendering pipeline overview

Date: 2025-01-15

## Status

Accepted

## Context

Our current data pipeline looks roughly like this:

1. User visits a Formular site, `formular.server.ts` is triggered, fetching the Strapi content for the given page
2. Strapi content is passed to `<FormFlowPage />`, being split into `content` and `formElements`
   1. `content` gets rendered by `<PageContent />`, containing a switch statement that maps strapi components with their React equivalent (for example: `basic.heading` gets mapped to `<Heading>`)
      1. Translating the Strapi content into component props takes place in the compatibility function, `getXXXProps()`, in this case, `getHeaderProps()`
      2. The actual Strapi content emitted is markdown, which we then convert to html and sanitize inside of `<RichText />`
   2. `formElements` follows a similar pathway to the steps outlined above, but it gets rendered by `<ValidatedFlowForm />`, which builds and handles form field validations
      1. `<StrapiFormComponents />` is akin to `<PageContent />` (see above), in that it takes a strapi component, like `form-elements.time-input` and maps it to `<StrapiTimeInput />`

Our current data rendering pipeline from Strapi to the Application has some inefficiencies:

- As explained in (2)(i)(b) above, we're both rendering the html and sanitizing it to remove potentially malicious content on the _frontend_. This is completely unnecessary, bad for performance and potentially bad for security. We should be rendering and sanitizing the markdown on the server-side.
- As mentioned in (2)(ii)(a), there's an unnecessary front-end layer (Strapi Components) responsible for validation and rendering, while the data is already being validated in the back end using Zod. This makes the Strapi Component compatibility layer redundant.

## Decision(s)

- Instead of having `<RichText />` both render the html and sanitize it, we're going to perform these operations on the server-side (inside the loader or the CMS fetching) and inject it down into `<RichText />`.

- Instead of having Strapi content validated and rendered within Strapi components like so:

  ```
  <StrapiInput {...strapiContent} />;
  ```

  We'll instead begin using `getXXXProps()` functions as a translation layer, before passing to the actual underylying components, just like we're doing for `<PageContent />`:

  ```
  <Heading {...getHeadingProps(strapiContent)} />
  ```

## Consequences

- Server-side html rendering and sanitization will both improve performance and reduce the security concerns of handling these operations client-side.

  - This also means that we'll have to use a lot of `dangerouslySetInnerHTML`

- Removing the `StrapiComponent` compatibility layer in favor of `getXXXProps()` functions should both improve render performance (we'll no longer be double-validating and double-rendering Strapi content) and set us up nicely to begin rendering markdown on the server-side (see previous point). It also reduces the cognitive overhead of having to keep track of two separate rendering methods, making code maintenance and onboarding smoother as well.

## Next Actions

- Begin rendering markdown on the server-side, instead of on the client-side.
  - https://app.asana.com/0/1203259475859667/1208848279655976/f
- Remove unnecessary StrapiComponent compatibility layer
  - https://app.asana.com/0/1203259475859667/1208387119484037/f
