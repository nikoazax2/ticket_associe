const { json } = require('node:stream/consumers');
const vscode = require('vscode');
const fs = require('fs');
const wss = require('./env.json');

async function selectEnv(context) {

    let config = vscode.workspace.workspaceFolders[0].uri.fsPath + '/public/config/env.json';

    //try let configJson = require(config); catch if file not exist create it
    let configJson = {};
    try {
        configJson = require(config);
    } catch (error) { 
        try {
            fs.mkdirSync(vscode.workspace.workspaceFolders[0].uri.fsPath + '/public/config', { recursive: true });
            fs.writeFileSync(config, JSON.stringify(configJson, null, 2));
        } catch (error) {
            console.log(error);

        }
    }

    configJson = { ...wss, ...configJson }
    const envActuel = configJson['ws']
    let environments = Object.keys(configJson).filter(item => item !== "ws")

    const selectedEnv = await vscode.window.showQuickPick(environments, {
        placeHolder: `Selectionnez un WS (actuel: ${envActuel})`,
    });

    if (selectedEnv) {
        vscode.window.showInformationMessage(`WS selectionné: ${selectedEnv} (${configJson[selectedEnv]})`);
        configJson['ws'] = configJson[selectedEnv];
        fs.writeFileSync(config, JSON.stringify(configJson, null, 2));

    }
}

function SelectEnv(context) {
    let disposable = vscode.commands.registerCommand('neoteem-tools.selectEnv', function () {
        selectEnv(context);
    });

    context.subscriptions.push(disposable);
}

module.exports = {
    SelectEnv
};