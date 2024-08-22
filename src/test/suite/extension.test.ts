import * as assert from 'assert';
import {
    h2fAlphaNumSymbol, h2fAlphaNum, h2fAlphabet, h2fNumber, h2fSymbol,
    f2hAlphaNumSymbol, f2hAlphaNum, f2hAlphabet, f2hNumber, f2hSymbol,
    t2sCommon, t2sTw, s2tCommon, s2tTw, fictionClear, fictionFormat
} from "../../extension";

suite('Extension Test Suite', () => {
    const halfAlpha = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`;
    const fullAlpha = `ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ`;
    const halfNumber = `0123456789`;
    const fullNumber = `０１２３４５６７８９`;
    const halfChars = `!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~ `;
    const fullChars = `！＂＃＄％＆＇（）＊＋，－。／：；＜＝＞？＠［＼］＾＿｀｛｜｝～　`;
    const sCommon = `锕爱碍蔼皑剀嗳嫒暧瑷硙锿阂霭布占恒致征折向“”`;
    const sStd = `堵塞公元`;
    const tCommon = `錒愛礙藹皚剴噯嬡曖璦磑鎄閡靄佈佔恆緻徵摺嚮「」`;
    const tTw = `壅塞西元`;
    const fClear = ` \n　\n　 \n 　	\n 　段首空格\n　 段首空格2\n\n\n\n　删除空白行\n 　段首\n断行1\n\n断行2\n断行3\n\n　 段首2\n....转换省略号\n…补全省略号\n`;
    const fClearAssert = `\n　　段首空格\n　　段首空格2\n　　删除空白行\n　　段首断行1断行2断行3\n　　段首2……转换省略号……补全省略号\n`;
    suite("half → full", () => {
        test("Alphabet, Number, Symbol", () => assert.equal(h2fAlphaNumSymbol(`${halfAlpha}${halfNumber}${halfChars}`), `${fullAlpha}${fullNumber}${fullChars}`));
        test("Alphabet, Number", () => assert.equal(h2fAlphaNum(`${halfAlpha}${halfNumber}`), `${fullAlpha}${fullNumber}`));
        test("Alphabet", () => assert.equal(h2fAlphabet(`${halfAlpha}`), `${fullAlpha}`));
        test("Number", () => assert.equal(h2fNumber(`${halfNumber}`), `${fullNumber}`));
        test("Symbol", () => assert.equal(h2fSymbol(`${halfChars}`), `${fullChars}`));
    });
    suite("full → half", () => {
        test("Alphabet, Number, Symbol", () => assert.equal(f2hAlphaNumSymbol(`${fullAlpha}${fullNumber}${fullChars}`), `${halfAlpha}${halfNumber}${halfChars}`));
        test("Alphabet, Number", () => assert.equal(f2hAlphaNum(`${fullAlpha}${fullNumber}`), `${halfAlpha}${halfNumber}`));
        test("Alphabet", () => assert.equal(f2hAlphabet(`${fullAlpha}`), `${halfAlpha}`));
        test("Number", () => assert.equal(f2hNumber(`${fullNumber}`), `${halfNumber}`));
        test("Symbol", () => assert.equal(f2hSymbol(`${fullChars}`), `${halfChars}`));
    });
    suite("Chinese", () => {
        test("Traditional → Simplified", () => assert.equal(t2sCommon(`${tCommon}`), `${sCommon}`));
        test("Traditional+Locution → Simplified", () => assert.equal(t2sTw(`${tCommon}${tTw}`), `${sCommon}${sStd}`));
        test("Simplified → Traditional", () => assert.equal(s2tCommon(`${sCommon}`), `${tCommon}`));
        test("Simplified+Locution → Traditional", () => assert.equal(s2tTw(`${sCommon}${sStd}`), `${tCommon}${tTw}`));
    });
    suite("Fiction", () => {
        test("Clear", () => assert.equal(fictionClear(`${fClear}`), `${fClearAssert}`));
        test("Format", () => assert.equal(fictionFormat(`${fullAlpha}${fullNumber}${tCommon}${fClear}`), `${halfAlpha}${halfNumber}${sCommon}${fClearAssert}`));
    });
});
