'use client'
import * as React from 'react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { createConfiguredEditor, createModelReference } from 'vscode/monaco'
import './setup'

export default function Editor({ defaultValue }: { defaultValue: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  // const modelRef = React.useRef<monaco.editor.ITextModel>()
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>()

  React.useLayoutEffect(() => {
    console.log('loading editor')

    editorRef.current = createConfiguredEditor(ref.current!, {
      model: monaco.editor.createModel(
        defaultValue,
        'typescript',
        monaco.Uri.file('index.ts')
      ),
      automaticLayout: true,
    })

    // createModelReference(monaco.Uri.file('index.ts'), defaultValue).then(
    // (modelRef) => {
    // editorRef.current = createConfiguredEditor(ref.current!, {
    //   model: modelRef.object.textEditorModel,
    //   automaticLayout: true,
    // })
    // }
    // )

    return () => {
      // modelRef.current?.dispose()
      editorRef.current?.dispose()
    }
  }, [])

  return <div ref={ref} style={{ height: 200 }} />
}
