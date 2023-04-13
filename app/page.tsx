'use client'
import dynamic from 'next/dynamic'
import './app.css'

const Editor = dynamic(() => import('./editor'), { ssr: false })

const defaultValue = `
/**
 * Say hello.
 *
 * @example
 * <Hello name="Penny" />
 */
function sayHello({ name }: { name: string }) {
  return \`Hello, \${name}!\`
}
`.trim()

export default function Page() {
  return <Editor defaultValue={defaultValue} />
}
