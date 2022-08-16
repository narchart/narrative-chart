import Action from './action';
import * as d3 from 'd3';

class AddImage extends Action {

    constructor(spec) {
        super(spec);

        if ('style' in spec) {
            this._style = spec.style;
        }

        if ('animation' in spec) {
            this._animation = spec.animation;
        } else {
            this._animation = { "duration": 0 }
        }
    }

    operate(vis) {
        let svg = d3.select(vis.container()).select("svg");
        if (!('image' in this._style)) {
            return
        }
        let image_url = this._style['image'];
        let x = 'x' in this._style ? this._style['x'] : 0;
        let y = 'y' in this._style ? this._style['y'] : 0;
        let height = 'height' in this._style ? this._style['height'] : 100;
        let width = 'width' in this._style ? this._style['width'] : 100;
        svg.append("svg:image")
            .attr('x', x)
            .attr('y', y)
            .attr('height', height)
            .attr('width', width)
            .attr("xlink:href", image_url)
            .attr("opacity", 0)
            .transition()
            .duration('duration' in this._animation ? this._animation['duration']: 0)
            .attr("opacity", 1);
    }
}

export default AddImage;