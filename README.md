# GitHub CODEOWNERS Viewer

GitHub の Pull requests ページで CODEOWNERS 情報を常に表示するブラウザ拡張機能です。

## 機能

- Pull request の Files changed タブで各ファイルの CODEOWNERS 情報を表示
- 非同期で読み込まれる diff にも対応

## インストール方法

### Chrome ウェブストアからインストール

（公開後にリンクを追加）

### 手動インストール

1. このリポジトリをクローンまたはダウンロードします
2. `npm install` を実行して依存関係をインストールします
3. `npm run build` を実行して拡張機能をビルドします
4. Chrome の拡張機能管理ページ（chrome://extensions/）を開きます
5. 「デベロッパーモード」を有効にします
6. 「パッケージ化されていない拡張機能を読み込む」をクリックし、`.output/chrome-mv3` ディレクトリを選択します

## 使い方

GitHub の Pull request ページにアクセスするだけで自動的に動作します。各ファイルの diff ヘッダーに CODEOWNERS 情報が表示されます。

## 開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# パッケージ化
npm run zip
```

## ライセンス

MIT
