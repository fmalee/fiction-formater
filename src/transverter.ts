"use strict";
/**
 * 参考：https://github.com/mumuy/chinese-transverter
 */
import { DICT } from "./dict";

export interface OPTIONS {
  type: string;
  language: string;
}

type MAP = Record<string, string>;

export default function transverter(text: string, options: OPTIONS) {
  const opts = Object.assign(
    {
      type: "simplified", // 目标字体
      language: "", // 用于转换台湾惯用语
    },
    options
  );

  let words: MAP,
    taiwan: MAP,
    locked: MAP,
    common: MAP = {};

  if ("simplified" === opts.type) { // 繁体 -> 简体
    for (let i = 0; i < DICT.traditional_chinese.length; i++) { // 拼接 繁:简 属性
      common[DICT.traditional_chinese[i]] = DICT.simplified_chinese[i];
    }
    words = invertKeyValues(DICT.words); // 反转固定词的键值对
    taiwan = "zh_TW" === opts.language ? invertKeyValues(DICT.zh_TW) : {null : "null"}; // 是否转换惯用语
    locked = 0 != Object.keys(DICT.lockTraditional).length ? DICT.lockTraditional : {null : "null"}; // 锁定繁体词汇

    // 替换顺序：固定词 -> 通用字 -> 简体专用字 -> 惯用语 -> 替换回锁定的繁体词汇
    return text.replace(new RegExp(`(${Object.keys(words).join('|')})`, 'g'), (match) => words[match])
      .replace(new RegExp(`(${Object.keys(common).join('|')})`, 'g'), (match) => common[match])
      .replace(new RegExp(`(${Object.keys(DICT.toSimplified).join('|')})`, 'g'), (match) => DICT.toSimplified[match])
      .replace(new RegExp(`(${Object.keys(taiwan).join('|')})`, 'g'), (match) => taiwan[match])
      .replace(new RegExp(`(${Object.keys(locked).join('|')})`, 'g'), (match) => locked[match]);
  } else { // 简体 -> 繁体
    for (let i = 0; i < DICT.simplified_chinese.length; i++) { // 拼接 简:繁 属性
      common[DICT.simplified_chinese[i]] = DICT.traditional_chinese[i];
    }
    taiwan = "zh_TW" === opts.language ? DICT.zh_TW : {null : "null"}; // 是否转换惯用语
    locked = 0 != Object.keys(DICT.lockSimplified).length ? DICT.lockSimplified : {null : "null"}; // 锁定简体词汇

    // 替换顺序：固定词 -> 惯用语 -> 通用字 - 替换回锁定的简体词汇
    return text.replace(new RegExp(`(${Object.keys(DICT.words).join('|')})`, 'g'), (match) => DICT.words[match])
      .replace(new RegExp(`(${Object.keys(taiwan).join('|')})`, 'g'), (match) => taiwan[match])
      .replace(new RegExp(`(${Object.keys(common).join('|')})`, 'g'), (match) => common[match])
      .replace(new RegExp(`(${Object.keys(locked).join('|')})`, 'g'), (match) => locked[match]);
  }
}

/**
 * 反转对象的键值对
 */
function invertKeyValues(obj: MAP): MAP {
    return Object.keys(obj).reduce((inverted: MAP, key: string) => {
      inverted[obj[key]] = key;
      return inverted;
    }, {});
}
