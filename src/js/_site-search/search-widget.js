import { h, Component } from 'preact';
import maxBy from "lodash/maxBy";

const CONTEXT_SIZE = 80;


const getLinkBehavior = (baseUrl, hashString, setExpanded) => {
  let href;
  let onClick;

  baseUrl = `/${baseUrl}`;

  if (baseUrl === location.pathname) {
    href = `#${hashString}`;
    onClick = ev => {
      ev && ev.preventDefault();
      window.scrollTo(href)();
      setExpanded(false);
    };
  } else {
    href = `${baseUrl}#${hashString}`;
    onClick = null;
  }

  return { href, onClick };
};

const getBestIndex = indices => maxBy(indices, index => {
  const [ start, end ] = index;
  return end - start;
});

const getContext = (item, matchEntry) => {
  const { indices, key } = matchEntry;

  if (key === "title") { return null; }

  const matchValue = item[key];

  const [ start, end ] = getBestIndex(indices);

  // Constrain search context to specific character length.
  const match = matchValue.slice(start, end + 1);
  let before = matchValue.slice(start - CONTEXT_SIZE, start);
  let after = matchValue.slice(end + 1, end + CONTEXT_SIZE);

  const unabridgedLength = match.length + before.length + after.length;
  if (unabridgedLength > CONTEXT_SIZE) {
    const charPadding = Math.floor((CONTEXT_SIZE - match.length) / 2);
    before = before.slice(before.length - charPadding);
    after = after.slice(0, charPadding);
  }

  return {
    match: matchValue.slice(start, end + 1),
    before,
    after
  };
};

const SearchResult = props => {
  const { result, location, selected, setExpanded } = props;
  const { item, matches } = result;
  const { baseUrl, hashString, title, body } = item;

  const { href, onClick } = getLinkBehavior(baseUrl, hashString, setExpanded);
  const context = getContext(item, matches[0]);

  return (
    <a
      className={`search-result${selected ? " selected" : ""}`}
      href={`${href}`}
      onClick={onClick}
    >
      <span className="search-result-title">{title}</span>
      { context ? (
        <span className="search-result-context">
          <span className="before">{context.before}</span>
          <span className="match">{context.match}</span>
          <span className="after">{context.after}</span>
        </span>
        ) :
        null
      }
      
    </a>
  );
};

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
    const el = this.base.querySelector(".search-bar");
    el.select();
    el.focus();
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
      if (selectedIdx < lastResultIdx) {
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
      setExpanded,
      onClose
    } = this.props;

    const onClick = ev => {
      if (ev.target.classList.contains("search-popup")) {
        onClose();
      }
    };

    return (
      <div className="search-popup" onClick={onClick}>
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
      selectedIdx: 0,
      results: []
    };
    this.onEscapeKeyDown = this.onEscapeKeyDown.bind(this);
  }

  componentDidMount () {
    // Register global key-press listener for ESC.
    document.body.addEventListener("keydown", this.onEscapeKeyDown);

    if (this.props.listenTo) {
      this.globalListener = this.props.listenTo.addEventListener("click", () => {
        this.setState({ expanded: true });
      });
    }
  }

  componentWillUnmount () {
    document.body.removeEventListener("keydown", this.onEscapeKeyDown);

    if (this.props.listenTo && this.globalListener) {
      this.props.listenTo.removeEventListener(this.globalListener);
      this.globalListener = null;
    }
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

    this.setState({
      results,
      selectedIdx: 0
    });
  }

  render () {
    const { expanded, results, selectedIdx } = this.state;

    return (
      <div className="search-widget">
        <span
          className="search-button ion-search"
          onClick={e => { this.setState({ expanded: !expanded }) }}
        />
        { expanded ?
          <SearchBar
            selectedIdx={selectedIdx}
            lastResultIdx={results.length - 1}
            setSelectedIdx={val => this.setState({ selectedIdx: val })}
            setExpanded={val => this.setState({ expanded: val })}
            results={results}
            setSearchText={this.setSearchText.bind(this)}
            onClose={() => this.setState({ expanded: false })}
          /> :
          null }
      </div>
    );
  }
}
