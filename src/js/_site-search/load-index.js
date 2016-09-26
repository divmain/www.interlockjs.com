import Fuse from "fuse.js";


const options = {
  include: ["matches"],
  shouldSort: true,
  tokenize: true,
  threshold: 0.3,
  location: 0,
  distance: 7200,
  maxPatternLength: 32,
  keys: [
    { name: "title", weight: 0.8 },
    { name: "tags", weight: 0.7 },
    { name: "body", weight: 0.5 }
  ]
};

const fetchIndexJson = () =>
  fetch("/site-index.json").then(res => res.json());

const buildIndex = () => {
  return fetchIndexJson().then(json => new Fuse(json, options));
};

let data;
export default () => {
  return data || (data = buildIndex());
};
