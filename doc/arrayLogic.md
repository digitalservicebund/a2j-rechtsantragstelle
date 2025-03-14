### How to add a new Array page to a form flow (UNDER CONSTRUCTION)

(This section is still under construction, as there are still open questions about what the generic array case is [or should be] and how to document it)
Form flow arrays should, generally speaking, be defined like the following inside of `flow.json`:

```
"<Plural name>": {
   "initial": "<Plural name>-frage",
   "states": {
      "<Plural name>-frage": {
         "on":
            {
            "SUBMIT": [
               {
                  "guard": "hasOther<Plural name>",
                  "target": "uebersicht"
               }
            ],
            "BACK": "<Previous step>"
         }
      },
      "uebersicht": {
         "on": {
            "SUBMIT": [
               {
                  "guard": "hasOther<Plural name>AndEmptyArray",
                  "target": "warnung"
               }
            ],
            "BACK": "<Plural name>-frage",
            "add-<Plural name>": {
               "guard": "isValid<Plural name>ArrayIndex",
               "target": "<Singular name>"
            }
         }
      },
      "warnung": {
         "on": {
            "BACK": "uebersicht",
            "SUBMIT": "<Next Step>"
         }
      },
      "<Singular name>": {
         "initial": "daten",
         "states": {
            "daten": {
               "on": {
                  "BACK": "#<Plural name>.uebersicht",
                  "SUBMIT": "#<Plural name>.uebersicht"
               }
            }
         }
      }
   }
}
```

Note the following:

- The step begins with a `____-frage` step, usually a yes/no radio page, indicating whether or not to show the ArraySummary page at all. E.g. "Do you have any additional income you would like to report?"
- The `uebersicht` page is the ArraySummary, which will display all the items the user has added, along with an "Add item" button
- `warnung` is necessary as a type of form validation, to ensure that the user has entered >= 1 item (actual form validation would be tricky here, so displaying a warning to the user is the next best thing)
- Finally, the `<Singular name>` step is basically a placeholder for the data entered per item (`daten`), so that the url reads as `<Singular name>/<item number>/daten` e.g. `arbeitsausgabe/0/daten`

After these steps have been entered in `flow.json`, we need to define the matching `ArrayConfigServer` in `index.ts` of the respective flow:

```
config: _.merge(<flow>, {
   meta: {
      arrays: {
         <Plural name>: {
            url: "/<flowId>/<stepId>/<Plural name>/<Singular name>",
            initialInputUrl: "daten",
            event: "add-<Plural name>",
         },
      } satisfies Partial<Record<AllContextKeys, ArrayConfigServer>>,
   }
})
```

(If multiple `ArrayConfigServer`s are being added, it might be sensible to add them to an `arrayConfigurations.ts` file and spread them in)
