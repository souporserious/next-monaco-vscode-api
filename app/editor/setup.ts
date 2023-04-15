import 'monaco-editor/esm/vs/editor/editor.all'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { initialize as initializeMonacoService } from 'vscode/services'
import {
  registerExtension,
  initialize as initializeVscodeExtensions,
} from 'vscode/extensions'
import getDialogsServiceOverride from 'vscode/service-override/dialogs'
import getConfigurationServiceOverride from 'vscode/service-override/configuration'
import getTextmateServiceOverride from 'vscode/service-override/textmate'
import getThemeServiceOverride from 'vscode/service-override/theme'
import getLanguagesServiceOverride from 'vscode/service-override/languages'

window.MonacoEnvironment = {
  getWorker: async function (moduleId, label) {
    switch (label) {
      case 'editorWorkerService':
        return new Worker(
          new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url)
        )
      case 'css':
      case 'less':
      case 'scss':
        return new Worker(
          new URL(
            'monaco-editor/esm/vs/language/css/css.worker',
            import.meta.url
          )
        )
      case 'handlebars':
      case 'html':
      case 'razor':
        return new Worker(
          new URL(
            'monaco-editor/esm/vs/language/html/html.worker',
            import.meta.url
          )
        )
      case 'json':
        return new Worker(
          new URL(
            'monaco-editor/esm/vs/language/json/json.worker',
            import.meta.url
          )
        )
      case 'javascript':
      case 'typescript':
        return new Worker(
          new URL(
            'monaco-editor/esm/vs/language/typescript/ts.worker',
            import.meta.url
          )
        )
      default:
        throw new Error(`Unimplemented worker ${label} (${moduleId})`)
    }
  },
}

Promise.all([
  initializeMonacoService({
    ...getDialogsServiceOverride(),
    ...getConfigurationServiceOverride(monaco.Uri.file('/')),
    ...getTextmateServiceOverride(),
    ...getThemeServiceOverride(),
    ...getLanguagesServiceOverride(),
  }),
  initializeVscodeExtensions(),
])

const defaultThemesExtensions = {
  name: 'themes',
  publisher: 'next-monaco',
  version: '0.0.0',
  engines: {
    vscode: '*',
  },
  contributes: {
    themes: [
      {
        id: 'Next Monaco',
        label: 'Next Monaco',
        uiTheme: 'vs-dark',
        path: './next-monaco.json',
      },
    ],
  },
}

const { registerFile: registerDefaultThemeExtensionFile } = registerExtension(
  defaultThemesExtensions
)

registerDefaultThemeExtensionFile(
  './next-monaco.json',
  async () => process.env.MONACO_THEME
)

monaco.editor.setTheme('Next Monaco')

const extension = {
  name: 'grammars',
  publisher: 'next-monaco',
  version: '0.0.0',
  engines: {
    vscode: '*',
  },
  contributes: {
    languages: [
      {
        id: 'typescript',
        extensions: ['.ts', '.tsx'],
        aliases: ['TypeScript', 'ts', 'typescript'],
      },
    ],
    grammars: [
      {
        language: 'typescript',
        scopeName: 'source.ts',
        path: './TypeScript.tmLanguage.json',
      },
    ],
  },
}

const { registerFile: registerExtensionFile } = registerExtension(extension)

registerExtensionFile('./TypeScript.tmLanguage.json', async () =>
  JSON.stringify((await import('./TypeScript.tmLanguage.json')).default as any)
)
