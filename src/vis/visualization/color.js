/**
 * @description Color class (singleton)
 * 
 * @class
 */
export default class Color {
    constructor() {
        if (!Color.instance) {
            this._color = EMOTION_COLOR['none'].light;
            Color.instance = this;
        } else {
            return Color.instance
        }
    }

    /**
    * @description Change Color palette by `mode` and `emotion`.
    * 
    * @return {void}
    */
    setColor(mode, emotion) {
        const currMode = this._checkValidMode(mode) ? mode : "light";
        const currEmotion = this._checkVaildEmotion(emotion) ? emotion : "none";

        this._color = EMOTION_COLOR[currEmotion][currMode];
    }

    /**
    * @description Check if the input `mode` is valid (light/dark).
    * 
    * @return {void}
    */
    _checkValidMode(mode) {
        return ["light", "dark"].includes(mode) ? true : false;
    }

    /**
    * @description Check if the input `emotion` is valid.
    * include: none/exciting/positive/negative/serious/playful/trustworthy/disturbing
    * 
    * @return {void}
    */
    _checkVaildEmotion(emotion) {
        return Object.keys(EMOTION_COLOR).includes(emotion) ? true : false;
    }

    get color() {
        return this._color;
    }

    get BACKGROUND() {
        return this._color.BACKGROUND;
    }

    get DIVIDER() {
        return this._color.DIVIDER;
    }

    get AXIS() {
        return this._color.AXIS;
    } 

    get TITLE() {
        return this._color.TITLE;
    } 

    get TEXT() {
        return this._color.TEXT;
    } 

    get ANNOTATION() {
        return this._color.ANNOTATION;
    } 

    get DEFAULT() {
        return this._color.DEFAULT;
    }

    get TOOLTIP() {
        return this._color.TOOLTIP;
    } 

    get CATEGORICAL() {
        return this._color.CATEGORICAL;
    } 

    get SEQUENTIAL() {
        return this._color.SEQUENTIAL;
    } 

    get DIVERGING() {
        return this._color.DIVERGING;
    } 
}

