import * as vscode from 'vscode';
import transverter from "./transverter";

/**
 * 用于包装 `String.prototype.replace()` 的辅助函数
 * @param text 替换文本
 * @param regex 搜索模式
 * @param offset Unicode代码点中单个字符的偏移度
 */
const substitueAll = (text: string, regex: RegExp, offset: number): string => text.replace(regex, (s) => String.fromCharCode(s.charCodeAt(0) + offset));

/**
 * 对字母、数字进行全半角转换
 * @param text 替换文本
 * @param isH2F 是否是半角转全角
 * @param isIncludeAlpha 是否转换字母
 * @returns 
 */
function convertAlphaSymbol(text: string, isH2F: boolean = true, isIncludeAlpha: boolean = true): string {
    let pattern, offset;
    let config = vscode.workspace.getConfiguration("fictionFormater.companionCharacterTo");
    let fSpace = config.get("space") as unknown as string;
    let fBackslash = config.get("backslash") as unknown as string;
    let fHyphen = config.get("hyphen") as unknown as string;
    let fTilde = config.get("tilde") as unknown as string;
    let fPeriod = config.get("period") as unknown as string;
    let fComma = config.get("comma") as unknown as string;
    let hSpace = " ";
    let hBackslash = "\\";
    let hHyphen = "-";
    let hTilde = "~";
    let hPeriod = ".";
    let hComma = ",";
    if (isH2F) {
        pattern = isIncludeAlpha ? /[a-z0-9!-~ ]/gi : /[!-~ ]/gi;
        offset = 0xFEE0;
    }  else {
        pattern = isIncludeAlpha ? /[ａ-ｚ０-９！-～　。]/gi : /[！-～　。]/gi;
        offset = -0xFEE0;

        [fSpace, hSpace] = [hSpace, fSpace];
        [fBackslash, hBackslash] = [hBackslash, fBackslash];
        [fHyphen, hHyphen] = [hHyphen, fHyphen];
        [fTilde, hTilde] = [hTilde, fTilde];
        [fPeriod, hPeriod] = [hPeriod, fPeriod];
        [fComma, hComma] = [hComma, fComma];
    }

    return text.replace(pattern, (s: string): string => {
        switch (s) {
            case hSpace:
                return fSpace;
            case hBackslash:
                return fBackslash;
            case hHyphen:
                return fHyphen;
            case hTilde:
                return fTilde;
            case hPeriod:
                return fPeriod;
            case hComma:
                return fComma;
            default:
                return String.fromCharCode(s.charCodeAt(0) + offset);
        }
    });
}

/** 将半角字母、数字和符号转换为全角字符 */
export const h2fAlphaNumSymbol = (text: string): string => convertAlphaSymbol(text);

/** 将半角的字母、数字转换为全角字符 */
export const h2fAlphaNum = (text: string): string => substitueAll(text, /[a-z0-9]/gi, 0xFEE0);

/** 半角字母转换为全角字母 */
export const h2fAlphabet = (text: string): string => substitueAll(text, /[a-z]/gi, 0xFEE0);

/** 将半角数字转换为全角数字 */
export const h2fNumber = (text: string): string => substitueAll(text, /[0-9]/g, 0xFEE0);

/** 将半角符号转换为全角符号 */
export const h2fSymbol = (text: string): string => convertAlphaSymbol(text, true, false);

/** 将全角的字母、数字和符号转换为半角字符 */
export const f2hAlphaNumSymbol = (text: string): string => convertAlphaSymbol(text, false).replace(/[—―–]/g, "-");

/** 将全角的字母、数字转换为半角字符 */
export const f2hAlphaNum = (text: string): string => substitueAll(text, /[ａ-ｚ０-９]/gi, -0xFEE0);

/** 将全角的字母转换为半角字母 */
export const f2hAlphabet = (text: string): string => substitueAll(text, /[ａ-ｚ]/gi, -0xFEE0);

/** 将全角的数字转换为半角数字 */
export const f2hNumber = (text: string): string => substitueAll(text, /[０-９]/g, -0xFEE0);

/** 将全角的符号转换为半角符号 */
export const f2hSymbol = (text: string): string => convertAlphaSymbol(text, false, false).replace(/[—―–]/g, "-");

