import React, { Component } from 'react';
import './playground.css';

export default class EditPannel extends Component {

    endEditing = () => {
        if (this.node) {
            try {
                this.props.onEndEdit(JSON.parse(this.node.innerText));
            } catch (error) {
                console.log("json parse error:" + error);
            }
        }
    }

    //process json
    syntaxHighlight = (json) => {
        if (typeof json != 'string') {
            json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }
    render() {
        const { spec } = this.props
        return (
            <pre
                dangerouslySetInnerHTML={{ __html: this.syntaxHighlight(JSON.stringify(spec, null, 2)) }}
                ref={(node) => this.node = node}
                contentEditable={true}
                suppressContentEditableWarning
                onBlur={this.endEditing}>
            </pre>
        )
    }
}