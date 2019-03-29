import * as path from "path";
import * as vscode from "vscode";
import { format } from "date-fns";
import * as locale from "date-fns/locale/zh_cn";

function getResource(context: vscode.ExtensionContext, file: string) {
  const webviewDir = path.join(context.extensionPath, "webview");
  return vscode.Uri.file(path.join(webviewDir, ...file.split("/"))).with({
    scheme: "vscode-resource"
  });
}

export function getResourceTree(
  context: vscode.ExtensionContext,
  globalData: any,
  variableObj: { [k: string]: any } = {}
) {
  return {
    GLOBAL_DATA: JSON.stringify(globalData),
    date: format(new Date(), "YYYY年M月D日 dddd", { locale }),
    js: {
      vue: getResource(context, "js/vue.min.js"),
      vueLazyImage: getResource(context, "js/v-lazy-image.min.js"),
      app: getResource(context, "js/app.js")
    },
    css: {
      reset: getResource(context, "css/reset.css"),
      app: getResource(context, "css/app.css")
    },
    ...variableObj
  };
}
