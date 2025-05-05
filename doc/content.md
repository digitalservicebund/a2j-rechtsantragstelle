#### Strapi

<details>
<summary>Three options:</summary>

1. A local strapi instance:
   - [Start strapi locally](https://github.com/digitalservicebund/a2j-rechtsantragstelle-strapi),
   - configure `.env` with `CMS=STRAPI` and `STRAPI_API` pointing to your local strapi instance (`cp .env.example .env` should do the trick)
2. Using the the deployed staging strapi instance:
   - Set `STRAPI_API=<STRAPI_STAGING_URL>/api` and set `STRAPI_ACCESS_KEY` to your token (create a new key in the strapi GUI at "Settings" > "API Tokens" > "Create new API Token")
3. Use a local content file:

   - Set `STRAPI_API` and `STRAPI_ACCESS_KEY` to point to staging like in option 2.
   - Set `CMS=FILE`
   - Run `npm run build:localContent` (should have generated a `content.json` file)

</details>

##### Locales

For each Strapi page, there are two locales: **Staging (sg)** and **Production (de)**.
This is because while we're able to feature flag code changes in PostHog, we aren't able to feature flag _content_ changes in the CMS. E.g. If we want to test out _content_ changes, like different components on the same page, we must use Strapi's Locale feature, as Multi-Environments is only supported by [Strapi Cloud](https://github.com/strapi/documentation/pull/2229).

The App first checks to [see if valid staging data exists](https://github.com/digitalservicebund/a2j-rechtsantragstelle/blob/9b242255fefc4917abbf97a297229b828d9a2ef5/app/services/cms/getStrapiEntryFromApi.ts#L47), and if not, [pull the requested data from the production environment](https://github.com/digitalservicebund/a2j-rechtsantragstelle/blob/9b242255fefc4917abbf97a297229b828d9a2ef5/app/services/cms/getStrapiEntryFromApi.ts#L56-L57). By default, we develop features in the Production environment.
