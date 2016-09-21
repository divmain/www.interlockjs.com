const elasticlunr = require("elasticlunr");


module.exports = (opts = {}) => {
  const dest = opts.dest || "site-index.json";

  return (override, transform) => {
    transform("generateBundles", bundles => {
      const index = elasticlunr(function () {
        this.setRef("url");
        this.addField("title");
        this.addField("tags");
        this.addField("body");
      });

      bundles.forEach(bundle => {
        if (bundle.type !== "html") { return; }

        const { $ } = bundle.module;
        const title = $("head title").text();
        const body = $("body").text();
        const metaKwTags = $("meta[name=keywords]");
        const keywords = Array.prototype.reduce.call(
          metaKwTags,
          (memo, meta) => {
            const kwContent = $(meta).attr().content;
            return memo.concat(content && content.split(",") || []);
          },
          []
        );

        index.addDoc({
          url: bundle.dest,
          tags: keywords.join(" "),
          title,
          body
        });
      })

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
