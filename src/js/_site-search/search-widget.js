import { h, render, Component } from 'preact';


const getSurgeUrl = baseUrl => `/${baseUrl}`
  .replace(/\.html$/, "")
  .replace(/\/index$/, "")
  .replace(/\/$/, "");

const getLinkBehavior = (baseUrl, hashString, setExpanded) => {
  let href;
  let onClick;

  const surgeUrl = getSurgeUrl(baseUrl);
  const currentPath = location.pathname.replace(/\/$/, "");

  if (surgeUrl === currentPath) {
    href = `#${hashString}`;
    onClick = ev => {
      ev && ev.preventDefault();
      window.scrollTo(href)();
      setExpanded(false);
    };
  } else {
    href = `${surgeUrl}#${hashString}`;
    onClick = null;
  }

  return { href, onClick };
};

const SearchResult = props => {
  const { result, location, selected, setExpanded } = props;
  const { item, matches } = result;
  const { baseUrl, hashString, title, body, tags } = item;

  const { href, onClick } = getLinkBehavior(baseUrl, hashString, setExpanded);

  return (
    <a
      className={`search-result${selected ? " selected" : ""}`}
      href={`${href}`}
      onClick={onClick}
    >
      <span className="search-result-title">{title}</span>
      <span className="search-result-context">{tags}</span>
    </a>
  );
};


// {
//   "hash": "#definition-of-terms",
//   "search": "",
//   "pathname": "/docs/extensibility.html",
//   "port": "1337",
//   "hostname": "localhost",
//   "host": "localhost:1337",
//   "protocol": "http:",
//   "origin": "http://localhost:1337",
//   "href": "http://localhost:1337/docs/extensibility.html#definition-of-terms",
//   "ancestorOrigins": {}
// }

// {
//   "item": {
//     "baseUrl": "docs/extensibility.html",
//     "hashString": "learn-more",
//     "title": "Extensibility: Learn More",
//     "body": "Learn MoreTODO reach out in Gitter channel look over the cookbook examples read through the offical plugins ",
//     "tags": []
//   },
//   "matches": [
//     {
//       "indices": [
//         [
//           2,
//           2
//         ],
//         [
//           5,
//           5
//         ],
//         [
//           11,
//           11
//         ]
//       ],
//       "key": "title"
//     },
//     {
//       "indices": [
//         [
//           10,
//           10
//         ],
//         [
//           23,
//           23
//         ],
//         [
//           30,
//           31
//         ],
//         [
//           53,
//           53
//         ],
//         [
//           73,
//           73
//         ],
//         [
//           80,
//           80
//         ],
//         [
//           88,
//           88
//         ],
//         [
//           93,
//           94
//         ],
//         [
//           106,
//           106
//         ]
//       ],
//       "key": "body"
//     }
//   ]
// }

const SearchResults = props => {
  const { results, selectedIdx, setExpanded } = props;
  if (!results.length) { return null; }

  return (
    <div className="search-results">
      {results.map((result, idx) =>
        <SearchResult
          result={result}
          location={document.location}
          selected={idx === selectedIdx}
          setExpanded={setExpanded}
        />
      )}
    </div>
  );
};


class SearchBar extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.base.querySelector(".search-bar").focus();
  }

  onKeyDown (ev) {
    const {
      selectedIdx,
      lastResultIdx,
      setSelectedIdx
    } = this.props;

    if (ev.keyCode === 13) {
      // ENTER
      ev.preventDefault();
      this.gotoSelected();
    } else if (ev.keyCode === 38) {
      // UP
      ev.preventDefault();
      if (selectedIdx > 0) {
        setSelectedIdx(selectedIdx - 1);
      }
    } else if (ev.keyCode === 40) {
      // DOWN
      ev.preventDefault();
      if (selectedIdx === null) {
        setSelectedIdx(0);
      } else if (selectedIdx < lastResultIdx) {
        setSelectedIdx(selectedIdx + 1);
      }
    }
  }

  gotoSelected () {
    const { selectedIdx, results, setExpanded } = this.props;
    const result = results[selectedIdx];
    const { item } = result;
    const { baseUrl, hashString } = item;
    const { onClick, href } = getLinkBehavior(baseUrl, hashString, setExpanded);

    if (onClick) { return onClick(); }

    document.location = href;
  }

  render () {
    const {
      results,
      setSearchText,
      selectedIdx,
      setExpanded
    } = this.props;

    return (
      <div className="search-popup">
        <input
          type="text"
          className={`search-bar${results.length ? " has-results" : ""}`}
          onKeyDown={ev => this.onKeyDown(ev)}
          onInput={ev => setSearchText(ev.target.value)}
          placeholder="Enter your search term..."
        />
        { results.length ?
          <SearchResults
            results={results}
            selectedIdx={selectedIdx}
            setExpanded={setExpanded}
          /> :
          null }
      </div>
    );
  }
}

export default class SearchWidget extends Component {
  constructor (props) {
    super(props);
    this.index = props.index;
    this.state = {
      expanded: false,
      selectedIdx: null,
      results: []
    };
    this.onEscapeKeyDown = this.onEscapeKeyDown.bind(this);
  }

  componentDidMount () {
    // Register global key-press listener for ESC.
    document.body.addEventListener("keydown", this.onEscapeKeyDown);
  }

  componentWillUnmount () {
    document.body.removeEventListener("keydown", this.onEscapeKeyDown);
  }

  onEscapeKeyDown (ev) {
    if (ev.keyCode === 27) {
      this.setState({ expanded: !this.state.expanded })
    }
  }

  setSearchText (searchText) {
    const results = searchText.length ?
      this.index.search(searchText) :
      [];

    this.setState({ results });
  }

  render () {
    const { expanded, results } = this.state;

    return (
      <div className="search-widget">
        <span
          className="search-button ion-search"
          onClick={e => { this.setState({ expanded: !expanded }) }}
        />
        { expanded ?
          <SearchBar
            selectedIdx={this.state.selectedIdx}
            lastResultIdx={this.state.results.length - 1}
            setSelectedIdx={val => this.setState({ selectedIdx: val })}
            setExpanded={val => this.setState({ expanded: val })}
            results={results}
            setSearchText={this.setSearchText.bind(this)}
          /> :
          null }
      </div>
    );
  }
}
