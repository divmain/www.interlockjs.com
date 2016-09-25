import { h } from "preact";


export const FileTypes = props => {
  const {
    esnext,
    setEsnext,
    css,
    setCss,
    stylus,
    setStylus,
    html,
    setHtml,
    json,
    setJson,
    raw,
    setRaw
  } = props;

  return (
    <div className="quick-start-section">
      <div className="prompt">
        What file-types will you be working with?
      </div>
      <div className="quick-start-options">
        <input
          type="checkbox"
          checked={esnext}
          name="esnext"
          id="esnext"
          onClick={setEsnext}
        />
        <label for="esnext">ESnext</label>
        <input
          type="checkbox"
          checked={css}
          name="css"
          id="css"
          onClick={setCss}
        />
        <label for="css">CSS</label>
        <input
          type="checkbox"
          checked={stylus}
          name="stylus"
          id="stylus"
          onClick={setStylus}
        />
        <label for="stylus">Stylus</label>
        <input
          type="checkbox"
          checked={html}
          name="html"
          id="html"
          onClick={setHtml}
        />
        <label for="html">HTML</label>
        <input
          type="checkbox"
          checked={json}
          name="json"
          id="json"
          onClick={setJson}
        />
        <label for="json">JSON</label>
        <input
          type="checkbox"
          checked={raw}
          name="raw"
          id="raw"
          onClick={setRaw}
        />
        <label for="raw">Raw files</label>
      </div>
    </div>
  );
};

export const defaults = {
  esnext: true,
  css: true,
  stylus: false,
  html: true,
  json: false,
  raw: false
};
