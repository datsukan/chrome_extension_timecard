# Chatwork 勤怠送信 Chrome拡張機能

Chatworkで勤怠連絡を簡単に行えるようにするChrome拡張機能です。  
Chatworkのメッセージ入力欄上部に勤怠メッセージの自動送信ボタンを追加します。  
表示するチャットルームを指定することもできます。  
Chrome拡張機能なのでGoogleChromeとMicrosoftEdgeで使用することができます。

**[Chromeウェブストアの公開ページ](https://chrome.google.com/webstore/detail/chatwork-timecard-plugin/ckoifmdeompppgeellbokfgekhojcheh?hl=ja)**

|||
|---|---|
|![1](https://lh3.googleusercontent.com/89WUB3DHqBL3WbhzXBxQYrJI84vxZoM2Zt2JpEIJ_OyIpuVgxuWPYvSLy1SKYNllICeh0MYk2hqRYvgjvrqoF-cGOQ=w640-h400-e365-rj-sc0x00ffffff)|![2](https://lh3.googleusercontent.com/97P8hILNVl8G3bDyINIrC6_nm-3s-Bano3HJr-rfQTmVhkMVZVnYuQqQuu64wkLDRwUdjxXsTsBzf5YZTcxRqMiFKA=w640-h400-e365-rj-sc0x00ffffff)|

# リリース手順

## 1. フロントエンドソースのビルド

```
cd vue
npm install # まだ実施しておらずnode_modulesが存在していない場合のみ
npm run build
```

## 2. 不要ソースの削除

ソースコードを別の場所にコピーして、下記以外は削除する。

- css/*
- icon/*
- js/*
- lib/*
- vue/
  - dist/*
  - index.html
  - style.css
- manifest.json

## 3. chromeウェブストアに公開する

不要ソースを削除した状態で全体をZipに圧縮する。  
Zipの状態でchromeウェブストアの管理ページからアップロードする。

# Author \ 著者

datsukan

# License \ ライセンス

[MIT License](https://en.wikipedia.org/wiki/MIT_License)