// Color palettes by emotion and mode
const EMOTION_COLOR = {
    "none": {
        "light": {
            BACKGROUND: '#FFFFFF',
            DIVIDER: '#D9D9D9',
            AXIS: '#000000',
            TITLE: '#000000',
            TEXT: '#000000',
            ANNOTATION: '#FFBE32',
            DEFAULT: '#73C8F3',
            TOOLTIP: '#F28787',
            CATEGORICAL: ['#73C8F3', '#FFE86D', '#F6B0A7', '#B2DBC1', '#EAE2B7', '#F3705C', '#4ECBC4', '#96A7CE'],
            SEQUENTIAL: ['#7A0715', '#A71017', '#D32322', '#F04535', '#FA6B4D', '#FDAD92', '#FDCBBB', '#FFE5D9'],
            DIVERGING: ['#1892FA', '#7CC0FB', '#ADD7F9', '#DEECF8', '#F3DEDE', '#F0ADAD', '#EC7C7C', '#E0191A']
        },
        "dark": {
            BACKGROUND: '#000000',
            DIVIDER: '#323232',
            AXIS: '#FFFFFF',
            TITLE: '#FFFFFF',
            TEXT: '#FFFFFF',
            ANNOTATION: '#FFBE32',
            DEFAULT: '#73C8F3',
            TOOLTIP: '#F28787',
            CATEGORICAL: ['#73C8F3', '#FFE86D', '#F6B0A7', '#B2DBC1', '#EAE2B7', '#F3705C', '#4ECBC4', '#96A7CE'],
            SEQUENTIAL: ['#E0191A', '#FC4B4B', '#F46464', '#FC8585', '#FFA6A6', '#FFC8C8', '#FFDADA', '#F3DEDE'],
            DIVERGING: ['#1892FA', '#7CC0FB', '#ADD7F9', '#DEECF8', '#F3DEDE', '#FFA6A6', '#F46464', '#E0191A']
        }
    },
    "calm": {
        "light": {
            BACKGROUND: '#FFFFFF',
            DIVIDER: '#F3F3F3',
            AXIS: '#151515',
            TITLE: '#70A2B1',
            TEXT: '#151515',
            ANNOTATION: '#A1DA9B',
            DEFAULT: '#A0D3E3',
            TOOLTIP: '#A1DA9B', //TODO
            CATEGORICAL: ['#A0D3E3', '#A1DA9B', '#98CEBF', '#E9AECA', '#70D3F5', '#77B3E7', '#F5D8C7', '#DED8B7'],
            SEQUENTIAL: ['#2A768E', '#328BA8', '#3AA1C3', '#52AECC', '#6DBAD3', '#87C7DC', '#A0D3E3', '#D5ECF3'],
            DIVERGING: ['#328BA8', '#52AECC', '#87C7DC', '#D5ECF3', '#E7F5E4', '#C4E8C0', '#A1DB9B', '#7ECC76']
        },
        "dark": {
            BACKGROUND: '#000000',
            DIVIDER: '#323232',
            AXIS: '#FFFFFF',
            TITLE: '#D3FFFF',
            TEXT: '#FFFFFF',
            ANNOTATION: '#A1DA9B',
            DEFAULT: '#A1D4E3',
            TOOLTIP: '#A1DA9B', //TODO
            CATEGORICAL: ['#A0D3E3', '#A1DA9B', '#98CEBF', '#E9AECA', '#70D3F5', '#77B3E7', '#F5D8C7', '#DED8B7'],
            SEQUENTIAL: ['#3491AD', '#3DA6C5', '#58B2CD', '#72BED5', '#8CCADD', '#A6D6E4', '#C0E2EC', '#DCEEF4'],
            DIVERGING: ['#6DBAD3', '#87C7DC', '#A0D3E3', '#D5ECF3', '#E7F5E4', '#C4E8C0', '#A1DB9B', '#7ECC76']
        }
    },
    "exciting": {
        "light": {
            BACKGROUND: '#ffffff',
            DIVIDER: '#F3F3F3',
            AXIS: '#151515',
            TITLE: '#C54600',
            TEXT: '#151515',
            ANNOTATION: '#03C300',
            DEFAULT: '#FF7602',
            TOOLTIP: '#03C300', //TODO
            CATEGORICAL: ['#FF7602', '#03C300', '#FF298D', '#FEA800', '#FF0000', '#03C3BB', '#0273D4', '#F9CF00'],
            SEQUENTIAL: ['#C45B00', '#E66B00', '#FF7B0B', '#FF8E2C', '#FFA14C', '#FFB36F', '#FFC490', '#FFD6B2'],
            DIVERGING: ['#E66B00', '#FF8E2C', '#FFB36F', '#FFD6B2', '#C3FFC3', '#6EFF6E', '#0FFF07', '#03C300']
        },
        "dark": {
            BACKGROUND: '#000000',
            DIVIDER: '#323232',
            AXIS: '#FFFFFF',
            TITLE: '#FFA741',
            TEXT: '#FFFFFF',
            ANNOTATION: '#03C300',
            DEFAULT: '#FF7602',
            TOOLTIP: '#03C300', //TODO
            CATEGORICAL: ['#FF7602', '#03C300', '#FF298D', '#FFA701', '#FF2928', '#03C3BC', '#068AFF', '#F9CF00'],
            SEQUENTIAL: ['#C45B00', '#E66B00', '#FF7B0B', '#FF8E2C', '#FFA14C', '#FFB36F', '#FFC490', '#FFD6B2'],
            DIVERGING: ['#E66B00', '#FF8E2C', '#FFB36F', '#FFD6B2', '#C3FFC3', '#6EFF6E', '#0FFF07', '#03C300']
        }
    },
    "positive": {
        "light": {
            BACKGROUND: '#ffffff',
            DIVIDER: '#F3F3F3',
            AXIS: '#222222',
            TITLE: '#C09F02',
            TEXT: '#151515',
            ANNOTATION: '#FF7602',
            DEFAULT: '#F9CF00',
            TOOLTIP: '#FF7602', //TODO
            CATEGORICAL: ['#F9CF00', '#FF7602', '#AEE032', '#00C400', '#03C3F8', '#FF298E', '#FEA800', '#FF0000'],
            SEQUENTIAL: ['#D5B403', '#F9CF00', '#FFDA1C', '#FFE03E', '#FFE65F', '#FFEB81', '#FFEFA3', '#FFF6C4'],
            DIVERGING: ['#F9CF00', '#FFE03E', '#FFEB81', '#FFF6C4', '#FFE3CC', '#FFBF88', '#FF9A44', '#FF7602']
        },
        "dark": {
            BACKGROUND: '#000000',
            DIVIDER: '#323232',
            AXIS: '#FFFFFF',
            TITLE: '#FEFF51',
            TEXT: '#FFFFFF',
            ANNOTATION: '#FF7602',
            DEFAULT: '#F9CF00',
            TOOLTIP: '#FF7602', //TODO
            CATEGORICAL: ['#F9CF00', '#FF7602', '#AEE032', '#00C400', '#03C3F8', '#FF298E', '#FEA800', '#FF0000'],
            SEQUENTIAL: ['#D5B403', '#F9CF00', '#FFDA1C', '#FFE03E', '#FFE65F', '#FFEB81', '#FFEFA3', '#FFF6C4'],
            DIVERGING: ['#F9CF00', '#FFE03E', '#FFEB81', '#FFF6C4', '#FFE3CC', '#FFBF88', '#FF9A44', '#03C300']
        }
    },
    "negative": {
        "light": {
            BACKGROUND: '#ffffff',
            DIVIDER: '#F3F3F3',
            AXIS: '#222222',
            TITLE: '#161616',
            TEXT: '#151515',
            ANNOTATION: '#9F0101',
            DEFAULT: '#3C3C3C',
            TOOLTIP: '#9F0101', //TODO
            CATEGORICAL: ['#3C3C3C', '#9F0101', '#712C17', '#D4D4D4', '#8B4F41', '#313361', '#86948F', '#225978'],
            SEQUENTIAL: ['#3C3C3C', '#555555', '#6F6F6F', '#888888', '#A2A2A2', '#BBBBBB', '#D5D5D5', '#EEEEEE'],
            DIVERGING: ['#3C3C3C', '#6F6F6F', '#A2A2A2', '#D5D5D5', '#FF9F9F', '#FF4A4A', '#F40200', '#9F0101']
        },
        "dark": {
            BACKGROUND: '#000000',
            DIVIDER: '#323232',
            AXIS: '#FFFFFF',
            TITLE: '#C0C0C0',
            TEXT: '#FFFFFF',
            ANNOTATION: '#DC0100',
            DEFAULT: '#909090',
            TOOLTIP: '#DC0100', //TODO
            CATEGORICAL: ['#909090', '#DC0100', '#983D1F', '#D4D4D4', '#AF6555', '#6D6EB6', '#9BA6A3', '#3795C8'],
            SEQUENTIAL: ['#6E6E6E', '#7F7F7F', '#909090', '#A1A1A1', '#B2B2B2', '#C3C3C3', '#D4D4D4', '#E5E5E5'],
            DIVERGING: ['#6E6E6E', '#909090', '#B2B2B2', '#D4D4D4', '#FFA9A9', '#FF6565', '#FF1F21', '#DC0100']
        }
    },
    "serious": {
        "light": {
            BACKGROUND: '#FFFFFF',
            DIVIDER: '#F3F3F3',
            AXIS: '#151515',
            TITLE: '#161616',
            TEXT: '#151515',
            ANNOTATION: '#A20000',
            DEFAULT: '#3C3C3C',
            TOOLTIP: '#A20000', //TODO
            CATEGORICAL: ['#3C3C3C', '#A20000', '#6D7469', '#303562', '#722C17', '#859490', '#0072D5', '#496B1E'],
            SEQUENTIAL: ['#3C3C3C', '#4F5554', '#68716D', '#7E8884', '#9BA5A1', '#B2BDB7', '#CDD9D2', '#E2EBE7'],
            DIVERGING: ['#3C3C3C', '#68716D', '#9BA5A1', '#CDD9D2', '#F0D8D8', '#D79A9A', '#C45353', '#A20000']
        },
        "dark": {
            BACKGROUND: '#000000',
            DIVIDER: '#323232',
            AXIS: '#FFFFFF',
            TITLE: '#D3DED6',
            TEXT: '#FFFFFF',
            ANNOTATION: '#CE5555',
            DEFAULT: '#A2ACA5',
            TOOLTIP: '#CE5555',//TODO
            CATEGORICAL: ['#a2aca5', '#ce5555', '#94A788', '#7F88C7', '#CF613F', '#859490', '#0E87DD', '#7B955A'],
            SEQUENTIAL: ['#A2ACA5', '#767F7C', '#6D7774', '#656E6B', '#5D6563', '#555C5A', '#454C4B', '#343D3A'],
            DIVERGING: ['#A2ACA5', '#6D7774', '#5D6563', '#454C4B', '#5A3A39', '#774040', '#A14141', '#CE5555']
        }
    },
    "playful": {
        "light": {
            BACKGROUND: '#FFFFFF',
            DIVIDER: '#F3F3F3',
            AXIS: '#000000',
            TITLE: '#C09E00',
            TEXT: '#000000',
            ANNOTATION: '#FF258E',
            DEFAULT: '#F8CF00',
            TOOLTIP: '#FF258E',//TODO
            CATEGORICAL: ['#F8CF00', '#FF2C8E', '#00C200', '#FF7800', '#FFA700', '#FF0000', '#B64FB0', '#00BFFA'],
            SEQUENTIAL: ['#F8CF00', '#FFD91B', '#FFDF3D', '#FFE45B', '#FDE779', '#FDEB90', '#FFF0A7', '#FDF6D3'],
            DIVERGING: ['#F8CF00', '#FFDF3D', '#FDE779', '#FFF0A7', '#FFD5E9', '#FFA2CD', '#FF6FB2', '#FF2B8E']
        },
        "dark": {
            BACKGROUND: '#000000',
            DIVIDER: '#323232',
            AXIS: '#FFFFFF',
            TITLE: '#FFFF51',
            TEXT: '#FFFFFF',
            ANNOTATION: '#FF258E',
            DEFAULT: '#F8CF00',
            TOOLTIP: '#FF258E', //TODO
            CATEGORICAL: ['#F8CF00', '#FF2C8E', '#00C200', '#FF7800', '#FFA700', '#FF0000', '#B64FB0', '#00BFFA'],
            SEQUENTIAL: ['#F8CF00', '#FFD91B', '#FFDF3D', '#FFE45B', '#FDE779', '#FDEB90', '#FFF0A7', '#FDF6D3'],
            DIVERGING: ['#F8CF00', '#FFDF3D', '#FDE779', '#FFF0A7', '#FFD5E9', '#FFA2CD', '#FF6FB2', '#FF2B8E']
        }
    },
    "trustworthy": {
        "light": {
            BACKGROUND: '#FFFFFF',
            DIVIDER: '#F3F3F3',
            AXIS: '#000000',
            TITLE: '#7AAF00',
            TEXT: '#000000',
            ANNOTATION: '#FBCF00',
            DEFAULT: '#ADE12F',
            TOOLTIP: '#FBCF00', //TODO
            CATEGORICAL: ['#ADE12F', '#FBCF00', '#00C0F9', '#9CDC9A', '#0071B6', '#00C200', '#A1D3E3', '#439509'],
            SEQUENTIAL: ['#439509', '#B9E547', '#C5E965', '#D0EE82', '#DBF2A0', '#E6F6BE', '#ECF8CD', '#F2FADC'],
            DIVERGING: ['#ADE12F', '#C5E965', '#DBF2A0', '#ECF8CD', '#F7EFC8', '#F3E397', '#F6DA56', '#FBCF00']
        },
        "dark": {
            BACKGROUND: '#000000',
            DIVIDER: '#323232',
            AXIS: '#FFFFFF',
            TITLE: '#E3FF63',
            TEXT: '#FFFFFF',
            ANNOTATION: '#FBCF00',
            DEFAULT: '#ADE12F',
            TOOLTIP: '#FBCF00', //TODO
            CATEGORICAL: ['#ADE12F', '#F7D100', '#00C0F9', '#9CDC9A', '#0071B6', '#00C200', '#A1D3E3', '#439509'],
            SEQUENTIAL: ['#ADE12F', '#B9E547', '#C5E965', '#D0EE82', '#DBF2A0', '#E6F6BE', '#ECF8CD', '#F2FADC'],
            DIVERGING: ['#ADE12F', '#C5E965', '#DBF2A0', '#ECF8CD', '#DEF2F7', '#BDEAF7', '#73D7F4', '#00C1F8']
        }
    },
    "disturbing": {
        "light": {
            BACKGROUND: '#FFFFFF',
            DIVIDER: '#f3f3f3',
            AXIS: '#000000',
            TITLE: '#c20000',
            TEXT: '#000000',
            ANNOTATION: '#3c3c3c',
            DEFAULT: '#ff0000',
            TOOLTIP: '#3c3c3c', //TODO
            CATEGORICAL: ['##ff0000', '##3c3c3c', '##722e19', '##00c400', '##2f3360', '##ff278c', '##ffcc00', '##473da2'],
            SEQUENTIAL: ['##ff0000', '##fc4b4b', '##f46464', '##fc8585', '##ffa6a6', '##ffc8c8', '##ffdada', '##ffeaea'],
            DIVERGING: ['##ff0000', '##f46464', '##ffa6a6', '##ffdada', '##dadada', '##b2b1b1', '##848484', '##3c3c3c']
        },
        "dark": {
            BACKGROUND: '#000000',
            DIVIDER: '#323232',
            AXIS: '#FFFFFF',
            TITLE: '#FF5A36',
            TEXT: '#FFFFFF',
            ANNOTATION: '#ABABAB',
            DEFAULT: '#FF0000',
            TOOLTIP: '#ABABAB', //TODO
            CATEGORICAL: ['#FF0000', '#ABABAB', '#B34929', '#00C400', '#5A62AF', '#FF278C', '#FFCC00', '#867BE8'],
            SEQUENTIAL: ['#FF0000', '#FC4B4B', '#F46464', '#FC8585', '#FFA6A6', '#FFC8C8', '#FFDADA', '#FFEAEA'],
            DIVERGING: ['#FF0000', '#F46464', '#FFA6A6', '#FFDADA', '#E3E3E3', '#C5C3C3', '#898787', '#565656']
        }
    }
}