# 15. Move away from StrapiComponent Rendering

Date: 2025-01-13

## Status

Accepted

## Context

Our current approach for validating and rendering components from Strapi to the Application has some inefficiencies. There's an unnecessary front-end layer (Strapi Components) responsible for validation and rendering, while the data is already being validated in the back end using Zod. This makes the Strapi Components redundant.

## Decision

Instead of having Strapi content validated and rendered within Strapi components like so:

```
<StrapiInput {...strapiContent} />;
```

We'll instead begin using `getXXXProps()` functions as a translation layer, before passing to the actual underylying components, like so:

```
<Heading {...getHeadingProps(strapiContent)} />
```

## Consequences

This should both improve render performance (we'll no longer be double-validating and double-rendering Strapi content) and set us up nicely to begin rendering markdown on the server-side (see next point). It also reduces the cognitive overhead of having to keep track of two separate rendering methods, making code maintenance and onboarding smoother as well.

## Next Actions

Next, to improve performance, we'll begin rendering markdown on the server-side, instead of on the client-side.
https://app.asana.com/0/1203259475859667/1208848279655976/f
