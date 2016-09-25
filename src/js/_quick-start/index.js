import { h, Component } from "preact";

import { getProps } from "./util";
import Download from "./download";
import { ProjectType, defaults as projectTypeDefaults } from "./project-type";
import { FileTypes, defaults as fileTypeDefaults } from "./file-types";
import { AddlFeatures, defaults as addlFeaturesDefaults } from "./addl-features";
import {
  SrcLocation,
  DestLocation,
  ProjectName,
  defaults as locationDefaults
} from "./locations";


export default class QuickStart extends Component {
  constructor (props) {
    super(props);

    this.state = Object.assign(
      {},
      projectTypeDefaults,
      fileTypeDefaults,
      addlFeaturesDefaults,
      locationDefaults
    );
  }

  render () {
    return (
      <form className="quick-start">
        <ProjectType {...getProps(projectTypeDefaults, this)} />
        <FileTypes {...getProps(fileTypeDefaults, this)} />
        <AddlFeatures {...getProps(addlFeaturesDefaults, this)} />
        <SrcLocation {...getProps(locationDefaults, this)} />
        <DestLocation {...getProps(locationDefaults, this)} />
        <ProjectName {...getProps(locationDefaults, this)} />
        <Download {...this.state} />
      </form>
    );
  }
}
