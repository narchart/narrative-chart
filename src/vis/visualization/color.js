export default function Color(mode = "light") {
    const lightMode = {
        BACKGROUND: '#FFFFFF',
        DIVIDER: '#D9D9D9',
        AXIS: '#000000',
        TITLE: '#000000',
        TEXT: '#000000',
        ANNOTATION: '#FFBE32',
        DEFAULT: '#73C8F3',

        //Qualitative（categorical)
        CATEGORICAL: ['#73C8F3', '#FFE86D', '#F6B0A7', '#B2DBC1', '#EAE2B7', '#F3705C', '#4ECBC4', '#96A7CE'],
        //Sequential
        SEQUENTIAL: ['#7A0715', '#A71017', '#D32322', '#F04535', '#FA6B4D', '#FDAD92', '#FDCBBB', '#FFE5D9'],
        //Diverging
        DIVERGING: ['#1892FA', '#7CC0FB', '#ADD7F9', '#DEECF8', '#F3DEDE', '#F0ADAD', '#EC7C7C', '#E0191A']
    }
    const darkMode = {
        BACKGROUND: '#000000',
        DIVIDER: '#323232',
        AXIS: '#FFFFFF',
        TITLE: '#FFFFFF',
        TEXT: '#FFFFFF',
        ANNOTATION: '#FFBE32',
        DEFAULT: '#73C8F3',

        //Qualitative（categorical)
        CATEGORICAL: ['#73C8F3', '#FFE86D', '#F6B0A7', '#B2DBC1', '#EAE2B7', '#F3705C', '#4ECBC4', '#96A7CE'],
        //Sequential
        SEQUENTIAL: ['#E0191A', '#FC4B4B', '#F46464', '#FC8585', '#FFA6A6', '#FFC8C8', '#FFDADA', '#F3DEDE'],
        //Diverging
        DIVERGING: ['#1892FA', '#7CC0FB', '#ADD7F9', '#DEECF8', '#F3DEDE', '#FFA6A6', '#F46464', '#E0191A']
    }

    switch (mode) {
        case "light":
            return lightMode;

        case "dark":
            return darkMode;

        default:
            return lightMode;
    }

}