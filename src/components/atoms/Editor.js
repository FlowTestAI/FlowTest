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
  const [view, setView] = useState(null);

  if (view) {
    if (props.value != view.state.doc.toString()) {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: props.value } });
    }
  }

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
    setView(view);

    return () => {
      view.destroy();
      setView(null);
    };
  }, []);

  return <div ref={editor} className={`${props.classes} overflow-auto`}></div>;
};
