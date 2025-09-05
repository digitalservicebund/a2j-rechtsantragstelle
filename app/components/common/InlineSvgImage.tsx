type InlineSvgProps = {
  svgString: string;
  width: number;
  altText: string;
};

export const InlineSvgImage = ({
  svgString,
  width,
  altText,
}: InlineSvgProps) => {
  let svgElementString = svgString.slice(svgString.search("<svg")); // drop anything before opening tag <svg

  const replacements = [
    [">", ` class="svg-image">`], // Ensure black SVG paths don't disappear in high-contrast mode. For implementation details check app/styles.css
    [">", ` role="img">`],
    ["height", `originalHeight`],
    ["width", `originalWidth`],
    // [">", ` height="100%">`],
    [">", ` width="${width}">`],
    altText && [">", `><title>${altText}</title>`],
    [">", ` aria-hidden='${!!altText}'>`], // If the alt text is empty, the image is decorative, so we set aria-hidden to true
  ] as const;

  replacements.forEach(([search, replace]) => {
    svgElementString = svgElementString.replace(search, replace);
  });

  return <div dangerouslySetInnerHTML={{ __html: svgElementString }} />;
};
