import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs-extra";
import * as ejs from "ejs";
import { localize } from "vscode-nls-i18n";
import { getTvTag, getTv } from "../api";
import { getResourceTree } from "../util";

let tagsCached: string[] | void;

export default async function(context: vscode.ExtensionContext) {
  let tag: string | void = "";

  const movie = await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "正在加载影讯"
    },
    async () => {
      const tags = tagsCached ? tagsCached : await getTvTag();
      tagsCached = tags;
      tag = await vscode.window.showQuickPick(tags, {
        placeHolder: localize("placeholder.select.tag")
      });
      if (!tag) {
        throw new Error("");
      }
      return await getTv(tag);
    }
  );

  const webviewDir = path.join(context.extensionPath, "webview");

  const panel = vscode.window.createWebviewPanel(
    "tv",
    "最近热门电视剧 - " + (tag as string),
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [vscode.Uri.file(webviewDir)]
    }
  );

  const resource = getResourceTree(context, { movie, tag }, { tag });

  const content = await fs.readFile(path.join(webviewDir, "tv.html"), {
    encoding: "utf8"
  });

  panel.webview.html = ejs.render(content, resource);
}
