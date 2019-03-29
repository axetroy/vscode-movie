import * as vscode from "vscode";
import online from "./command/online";
import top250 from "./command/top";
import comming from "./command/comming";

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
  context.subscriptions.push(
    vscode.commands.registerCommand("movie.comming", () => {
      comming(context);
    })
  );
}
