import React, { Component } from 'react';
import { NarrativeChart } from '../vis';

export default class Chart extends Component {

    componentDidMount() {
        let spec = this.props.spec;
        let container = "#demo-chart";
        this.vis = new NarrativeChart();
        this.vis.container(container);
        this.vis.generate(spec);
        console.log(this.vis);
    }

    componentDidUpdate() {
        let container = "#demo-chart";
        let spec = this.props.spec;
        this.vis.container(container);
        this.vis.stop()
        this.vis.generate(spec);
        console.log(this.vis);
    }

    render() {
        let height = '100%', width = '100%';
        if (this.props.spec.chart) {
            let size = this.props.spec.chart.size;
            switch (size) {
                case 'wide':
                    height = 220;
                    width = 560;
                    break;
                case 'middle':
                    height = 200;
                    width = 360;
                    break;
                case 'small':
                    height = 150;
                    width = 235;
                    break;
                case 'unitvis':
                    height = 720;
                    width = 680;
                    break;
                default:
                    break;
            }
        }
        return (
            <div id='frame' style={{height: height, width: width, borderStyle: 'solid', borderWidth: 1, borderColor: 'black' }}>
                <div id='demo-chart'
                    style={{
                        height: height,
                        width: width,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        // justifyContent: "center"
                    }} />
            </div>
        )
    }
}
