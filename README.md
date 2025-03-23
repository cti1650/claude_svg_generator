# Claude SVG Generator

Claudeの API を活用してSVGイメージを生成するウェブアプリケーションです。

## 機能

- API Key をローカルストレージに暗号化して保存
- SVG イメージの生成と修正
- SVG/PNG 形式でのダウンロード
- カスタムプロンプトとテンプレート
- 詳細設定（モデル選択、温度パラメータ）

## Cloudflare Workers へのデプロイ方法

### 前提条件

- [Node.js](https://nodejs.org/) (バージョン 14 以上)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (`npm install -g wrangler`)
- Cloudflare アカウント

### セットアップ手順

1. リポジトリをクローンまたはダウンロードします

2. Wrangler で認証します

```bash
wrangler login
```

3. `wrangler.toml` ファイルを編集し、必要に応じて設定を変更します
   - `name`: プロジェクト名
   - `zone_name`: あなたの Cloudflare ドメイン (カスタムドメインを使用する場合)

4. ローカルで開発サーバーを起動してテストします

```bash
wrangler dev
```

5. Cloudflare にデプロイします

```bash
wrangler deploy
```

## プロジェクト構造

```
/
├── index.html            # メインアプリケーション 
├── functions/
│   └── api/
│       └── claude.js     # Claude API 用の Cloudflare Function
└── wrangler.toml         # Wrangler 設定ファイル
```

## カスタマイズ

- `index.html` のプロンプトテンプレートを変更することで、生成される SVG の種類を調整できます
- `functions/api/claude.js` で API リクエストのパラメータを変更できます

## 注意事項

- このアプリケーションを使用するには、Anthropic の Claude API キーが必要です
- API キーはローカルでのみ保存され、サーバーには保存されません
- 生成されるイメージは Claude の能力に依存します