/**
 * @description Background class (singleton)
 * 
 * @class
 */
 export default class Background {
    constructor() {
        if (!Background.instance) {
            this._Background = {};
            Background.instance = this;
        } else {
            return Background.instance
        }
    }

    /**
    * @description Change Background 
    * 
    * @return {void}
    */
    setBackgroundColor(background_color) {
        
        this._background_color =background_color;
    }

    setBackgroundImage(background_image) {
        
        this._background_image =background_image;
    }
    
    get Background_Color() {
        return this._background_color;
    }

    get Background_Image() {
        return this._background_image;
    }

}
