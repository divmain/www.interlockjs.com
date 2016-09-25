import Tar from "tar-js";


// This snippet should not be necessary, since `Blob` can take an 
// array of ArrayBuffers just as easily as it can an array of strings.
// However, we'll keep in here for now in case the need arises again...
//
//    const uint8ToString = buffer => buffer.reduce(
//      (memo, charCode) => memo + String.fromCharCode(charCode),
//      ""
//    );
//

export default class TarFile {
  constructor (filename) {
    this._tar = new Tar();
    this._filename = filename;
  }

  addFile(filename, content, mode) {
    const options = { mode: mode || "644" };
    this._tar.append(filename, content, options);
  }

  save() {
    const buffer = this._tar.out.buffer;
    const blob = new Blob([ buffer ], { type: "octet/stream" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = this._filename;

    document.body.appendChild(a);
    a.click();
    a.parentNode.removeChild(a);

    URL.revokeObjectURL(url);
  }
}
