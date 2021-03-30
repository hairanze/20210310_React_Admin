import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import PropTypes from 'prop-types'

export default class RichTextEditor extends Component {
    constructor(props) {
        super(props);
        const html = this.props.detail;
        if(html){
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.state = {
                    editorState,
                };
            }            
        }
        else{
            this.state = {
                editorState: EditorState.createEmpty(),
            }            
        }
    }

    static propTypes={
        detail: PropTypes.string,
    }

    uploadImageCallBack=(file)=> {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/manage/img/upload');
                const data = new FormData();
                data.append('image', file);
                xhr.send(data);
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText);
                    resolve({data: {link: response.data.url}});
                }); 
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText);
                    reject(error);
                });
            }
        );
    }

    onEditorStateChange = (editorState) => {
        this.setState({
        editorState,
        });
    };

    getDetail=()=>{
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
    }

    render() {
        const { editorState } = this.state;
        return (
        <div>
            <Editor
            editorState={editorState}
            editorStyle={{border: '1px solid black', minHeight: 200, paddingLeft: 20}}
            onEditorStateChange={this.onEditorStateChange}
            toolbar={{
                image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
              }}
            />
        </div>
        );
    }
}