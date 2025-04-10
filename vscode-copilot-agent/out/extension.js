"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const axios_1 = __importDefault(require("axios"));
function activate(context) {
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
        if (!userPrompt)
            return;
        const fileContent = editor.document.getText();
        const filePath = editor.document.uri.fsPath;
        vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: 'Asking Custom Copilot...', cancellable: false }, async () => {
            try {
                const response = await axios_1.default.post('http://localhost:5000/ask', {
                    prompt: userPrompt,
                    code: fileContent,
                    path: filePath,
                });
                const result = response.data.result;
                const panel = vscode.window.createOutputChannel("Custom Copilot");
                panel.appendLine(result);
                panel.show();
            }
            catch (error) {
                vscode.window.showErrorMessage('Agent request failed: ' + error.message);
            }
        });
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map