# 小说格式化


- 整理文档
- 整理变更记录
- 发布到VScode


有用VS Code看TEXT小说的习惯，所以自制了这个缝合了全半角转换、繁简转换、段落整理的小说格式化插件。
其中全半角转换和简繁转换比较通用，小说的格式化的模式则按照个人习惯进行了硬编码。

## 待办

- 中英文数字互相转换
- 规范化小说章节、标题

## 功能

- **全半角**转换支持的命令
  - 字母、数字、符号
  - 字母、数字
  - 字母
  - 数字
  - 符号（部分符号的转换可通过扩展配置来修改）
- **繁简**转换支持的命令
  - 繁体 -> 简体
  - 繁体+惯用语 -> 简体（同时将台语惯用词替换为普通话惯用词）
  - 简体 -> 繁体
  - 简体+惯用语 -> 繁体（同时将普通话惯用词替换为台语惯用词）
- **段落整理**的模式
  - 删除段落末尾空格
  - 整理段首为两个全角空格
  - 删除空白行
  - 规范省略号
- **小说格式化**
  - 将全角的字母、数字、符号转为半角
  - 将繁体转为简体
  - 进行段落整理

## 安装

- [VS Code](https://marketplace.visualstudio.com/items?itemName=masakit.zenkaku-hankaku) 直接浏览下载
- 从VS Code应用内的命令（`Ctrl+Alt+P`）搜索 `fiction formater`。

## 修改

```shell
# 下载源代码
$ git clone https://github.com/fmalee/fiction-formater.git
$ cd fiction-formater
$ npm install

# 发布
$ npm install -g vsce
$ vsce package
```

### Docker

```shell
# 拉取Node镜像
$ docker pull node:18-alpine

# 下载源代码
$ git clone https://github.com/fmalee/fiction-formater.git
$ cd fiction-formater

# 安装依赖
$ docker run --rm --volume $PWD:/www --workdir /www node:18-alpine npm install
```

## 使用

- 菜单：
  - 将编辑器的语言模式切换为 `纯文本（plaintext）`
    
    > 因为本扩展不是通用功能，所以限定了激活模式为纯文本。
  - 选择文本（或是全部） -> 右击：
    - `半角 → 全角`
      - `字母 + 数字 + 符号`
      - `字母 + 数字`
      - `字母`
      - `数字`
      - `符号`
    - `全角 → 半角`
      - `字母 + 数字 + 符号`
      - `字母 + 数字`
      - `字母`
      - `数字`
      - `符号`
    - `中文`
      -  `繁体 → 简体`
      -  `繁体 + 惯用语 → 简体`
      -  `简体 → 繁体`
      -  `简体 + 惯用语 → 繁体`
    - `小说`
      - `格式化小说`
      - `段落整理`
  
- 命令（`Ctrl+Alt+P`）：
  - 命令模式**没有**语言模式的限制
  
  - 相关命令的关键字就是 `菜单` 上显示的那些字符，用的都是一套本地化词条。
    
    如搜 `全 字 符`，就会列出 `半角 → 全角：字母 + 数字 + 符号` 和 `全角 → 半角：字母 + 数字 + 符号` 两个命令

## 设置

支持的配置项：

- 在将繁体小说转换成简体时，是否同时转换台湾惯用语
- 部分常用符号的全半角转换支持多个选项：
  - 空格（` `）
  - 反斜杠（`\\`）
  - 破折号（`-`）
  - 波浪号（`~`）
  - 句号（`.`）
  - 逗号（`,`）

## 贡献

- [全半角转换（mo-san/Zenkaku-Hankaku）](https://github.com/mo-san/Zenkaku-Hankaku)
- [简繁转换（gornin/pudding）](https://github.com/gornin/pudding)
- [简繁字典（mumuy/chinese-transverter）](https://github.com/mumuy/chinese-transverter)

## 许可

MIT Licence

## 更新

- 1.0.0 / 2024-08-22 初始版本
