import React from 'react';
import Chart from './Chart';
import EditPannel from './EditPannel';
import './font.css';
import './playground.css';

import {
  HashRouter as Router,
  Switch,
  Route,
  //useParams
} from "react-router-dom";


export default class Playground extends React.Component {
  constructor(props) {
    super(props);
    let status = 'static';
    let spec = require('../spec/scatterplot.json');
    this.state = {
      spec: spec,
      status: status,
    };
  }
  onEndEdit = (spec) => {
    this.setState({
      spec
    })
  }
  changeStatus = (event) => {
    let { spec, specs } = this.state;
    // spec.chart.duration = event.target.value === 'animation' ? 4000 : 0;
    this.setState({
      status: event.target.value,
      spec: spec,
      specs: specs
    })
  }
  changeStaticSpec = (event) => {
    let spec = require('../spec/' + event.target.value + '.json');
    this.setState({
      spec
    })
  }
  changeSize = (event) => {
    let chart = Object.assign({}, this.state.spec.chart);
    let spec = Object.assign({}, this.state.spec);
    chart.size = event.target.value;
    spec.chart = chart;
    this.setState({
      spec: spec,
    })
  }
  updateChart = () => {
    if (this.state.status === 'video') {
      this.setState({
        specs: JSON.parse(document.getElementsByTagName('pre')[0].innerText)
      })
    } else {
      this.setState({
        spec: JSON.parse(document.getElementsByTagName('pre')[0].innerText)
      })
    }
  }
  showGallary = (props) => {
    props.history.push('/gallary')
  }

  render() {
    const { spec, status } = this.state;

    const staticselector = <select key="staticselector" style={{ marginLeft: '20px' }} onChange={this.changeStaticSpec}>
      <option value="scatterplot">scatterplot</option>
      <option value="linechart">linechart</option>
      <option value="barchart">barchart</option>
    </select>

    const sizeselector = <select style={{ marginLeft: '20px' }} onChange={this.changeSize}>
      <option value="large">large</option>
      <option value="wide">wide</option>
      <option value="middle">middle</option>
      <option value="small">small</option>
    </select>

    let specselector;
    let displayview;
    let shownspec;
    switch (status) {
      case 'static':
        specselector = staticselector;
        shownspec = spec;
        displayview = <Chart spec={spec} />;
        break;
      default:
        break;
    }
    return (
      <Router>
        <Switch>
          <Route exact path="/*" render={
            props => {
              return <div style={{ height: "100%" }}>
                <div className="header">
                  Narrative Charts
                  {specselector}
                  {sizeselector}
                  <button style={{ marginLeft: '20px' }} onClick={this.updateChart}>update</button>

                </div>
                <div className='pannelWrapper'>
                  <div className='editPannel'>
                    <EditPannel onEndEdit={this.onEndEdit} spec={shownspec} />
                  </div>
                  <div className='chartPannel'>
                    {displayview}
                  </div>
                </div>
              </div >
            }
          }>
          </Route>
        </Switch>
      </Router >
    )
  }
}

