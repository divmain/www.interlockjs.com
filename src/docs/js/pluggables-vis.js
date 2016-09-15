import { h, render, Component } from 'preact';
import { partition } from "d3-hierarchy";
import { timer } from "d3-timer"
import { interpolate } from "d3-interpolate";

import loadData from "./_load-data";
import { HalfSunburst } from "./_half-sunburst";
import { xScale, yScale, getArcPath } from "./_math";
import { height, width, radius } from "./_constants";


loadData().then(rootNode => {
  render(
    <InteractiveWrapper
      rootNode={rootNode}
      height={height}
      width={width}
      delay={1200}
    />,
    document.querySelector(".interactive-docs .visualization"),
    document.querySelector(".interactive-docs .visualization svg")
  );
});


class InteractiveWrapper extends Component {
  constructor (props) {
    super(props);
    this.state = { getArcPath };
    this.timer = null;
  }

  transition (newRoot) {
    const xDomain = interpolate(xScale.domain(), [newRoot.x0, newRoot.x1]);
    const yDomain = interpolate(yScale.domain(), [newRoot.y0, 1]);
    const yRange = interpolate(yScale.range(), [newRoot.y0 ? 20 : 0, radius])

    const step = elapsed => {
      let i = elapsed / this.props.delay;

      if (i >= 1) {
        this.timer.stop();
        i = 1;
      }

      this.setState({
        getArcPath: d => {
          xScale.domain(xDomain(i));
          yScale
            .domain(yDomain(i))
            .range(yRange(i));
          return getArcPath(d);
        }
      });
    };

    if (this.timer) { this.timer.stop(); }
    this.timer = timer(step, this.props.delay);
  }

  render () {
    const {
      rootNode,
      height,
      width
    } = this.props;

    const onClick = d => this.transition(d);

    return (
      <HalfSunburst
        rootNode={rootNode}
        height={height}
        width={width}
        onClick={onClick}
        getArcPath={this.state.getArcPath}
      />
    );
  }
}
