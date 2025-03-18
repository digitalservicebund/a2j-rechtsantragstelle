# 21. Supporting Users Without JavaScript

## Status

- 2025-02-11: Drafted
- 2025-02-25: Accepted
- 2025-04-04: Edited (Added chronological status)

## Context

Currently, our application is built with the principle that core functionality should be accessible and usable even without client-side JavaScript.
This aligns with our goal of ensuring a resilient and broadly accessible experience.

We recognize that "non-JS users" aren't just those with JavaScript disabled, but also include users with slow connections, JavaScript errors, or while the JavaScript is still downloading ([Everyone has JavaScript, right?](https://www.kryogenix.org/code/browser/everyonehasjs.html)).
However, we are now encountering situations where specific features, like the upcoming upload component or the auto-suggest input, require JavaScript to work intuitively.
Our approach needs to address the balance between rich interactive features (requiring JavaScript) and the core usability for all users.

Our framework Remix is built with progressive enhancement in mind, providing a functional experience even during JavaScript loading or failures.

## Decision

We will adopt a [**Progressive Enhancement**](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) strategy for all features.
This means:

1.  **Core Functionality First:** All essential features must be fully functional and accessible without JavaScript. This ensures that every user, regardless of their JavaScript capabilities, can accomplish the primary tasks the application is designed for.

2.  **Enhancement with JavaScript:** JavaScript will be used to _enhance_ the user experience where appropriate. This allows us to add interactive elements, richer interfaces, and improved performance for users with JavaScript enabled. Examples include the auto-suggest input, dynamic form validation, and advanced UI components.

3.  **Graceful Degradation:** If JavaScript fails to load or execute, the enhanced features should degrade gracefully, ensuring that the core functionality remains intact. This might mean a less visually appealing or less interactive experience, but it should never result in broken or inaccessible functionality. Components should be designed in isolation to minimize the impact of JavaScript failures.

4.  **Testing Strategy:** Our testing strategy will include both JavaScript-enabled and JavaScript-disabled scenarios. This will ensure that we are continuously validating the accessibility and functionality of our application for all users.

This is also suggested by the GOV.UK Service Manual for the governmental area (see [here](https://www.gov.uk/service-manual/technology/designing-for-different-browsers-and-devices) and [here](https://www.gov.uk/service-manual/technology/using-progressive-enhancement)).

## Consequences:

- **Positive:**

  - Improved accessibility for users with disabilities, limited bandwidth, or JavaScript disabled/unavailable.
  - Increased resilience to network issues and JavaScript errors.
  - Simplified testing of core functionality.
  - Alignment with best practices for web development.

- **Negative:**

  - Increased development effort for implementing features in both a non-JS and JS version (though this is mitigated by focusing on core functionality first).
  - Potential limitations on the complexity of interactive features in non-JS mode.
  - Requires a consistent and disciplined approach to development and testing to ensure adherence to the progressive enhancement strategy.
