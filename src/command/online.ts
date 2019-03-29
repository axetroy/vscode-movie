import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs-extra";
import * as ejs from "ejs";
import { getHotMovie, getYourCity } from "../api";
import { getResourceTree } from "../util";

export default async function(context: vscode.ExtensionContext) {
  const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBar.text = "正在加载影讯...";
  statusBar.show();
  let city: string = "北京";
  let movie: any[] = [];
  try {
    city = vscode.workspace.getConfiguration("movie").get("city") as string;
    if (!city) {
      city = await getYourCity();
    }
    movie = await getHotMovie(city);
  } catch (err) {
    throw err;
  } finally {
    statusBar.dispose();
  }

  const webviewDir = path.join(context.extensionPath, "webview");

  const panel = vscode.window.createWebviewPanel(
    "online",
    "正在热映",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: false,
      localResourceRoots: [vscode.Uri.file(webviewDir)]
    }
  );

  const resource = getResourceTree(context, { movie }, { city });

  const content = await fs.readFile(path.join(webviewDir, "online.html"), {
    encoding: "utf8"
  });

  panel.webview.html = ejs.render(content, resource);
}
