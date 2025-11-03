# Taskit 開発環境・ビルド

## 開発環境
- 開発機材: M1 Pro MacBook Pro (16GB RAM) / M5 MacBook Pro (32GB RAM)
- OS: macOS Tahoe 26.0
- フレームワーク: Next.js v15.5.4 (TypeScript)
- DB: PostgreSQL + Prisma ORM
- Docker version 28.5.1, build e180ab8
- ライブラリ: package.jsonを参照

## URL
[Taskit](https://neko3141592.net)

## ビルド方法(ローカル)

### 必要なツール
- Node.js (v24以上推奨)
- Docker/Docker Compose
- Git
- Google Client ID & Google Client SECRET
- OpenAI API Key

### 手順
1. .env.exampleを参考に、.envファイルを作成し必要な環境変数を記述する
2. docker composeでビルド
    ```sh
        docker compose up --build
    ```
3. 開発サーバーにアクセス
- [localhost:3000](http://localhost:3000)

### 推奨環境
4GB以上のRAM, 20GB以上のストレージ空き容量

## お問い合わせ
ビルドに関して問題が発生している場合は、[yudai3.1415926@gmail.com](mailto:yudai3.1415926@gmail.com)までご連絡ください。