import { type Disposable, type ExtensionContext } from 'vscode'

export function activate({ subscriptions }: ExtensionContext) {
  let disposables: Disposable[] = []

  subscriptions.push(...disposables)
}

export function deactivate() {}
