const generateIndex = bundles => {
  const index = [];

  bundles.forEach(bundle => {
    if (bundle.type !== "html") { return; }

    const baseUrl = bundle.dest
      .replace(/\.html$/, "")
      .replace(/\/index$/, "")
      .replace("index", "")
      .replace(/\/$/, "");

    const { $ } = bundle.module;
    const pageTitle = $("h1").text();

    const sections = $("section[id]");

    sections.each((idx, section) => {
      section = $(section);

      const sectionId = section.attr().id;
      const sectionTitle = section.find("h2").text() || section.attr()["data-title-alt"];

      // Without the clone, the text will include JavaScript content from <script> tags.
      const sectionBody =
        section
          .clone()
          .find("script")
            .remove()
          .end()
          .text()
          // Remove all extra whitespace.
          .replace(/\s+/g, " ");

      const keywordsTags = section.find("meta[name=keywords]");
      const sectionKeywords = Array.prototype.reduce.call(
        keywordsTags,
        (memo, tag) => {
          const content = $(meta).attr().content;
          return memo.concat(content && content.split(",") || []);
        },
        []
      );

      index.push({
        baseUrl,
        hashString: sectionId,
        title: `${pageTitle}: ${sectionTitle}`,
        body: sectionBody,
        tags: sectionKeywords.join(" ")
      });
    });
  });

  return index;
}


module.exports = (opts = {}) => {
  const dest = opts.dest || "site-index.json";

  return (override, transform) => {
    transform("generateBundles", bundles => {
      const index = generateIndex(bundles);

      return [
        {
          raw: JSON.stringify(index),
          dest,
          moduleHashes: [],
          type: "site-index"
        },
        ...bundles
      ];
    });

    override("generateRawBundles", bundle => {
      return bundle.type === "site-index" ?
        bundle :
        override.CONTINUE;
    });
  };
};
