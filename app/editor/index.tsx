'use client'
import * as React from 'react'
import * as vscode from 'vscode'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { createConfiguredEditor } from 'vscode/monaco'
import './setup'
import 'monaco-editor/esm/vs/language/typescript/monaco.contribution'

monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  jsx: monaco.languages.typescript.JsxEmit.Preserve,
})

/*
 * Temporarily need to initialize vscode api to load extensions until bug is fixed
 * https://github.com/CodinGame/monaco-vscode-api/issues/80#issuecomment-1502762849
 */
vscode.languages.registerColorProvider('javascript', {})

export default function Editor({ defaultValue }: { defaultValue: string }) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    const model = monaco.editor.createModel(
      defaultValue,
      'typescript',
      monaco.Uri.file('index.tsx')
    )
    const editor = createConfiguredEditor(ref.current!, {
      model,
      automaticLayout: true,
    })

    return () => {
      model.dispose()
      editor.dispose()
    }
  }, [])

  return <div ref={ref} style={{ height: 200 }} />
}
