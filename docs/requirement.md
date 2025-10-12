# Taskit 仕様書

## アプリケーション概要

Taskitは、学生のテスト勉強・学習タスクを効率的に管理するためのWebアプリケーションです。  
Next.js + Firebase + Prisma/PostgreSQLを基盤とし、直感的なUIと強力な分析機能を提供します。

---

## 必須機能チェックリスト

### 基盤
- [x] Next.jsプロジェクトの作成
- [ ] GitHubプロジェクトの作成
- [ ] Firebaseプロジェクトの作成

### ユーザー認証
- [ ] Firebase Authによるユーザー登録
- [ ] メールアドレス・パスワードでのログイン
- [ ] Googleアカウントによるソーシャルログイン
- [ ] パスワードリセット
- [ ] ユーザープロフィールページ
- [ ] バックエンド認証ミドルウェア

### テスト管理
- [ ] テスト情報登録（科目名、日付、難易度等）
- [ ] テストCRUD
- [ ] テスト一覧表示（日付順・科目別）
- [ ] テスト詳細ページ
- [ ] テスト結果記録・成績推移グラフ

### タスク管理
- [ ] タスクCRUD
- [ ] タスク進捗管理（未着手・進行中・完了）
- [ ] 優先度設定
- [ ] 期限設定・通知

### 学習計画
- [ ] テストまでの学習スケジュール自動生成
- [ ] 1日あたり学習時間設定
- [ ] 学習進捗可視化（ガントチャート等）
- [ ] 計画調整機能

### 統計・分析
- [ ] 科目別学習時間統計
- [ ] テスト結果分析ダッシュボード
- [ ] 弱点分野特定・表示
- [ ] 学習効率分析

### UI/UX
- [ ] レスポンシブデザイン
- [ ] ダーク/ライトモード切替
- [ ] shadcn + Tailwindによる統一UI
- [ ] 直感的ナビゲーション

### データベース設計
- [ ] Prismaスキーマ定義
- [ ] リレーショナルデータモデリング
- [ ] マイグレーション計画
- [ ] バックアップ戦略

### API設計
- [ ] RESTful API設計
- [ ] API認証（JWT/Firebaseトークン）
- [ ] エラーハンドリング
- [ ] APIドキュメント

---

## 技術スタック

- **フロントエンド**: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Axios, Redux
- **バックエンド**: Next.js API Route, Prisma ORM, PostgreSQL, Firebase Auth
- **テスト**: Jest, React Testing Library, Cypress
- **品質管理**: ESLint, Prettier

---

- エラーレスポンス例

```json
{
  "status": "error",
  "code": 400,
  "message": "無効なリクエストデータ",
  "details": {
    "field": "subject",
    "error": "科目名は必須です"
  }
}
```

---

## ディレクトリ構成

```
src/
  app/
    layout.tsx
    page.tsx
    api/
      auth/
      tasks/
      subjects/
      tests/
  components/
  features/
  lib/
  types/
  store/
  styles/
prisma/
  schema.prisma
  migrations/
.env
package.json
...
```

---

## 開発フェーズ

1. **MVP**: 認証・テスト登録・タスク管理
2. **拡張**: 学習計画・統計機能
3. **最適化**: UI改善・パフォーマンス・フィードバック対応

---

## ページ一覧

- `/` トップページ
- `/login` ログイン
- `/register` 新規登録
- `/dashboard` ダッシュボード
- `/dashboard/tasks` タスク管理
- `/dashboard/subjects` 科目管理
- `/dashboard/profile` プロフィール
- `/dashboard/tests` テスト管理
- `/dashboard/statistics` 統計・分析

---

## 備考

- 詳細なAPI・ページ実装状況はNotion参照
- 仕様は随時アップデート
