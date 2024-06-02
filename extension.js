const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Create a disposable for the onDidSaveTextDocument event
  let disposable = vscode.workspace.onDidSaveTextDocument(async (document) => {
    // Check if the saved document is a .cs file
    if (document.languageId === "csharp") {
      // Get the editor for the current document
      const editor = await vscode.window.showTextDocument(document);

      // Get the text of the document
      const text = document.getText();

      // Split the text into lines
      const lines = text.split("\n");

      // Initialize an array to hold the edits
      const edits = [];

      // Iterate through the lines
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Check if the line is not empty and does not end with a semicolon
        if (line.trim() !== "" && !line.trim().endsWith(";")) {
          // Add an edit to insert a semicolon at the end of the line
          edits.push(
            vscode.TextEdit.insert(new vscode.Position(i, line.length), ";")
          );
        }
      }

      // If there are edits, apply them
      if (edits.length > 0) {
        const workspaceEdit = new vscode.WorkspaceEdit();
        workspaceEdit.set(document.uri, edits);
        await vscode.workspace.applyEdit(workspaceEdit);

        // Save the document after edits
        await document.save();
      }
    }
  });

  // Add the disposable to the extension context's subscriptions
  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
