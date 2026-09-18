# 匠ネットワーク デモ (TAKUMI NETWORK)

協力業者プラットフォーム「匠ネットワーク」のデモアプリです。業者スコアリング・協業マッチング・選定アシスタント（ルールベースのデモ応答）の3機能を提供します。

> 元のプロトタイプソース: [`sunple.md`](./sunple.md)

## 技術スタック

- React + Vite
- Recharts / Lucide React
- Vercel（静的ホスティング + Serverless Functions）

## ローカル開発

トップページに紹介アニメーションを掲載しています。直接体験する場合は `/#score`（査定）、`/#match`（協業）、`/#assist`（相談）を開いてください。
設計メモ・場面表・差し替え箇所は [紹介のREADME](src/components/demo-intro/README.md) に記載しています。

```bash
npm install
npm run dev
```

`npm run dev` では Vite の開発サーバー上で `/api/chat` も動作します（選定アシスタントタブ用）。

Vercel CLI を使う場合:

```bash
npx vercel dev
```

## ビルド

```bash
npm run build
npm run preview
```

## デプロイ（Vercel）

1. [vercel.com](https://vercel.com) に GitHub アカウントでログイン
2. **Add New Project** → `ideal-tomy/hookapp_demo` を Import
3. Framework Preset: **Vite**
4. **Deploy**

以降、`main` ブランチへの push で自動再デプロイされます。

## 投資回収CTA

`VITE_ROI_SIMULATOR_URL` を設定すると、フッター直上に投資回収シミュレーター（`roi-simulator`）への導線が表示されます。

- 遷移: `/?kit=webapp&industry=construction&cat=dashboard&from=hookapp-takumi`
- 別タブで開きます
- 出口: 「見積もりを閉じる」→ 閲覧モード（業界選択可）。正本 [`../roi-simulator/docs/demo-roi-integration-playbook.md`](../roi-simulator/docs/demo-roi-integration-playbook.md) §1.2

## 将来の AI 連携

選定アシスタントは `/api/chat` エンドポイント経由で応答します。AI 実装時は [`api/chat.js`](./api/chat.js) を Anthropic API プロキシに差し替え、Vercel に `ANTHROPIC_API_KEY` を設定してください（`.env.example` 参照）。フロントエンドの変更は不要です。

## ライセンス

デモ用途。サンプルデータに基づく査定ロジックです。
