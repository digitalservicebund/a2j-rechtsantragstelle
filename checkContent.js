import content from "./content.json" assert { type: "json" };

const pagesWithLists = content.pages
  // .filter((page) => page.attributes.slug !== "/kitchensink")
  .filter((page) =>
    page.attributes.content.some(
      (contentEntry) => contentEntry.__component === "page.list",
    ),
  );

console.log(
  `found ${pagesWithLists.length} pages with page.list components`,
  pagesWithLists.map((page) => page.attributes.slug),
);

let labelCount = 0;
let headlineCount = 0;
let bothCount = 0;

pagesWithLists.forEach((page) => {
  page.attributes.content
    .filter((contentEntry) => contentEntry.__component === "page.list")
    .forEach((listEntry) => {
      listEntry.items.forEach((listItem) => {
        if (listItem.label !== null) labelCount += 1;
        if (listItem.headline !== null) headlineCount += 1;
        if (listItem.label !== null && listItem.headline !== null)
          bothCount += 1;
      });
    });
});
console.log({ labelCount, headlineCount, bothCount });
