import React, { useRef, useEffect, useState } from 'react';

import { basicSetup } from 'codemirror';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, tooltips } from '@codemirror/view';
import { indentWithTab, history } from '@codemirror/commands';
import { json } from '@codemirror/lang-json';
import { defaultKeymap } from '@codemirror/commands';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { isEqual } from 'lodash';
import { autocompletion, CompletionContext } from '@codemirror/autocomplete';

// Function to dynamically generate autocomplete options
const createAutocompleteSource = (options) => {
  return (context) => {
    let word = context.matchBefore(/\{\{\w*$/);
    if (!word) return null;

    return {
      from: word.from,
      options: options.map((option) => ({ label: `{{${option}}}`, type: 'keyword' })),
    };
  };
};

// Create a Compartment for autocomplete
const autocompleteCompartment = new Compartment();

// Function to update autocomplete options
const updateAutocompleteOptions = (view, newOptions) => {
  view.dispatch({
    effects: autocompleteCompartment.reconfigure(autocompletion({ override: [createAutocompleteSource(newOptions)] })),
  });
};

// Custom styles to hide scrollbar
const hideScrollbar = EditorView.theme({
  '.cm-scroller': {
    overflowX: 'auto',
    overflowY: 'hidden',
    whiteSpace: 'nowrap',
    scrollbarWidth: 'none' /* For Firefox */,
  },
});

export const Editor = ({ ...props }) => {
  const editor = useRef();
  const [view, setView] = useState(null);
  const [dynamicOptions, setDynamicOptions] = useState([]);

  if (view) {
    if (!isEqual(dynamicOptions, props.completionOptions)) {
      updateAutocompleteOptions(view, props.completionOptions);
      setDynamicOptions(props.completionOptions);
    }
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
        hideScrollbar,
        autocompleteCompartment.of(autocompletion({ override: [createAutocompleteSource(dynamicOptions)] })),
        tooltips({
          parent: document.body,
        }),
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
