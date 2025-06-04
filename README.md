# GINZA SIX SpruceKit PoC MVP

GINZA SIX体験のための検証可能な資格情報（Verifiable Credentials）システムのプルーフオブコンセプト（PoC）MVPです。SpruceKitを使用して、発行、保存、検証の一連のフローを実装しています。

## プロジェクト概要

このプロジェクトは、GINZA SIXの体験に関する検証可能な資格情報（VC）を発行、保存、検証するためのシステムです。以下のコンポーネントで構成されています：

1. **バックエンドサーバー**: Express.jsベースのAPIサーバー
2. **スタッフUI**: VC発行用のNext.jsアプリケーション
3. **ウォレットUI**: VC保存・表示用のNext.jsアプリケーション
4. **検証UI**: VC検証用のNext.jsアプリケーション

## 技術スタック

- **バックエンド**: Node.js, Express.js
- **フロントエンド**: Next.js, React, TypeScript, Tailwind CSS
- **認証・資格情報**: SpruceKit, DID (Decentralized Identifiers)
- **コンテナ化**: Docker, Docker Compose
- **データ保存**: ローカルストレージ（本番環境ではデータベースに移行予定）

## システムアーキテクチャ

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   スタッフUI     │     │   ウォレットUI   │     │    検証UI      │
│  (Next.js)      │     │  (Next.js)      │     │  (Next.js)      │
│   Port: 3000    │     │   Port: 3002    │     │   Port: 3003    │
│                 │     │                 │     │                 │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │                       │                       │
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         └─────────────►│                 │◄─────────────┘
                        │  バックエンドAPI  │
                        │  (Express.js)   │
                        │   Port: 3001    │
                        │                 │
                        └─────────────────┘
```

## セットアップ手順

### 前提条件

- Docker と Docker Compose がインストールされていること
- Node.js v18以上がインストールされていること（ローカル開発の場合）

### Dockerを使用したセットアップ

1. リポジトリをクローン
   ```bash
   git clone https://github.com/yourusername/ginza-six-spruce-poc.git
   cd ginza-six-spruce-poc
   ```

2. Docker Composeでビルドと起動
   ```bash
   docker-compose up -d
   ```

3. 各UIにアクセス
   - スタッフUI: http://localhost:3000
   - ウォレットUI: http://localhost:3002
   - 検証UI: http://localhost:3003

### ローカル開発環境のセットアップ

1. バックエンドサーバーのセットアップ
   ```bash
   cd ginza-six-server
   npm install
   npm run dev
   ```

2. スタッフUIのセットアップ
   ```bash
   cd nextjs-ginza-six/staff-ui
   npm install
   npm run dev
   ```

3. ウォレットUIのセットアップ
   ```bash
   cd nextjs-ginza-six/wallet-ui
   npm install
   npm run dev -- -p 3002
   ```

4. 検証UIのセットアップ
   ```bash
   cd nextjs-ginza-six/verifier-ui
   npm install
   npm run dev -- -p 3003
   ```

## 使用方法

### VC発行フロー

1. スタッフUIにアクセス（http://localhost:3000）
2. メールアドレス、カテゴリ、体験を入力
3. 「セッション作成」ボタンをクリック
4. セッションIDが表示されたら、「資格情報を発行」ボタンをクリック
5. 発行された資格情報（VC）が表示される

### VC保存フロー

1. ウォレットUIにアクセス（http://localhost:3002）
2. スタッフUIで取得したセッションIDを入力
3. 「資格情報を取得」ボタンをクリック
4. 資格情報がウォレットに保存され、表示される

### VC検証フロー

1. 検証UIにアクセス（http://localhost:3003）
2. ウォレットUIからコピーしたVC情報を入力
3. 「検証する」ボタンをクリック
4. 検証結果が表示される

### VC削除機能

1. ウォレットUIにアクセス（http://localhost:3002）
2. 削除したい資格情報カードの「削除」ボタンをクリック
3. 確認ダイアログで「削除を確認」をクリック
4. 資格情報がウォレットから削除される

## プロジェクト構造

```
ginza-six-spruce-poc/
├── docker-compose.yml        # Docker Compose設定
├── ginza-six-server/         # バックエンドサーバー
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── index.js          # サーバーエントリーポイント
├── nextjs-ginza-six/         # フロントエンドプロジェクト
│   ├── staff-ui/             # スタッフUI
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── src/
│   │       └── ...
│   ├── wallet-ui/            # ウォレットUI
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── src/
│   │       └── ...
│   └── verifier-ui/          # 検証UI
│       ├── Dockerfile
│       ├── package.json
│       └── src/
│           └── ...
└── README.md                 # このファイル
```

## DIDと秘密鍵の管理

### 開発環境

開発環境では、DIDと秘密鍵は以下のように管理されています：

- DID: `did:web:ginza6.tokyo`形式を使用
- 秘密鍵: サーバーのファイルシステムに保存（アクセス制限付き）

### 本番環境の推奨事項

本番環境では、以下の方法で秘密鍵を管理することを推奨します：

1. AWS KMS、Google Cloud KMS、HashiCorp Vaultなどの鍵管理サービスを使用
2. 環境変数として保存せず、常に安全なストレージから読み込む
3. 定期的な鍵のローテーションを実装

## 今後の開発計画

1. **本番環境への移行**
   - より堅牢な鍵管理システムの導入
   - HTTPS対応とセキュリティ強化
   - スケーラビリティの確保

2. **機能拡張**
   - QRコードスキャン機能の追加
   - 複数種類のVCのサポート
   - モバイルウォレット連携

3. **UI/UX改善**
   - モバイル対応の強化
   - アクセシビリティの向上
   - デザインの洗練

## トラブルシューティング

### Docker関連の問題

- **コンテナが起動しない場合**
  ```bash
  # ログを確認
  docker-compose logs
  
  # 特定のサービスのログを確認
  docker-compose logs service_name
  ```

- **ビルドエラーが発生する場合**
  ```bash
  # キャッシュを使用せずに再ビルド
  docker-compose build --no-cache
  ```

### APIアクセスの問題

- CORS設定が正しいことを確認
- 各UIの`.env.local`ファイルでAPIのURLが正しく設定されていることを確認

## ライセンス

このプロジェクトは[MITライセンス](LICENSE)の下で公開されています。

## 貢献

プルリクエストは歓迎します。大きな変更を加える場合は、まずissueを開いて議論してください。

## 連絡先

質問や問題がある場合は、issueを開くか、プロジェクト管理者にお問い合わせください。
