import React, { Component } from 'react';
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/webpack-resolver";
import './playground.css';

export default class EditPannel extends Component {

    onChange = (value) => {
        // console.log(value);
        try {
            this.props.onEndEdit(JSON.parse(value));
        } catch (error) {
            console.log("json parse error:" + error);
        }
    }

    render() {
        const { spec } = this.props
        return (
            <>
                <AceEditor
                    mode="json"
                    theme="github"
                    width='100%'
                    height='100%'
                    onChange={this.onChange}
                    value={JSON.stringify(spec, null, 2)}
                    name="editText"
                    editorProps={{ $blockScrolling: true }}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: true
                    }}
                />
            </>

        )
    }
}