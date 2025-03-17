### How to add a new "Antrag" or form pdf to services/pdf/

1. Create a new folder for example: `prozesskostenhilfe`
2. Store the antrag or form pdf there: `prozesskostenhilfe/Erklaerung_Verhaeltnisse_Prozess_oder_Verfahrenskostenhilfe.pdf`
3. Run `npm run build:pdf`

After running the command, a new file named `prozesskostenhilfe.generated.ts` will be generated in the specified directory. You can use this file to fill out the PDF based on the input fields defined within it.
