import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs-extra";
import * as ejs from "ejs";
import { getTopMovie } from "../api";
import { getResourceTree } from "../util";

export default async function(context: vscode.ExtensionContext) {
  const movie = await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "正在加载影讯"
    },
    async () => {
      return await getTopMovie();
    }
  );

  const webviewDir = path.join(context.extensionPath, "webview");

  const panel = vscode.window.createWebviewPanel(
    "top250",
    "TOP250电影",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [vscode.Uri.file(webviewDir)]
    }
  );

  const resource = getResourceTree(context, { movie });

  const content = await fs.readFile(path.join(webviewDir, "top.html"), {
    encoding: "utf8"
  });

  panel.webview.html = ejs.render(content, resource);
}
