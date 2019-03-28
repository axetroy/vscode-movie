import * as vscode from "vscode";
import online from "./command/online";
import top250 from "./command/top";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("movie.online", () => {
      online(context);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("movie.top250", () => {
      top250(context);
    })
  );
}
