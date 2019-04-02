import * as vscode from "vscode";
import { init } from "vscode-nls-i18n";
import online from "./command/online";
import top250 from "./command/top";
import comming from "./command/comming";
import tv from "./command/tv";

export function activate(context: vscode.ExtensionContext) {
  init(context);
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
  context.subscriptions.push(
    vscode.commands.registerCommand("movie.tv", () => {
      tv(context);
    })
  );
}
