/**
 * a jest-only filter of package.json files to transform a package.json before jest processes it
 * > by combining defaultResolver and packageFilter we can implement a package.json "pre-processor"
 * > that allows us to change how the default resolver will resolve modules.
 * @see: https://jestjs.io/docs/configuration/#resolver-string
 */

module.exports = (path, options) => {
  return options.defaultResolver(path, {
    ...options,
    packageFilter: (pkg) => {
      /*
       * Workaround for an error when running jest:
       * > Jest encountered an unexpected token
       * > […]
       * > Details:
       * > ./node_modules/@web3-storage/multipart-parser/esm/src/index.js:1
       * > ({"Object.<anonymous>":function(module,exports,require,__dirname,__filename,jest){import {
       * > SyntaxError: Cannot use import statement outside a module
       * > import { useField } from "remix-validated-form";
       *
       * Explanation:
       * Jest tries to use an ESM version of @web3-storage/multipart-parser
       * @see https://github.com/microsoft/accessibility-insights-web/pull/5421#issuecomment-1109168149
       * Quoting from there:
       *
       * > jest-environment-jsdom 28+ tries to use browser exports instead of default exports,
       * > but uuid only offers an ESM browser export and not a CommonJS one. Jest does not yet
       * > support ESM modules natively, so this causes a Jest error related to trying to parse
       * > "export" syntax.
       *
       * > This workaround prevents Jest from considering uuid's module-based exports at all;
       * > it falls back to uuid's CommonJS+node "main" property.
       *
       * > Once we're able to migrate our Jest config to ESM and a browser crypto
       * > implementation is available for the browser+ESM version of uuid to use (eg, via
       * > https://github.com/jsdom/jsdom/pull/3352 or a similar polyfill), this can go away.
       *
       * Removing the exports key from @web3-storage/multipart-parser's package.json makes sure that
       * jest picks up the "right" cjs browser version.
       *
       * Notes (I might be wrong):
       * - package does file upload in forms (dependecy of Remix)
       * - package offers different versions for browser and server (node)
       * - Remix client bundles are ESM-only(?) => no issue with that package outside jest test run
       * - Jest+jsdom => tries to use browser version (actually good) but needs cjs version as it's
       *   running in server environment(?)
       *
       */
      if (pkg.name === "@web3-storage/multipart-parser") {
        delete pkg["exports"];
      }

      // same with "nanoid"
      if (pkg.name === "nanoid") {
        delete pkg["exports"];
      }

      return pkg;
    },
  });
};
