import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs-extra";
import * as ejs from "ejs";
import { getUpcomingMovie } from "../api";
import { getResourceTree } from "../util";

export default async function(context: vscode.ExtensionContext) {
  const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBar.text = "正在加载影讯...";
  statusBar.show();
  let movie: any[] = [];
  try {
    movie = await getUpcomingMovie();
  } catch (err) {
    throw err;
  } finally {
    statusBar.dispose();
  }

  const webviewDir = path.join(context.extensionPath, "webview");

  const panel = vscode.window.createWebviewPanel(
    "comming",
    "即将上映的电影",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: false,
      localResourceRoots: [vscode.Uri.file(webviewDir)]
    }
  );

  const resource = getResourceTree(context, { movie });

  const content = await fs.readFile(path.join(webviewDir, "comming.html"), {
    encoding: "utf8"
  });

  panel.webview.html = ejs.render(content, resource);
}
