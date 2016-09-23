import { h, render } from "preact";
import loadIndex from "./_site-search/load-index";
import SearchWidget from "./_site-search/search-widget";


loadIndex().then(index => {
  render(
    <SearchWidget index={index} />,
    document.querySelector("body > .header")
  );
});
