import React, { useRef, useEffect, useState } from 'react';

import { basicSetup } from 'codemirror';
import { EditorState, Prec } from '@codemirror/state';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { indentWithTab, history } from '@codemirror/commands';
import { json } from '@codemirror/lang-json';
import { defaultKeymap } from '@codemirror/commands';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';

export const Editor = ({ ...props }) => {
  const editor = useRef();
  //const [code, setCode] = useState('{}');

  const onUpdate = EditorView.updateListener.of((v) => {
    if (props.onChange) {
      props.onChange(v.state.doc.toString());
    }
  });

  useEffect(() => {
    const state = EditorState.create({
      doc: props.value || '',
      extensions: [
        lineNumbers(),
        json(),
        basicSetup,
        keymap.of([defaultKeymap, indentWithTab]),
        onUpdate,
        EditorState.readOnly.of(props.readOnly || false),
        history(),
      ],
    });

    const view = new EditorView({ state, parent: editor.current });

    return () => {
      view.destroy();
    };
  }, []);

  return <div ref={editor} className='max-h-96 max-w-80'></div>;
};
