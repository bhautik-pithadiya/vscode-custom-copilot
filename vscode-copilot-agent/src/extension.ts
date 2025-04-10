import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
    console.log('✅ Custom Copilot extension is now active!');

    let disposable = vscode.commands.registerCommand('customCopilot.askAgent', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found.');
            return;
        }

        const userPrompt = await vscode.window.showInputBox({
            placeHolder: 'Ask something like "Summarize this file" or "Add logging to this function"',
        });
        if (!userPrompt) return;

        const fileContent = editor.document.getText();
        const filePath = editor.document.uri.fsPath;

        vscode.window.withProgress(
            { location: vscode.ProgressLocation.Notification, title: 'Asking Custom Copilot...', cancellable: false },
            async () => {
                try {
                    const response = await axios.post('http://localhost:5000/ask', {
                        prompt: userPrompt,
                        code: fileContent,
                        path: filePath,
                    });
                    const result = response.data.result;
                    const panel = vscode.window.createOutputChannel("Custom Copilot");
                    panel.appendLine(result);
                    panel.show();
                } catch (error: any) {
                    vscode.window.showErrorMessage('Agent request failed: ' + error.message);
                }
            }
        );
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
