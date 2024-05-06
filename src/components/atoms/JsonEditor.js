import React, { Component } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';

const JsonEditor = ({ ...props }) => {
  return (
    <AceEditor
      height='inherit'
      width='inherit'
      minLines={2}
      maxLines={props.maxLines || 15}
      placeholder={props.placeholder || ''}
      mode='json'
      theme='github'
      name={props.name}
      //onLoad={this.onLoad}
      onChange={props.onChange}
      fontSize={14}
      lineHeight={19}
      showPrintMargin={true}
      showGutter={true}
      highlightActiveLine={true}
      value={props.value}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: false,
        showLineNumbers: true,
        tabSize: 2,
      }}
      readOnly={props.readOnly || false}
    />
  );
};

export default JsonEditor;
