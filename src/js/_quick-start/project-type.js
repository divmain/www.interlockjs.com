import { h } from "preact";


exports.ProjectType = props => {
  const {
    nodeProject,
    browserProject,
    setNodeProject,
    setBrowserProject
  } = props;

  return (
    <div className="quick-start-section">
      <div className="prompt">
        What kind of application are you building?
      </div>
      <div className="quick-start-options">
        <input
          type="checkbox"
          checked={browserProject}
          name="browserProject"
          id="browserProject"
          onClick={setBrowserProject}
        />
        <label for="browserProject">Browser</label>
        <input
          type="checkbox"
          checked={nodeProject}
          name="nodeProject"
          id="nodeProject"
          onClick={setNodeProject}
        />
        <label for="nodeProject">Node.js</label>
      </div>
    </div>
  );
};

exports.defaults = {
  browserProject: true,
  nodeProject: false
}