/** 繁体转简体 */
export const t2sCommon = (text: string): string => transverter(text, { type: "simplified", language: "" });
/** 繁体转简体，同时转换台湾惯用语 */
export const t2sTw = (text: string): string => transverter(text, { type: "simplified", language: "zh_TW" });
/** 简体转繁体 */
export const s2tCommon = (text: string): string => transverter(text, { type: "traditional", language: "" });
/** 简体转繁体，同时转换为台湾惯用语 */
export const s2tTw = (text: string): string => transverter(text, { type: "traditional", language: "zh_TW" });

/** 清理小说段落 */
export const fictionClear = (text: string): string => {
    let patterns: Map<string, string> = new Map();
    patterns.set('\r\n', '\n'); // 统一换行符
    patterns.set('[	　 ]+\n', '\n'); // 删除段尾全半角空格、制表符
    patterns.set('\n[	　 ]+', '\n　　'); // 替换段首全半角空格、制表符为全角空格
    patterns.set('\n+', '\n'); // 删除空白行
    patterns.set('\n(\\S)\n*(?!　)', '$1'); // 段落排版，将顶格段落拼接到上一个段落
    patterns.set(' *[。\\.]{3,} *', '……'); // 转换省略号
    patterns.set(' *…+ *', '……'); // 补全省略号

    patterns.forEach((value, key) => { // 顺序循环执行正则
        const regex: RegExp = new RegExp(key, 'g');
        text = text.replace(regex, value);
    });

    return text;
}

/** 格式化小说 */
export const fictionFormat = (text: string): string => {
    // 在转换成简体时，是否同时转换台湾惯用语
    const isIncludesTw = vscode.workspace.getConfiguration("fictionFormater.fiction").get("intoSimplifiedChineseIncludesTw") as unknown as boolean;

    text = transverter(text, { type: "simplified", language: isIncludesTw ? 'zh_TW' : '' }); // 转换繁体
    text = substitueAll(text, /[ａ-ｚ０-９＋－]/gi, -0xFEE0); // 转换全角字母、数字、特殊标点

    return fictionClear(text); // 清理段落
}

/**
 * 主函数
 * @param context
 */
export function activate(context: vscode.ExtensionContext) {
    function handler(callback: (text: string) => string): (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => void {
        return (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit): void => {
            const document = textEditor.document;
            if (textEditor.selections[0].isEmpty) {
                const posFirst = document.lineAt(0).range.start;
                const posLast = document.lineAt(document.lineCount - 1).range.end;
                edit.replace(new vscode.Range(posFirst, posLast), callback(document.getText()));
            }
            else {
                const _getTextInSelection = (selection: vscode.Selection): string => document.getText(new vscode.Range(selection.start, selection.end));
                textEditor.selections.map((selection: vscode.Selection) => edit.replace(selection, callback(_getTextInSelection(selection))));
            }
        };
    }

    const register = vscode.commands.registerTextEditorCommand;
    const disposables = [
        register("fiction-formater.h2fAlphaNumSymbol", handler(h2fAlphaNumSymbol)),
        register("fiction-formater.h2fAlphaNum", handler(h2fAlphaNum)),
        register("fiction-formater.h2fAlphabet", handler(h2fAlphabet)),
        register("fiction-formater.h2fNumber", handler(h2fNumber)),
        register("fiction-formater.h2fSymbol", handler(h2fSymbol)),
        register("fiction-formater.f2hAlphaNumSymbol", handler(f2hAlphaNumSymbol)),
        register("fiction-formater.f2hAlphaNum", handler(f2hAlphaNum)),
        register("fiction-formater.f2hAlphabet", handler(f2hAlphabet)),
        register("fiction-formater.f2hNumber", handler(f2hNumber)),
        register("fiction-formater.f2hSymbol", handler(f2hSymbol)),
        register("fiction-formater.fictionFormat", handler(fictionFormat)),
        register("fiction-formater.fictionClear", handler(fictionClear)),
        register("fiction-formater.t2sCommon", handler(t2sCommon)),
        register("fiction-formater.t2sTw", handler(t2sTw)),
        register("fiction-formater.s2tCommon", handler(s2tCommon)),
        register("fiction-formater.s2tTw", handler(s2tTw)),
    ] as const;
    disposables.forEach( (d) => context.subscriptions.push(d) );

    vscode.commands.executeCommand('setContext', 'fiction-formater.supportedResourceLangs', ['ini', 'plaintext']);
    vscode.window.showInformationMessage('Hello World!');
    console.log('Hello World!@@@@');
}
