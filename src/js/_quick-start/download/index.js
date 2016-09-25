import { h } from "preact";

import TarFile from "../tar-file";

import buildRootDir from "./build-root-dir";
import buildIlkConfig from "./build-ilk-config";
import buildSrcDir from "./build-src-dir";


const downloadTarFile = props => {
  const tarFile = new TarFile(`${props.projectName}.tar`);
  buildRootDir(tarFile, props);
  buildIlkConfig(tarFile, props);
  buildSrcDir(tarFile, props);
  tarFile.save();
};

export default props => {
  const download = ev => {
    ev.preventDefault();
    downloadTarFile(props);
  };

  return (
    <div className="download-wrapper">
      <button onClick={download}>Download .tar file</button>
    </div>
  );
};
