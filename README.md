# Taskit 開発環境・ビルド

## 開発環境
- 開発機材: M1 Pro MacBook Pro (16GB RAM) / M5 MacBook Pro (32GB RAM)
- OS: macOS Tahoe 26.0
- フレームワーク: Next.js v15.5.4 (TypeScript)
- DB: PostgreSQL + Prisma ORM
- Docker version 28.5.1, build e180ab8
- ライブラリ: package.jsonを参照


## ビルド方法(ローカル)

### 必要なツール
- Node.js (v24以上推奨)
- Docker/Docker Compose
- Git

### 必要な認証情報
- Google OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- OpenAI API: `OPENAI_API_KEY`（AI機能を使用する場合）

### 手順
1. リポジトリをクローン
2. `.env.example`を参考に、`.env`ファイルを作成
   ```sh
   cp .env.example .env
   ```
3. 必要な環境変数を記述
   - `DATABASE_URL`: PostgreSQLデータベースURL
   - `AUTH_SECRET`: NextAuth用のシークレットキー
   - `NEXTAUTH_URL`: アプリケーションURL（開発環境では`http://localhost:3000`）
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: Google OAuth認証情報
   - `OPENAI_API_KEY`: OpenAI APIキー（AI機能使用時）
4. Docker Composeでビルド
    ```sh
    docker compose up --build
    ```
5. 開発サーバーにアクセス
   - [localhost:3000](http://localhost:3000)

### 通知の使用
このプロジェクトの通知機能を使用するためにはcronの設定が必要です

#### cronの設定例
   ```sh
   * * * * * curl -X GET http://localhost:3000/api/notifications/cron
   ```

### 推奨環境
4GB以上のRAM, 20GB以上のストレージ空き容量

## お問い合わせ
ビルドに関して問題が発生している場合は、[yudai3.1415926@gmail.com](mailto:yudai3.1415926@gmail.com)までご連絡ください。