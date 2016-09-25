import { h } from "preact";


export const SrcLocation = props => {
  const { srcLocation, setSrcLocation } = props;

  return (
    <div className="quick-start-section">
      <div className="prompt">
        Where will your code live, relative to the project root?
      </div>
      <div className="quick-start-options">
        <input
          type="text"
          value={srcLocation}
          name="srcLocation"
          onChange={setSrcLocation}
        />
      </div>
    </div>
  );
};

export const DestLocation = props => {
  const { destLocation, setDestLocation } = props;

  return (
    <div className="quick-start-section">
      <div className="prompt">
        Where will compiled assets go, relative to the project root?
      </div>
      <div className="quick-start-options">
        <input
          type="text"
          value={destLocation}
          name="destLocation"
          onChange={setDestLocation}
        />
      </div>
    </div>
  );
}


export const ProjectName = props => {
  const { projectName, setProjectName } = props;

  return (
    <div className="quick-start-section">
      <div className="prompt">
        What is the name of your project?
      </div>
      <div className="quick-start-options">
        <input
          type="text"
          value={projectName}
          name="projectName"
          onChange={setProjectName}
        />
      </div>
    </div>
  );
}


export const defaults = {
  srcLocation: "src/",
  destLocation: "dest/",
  projectName: "my-project"
}
