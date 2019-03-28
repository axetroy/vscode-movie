import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs-extra";
import * as ejs from "ejs";
import { format } from "date-fns";
import * as locale from "date-fns/locale/zh_cn";
import { getHotMovie, getYourCity } from "../api";

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
    city = await getYourCity();
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

  const resource = {
    GLOBAL_DATA: JSON.stringify({
      movie
    }),
    city,
    date: format(new Date(), "YYYY年M月D日 dddd", { locale }),
    js: {
      app: vscode.Uri.file(path.join(webviewDir, "js", "app.js")).with({
        scheme: "vscode-resource"
      }),
      lazyImage: vscode.Uri.file(
        path.join(webviewDir, "js", "v-lazy-image.min.js")
      ).with({
        scheme: "vscode-resource"
      })
    },
    css: {
      reset: vscode.Uri.file(path.join(webviewDir, "css", "reset.css")).with({
        scheme: "vscode-resource"
      }),
      app: vscode.Uri.file(path.join(webviewDir, "css", "app.css")).with({
        scheme: "vscode-resource"
      })
    }
  };

  const content = await fs.readFile(path.join(webviewDir, "online.html"), {
    encoding: "utf8"
  });

  panel.webview.html = ejs.render(content, resource);
}
