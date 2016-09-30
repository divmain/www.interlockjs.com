import { h, render } from "preact";
import loadIndex from "./_site-search/load-index";
import SearchWidget from "./_site-search/search-widget";


loadIndex().then(index => {
  const ctaSearchButton = document.querySelector("#cta-search-button") || null;

  render(
    <SearchWidget index={index} listenTo={ctaSearchButton} />,
    document.querySelector("body > .header")
  );
});
