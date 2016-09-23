import Fuse from "fuse.js";


const options = {
  include: ["matches"],
  shouldSort: true,
  tokenize: true,
  threshold: 0.4,
  location: 0,
  distance: 7200,
  maxPatternLength: 32,
  keys: [
    "title",
    "tags",
    "body"
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
