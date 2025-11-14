'use client'

import Image from "next/image";
import Link from 'next/link'
import { CheckCircle2, Users, Zap, Calendar, BarChart3, Shield } from 'lucide-react';
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <header className="fixed top-0 left-0 w-full z-50 border-b border-gray-200 dark:border-gray-800 h-[60px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl flex items-center justify-between px-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Taskit</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login" className="px-5 py-2 text-sm font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition">
            ログイン
          </Link>
        </div>
      </header>

      <main className="min-h-screen pt-[60px]">
        {/* Hero Section */}
        <section className="flex justify-center items-center min-h-[calc(100vh-60px)] px-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center space-y-8">
              <h1 className="text-6xl md:text-7xl font-semibold tracking-tight text-gray-900 dark:text-white leading-tight">
                学生のための<br />学習管理アプリ
              </h1>
              <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-light max-w-2xl mx-auto">
                効率的なタスク管理を、Taskitで。
              </p>
              <div className="flex justify-center mt-12">
                <Link 
                  href='/login' 
                  className="px-8 py-3.5 text-base font-medium text-white dark:text-gray-900 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors rounded-sm"
                >
                  今すぐ始める
                </Link>
              </div>
            </div>

            {/* Screenshots */}
            <div className="flex justify-center items-center mt-20">
              <div className="relative w-full max-w-4xl h-[400px]">
                <Image
                  src="/screen-1.png"
                  alt="Taskit Screen 1"
                  width={600}
                  height={350}
                  className="absolute top-0 left-1/2 -translate-x-1/2 z-10 border border-gray-200 dark:border-gray-700 rounded-sm"
                />
                <Image
                  src="/screen-2.png"
                  alt="Taskit Screen 2"
                  width={400}
                  height={250}
                  className="absolute bottom-0 right-0 z-20 border border-gray-200 dark:border-gray-700 rounded-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 px-8 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white">
                あなたの学習を、より効率的に
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 dark:bg-gray-700 rounded-sm overflow-hidden">
              <FeatureCard
                icon={<CheckCircle2 className="text-gray-900 dark:text-white h-6 w-6" />}
                title="タスク管理"
                desc="課題や勉強の進捗を「未着手」「進行中」「完了」のステータスで一目で把握。締め切り管理も簡単です。"
              />
              <FeatureCard
                icon={<BarChart3 className="text-gray-900 dark:text-white h-6 w-6" />}
                title="教科ごとの整理"
                desc="教科ごとにタスクを整理し、色分けして管理できます。どの教科にどれだけ時間を使っているかが明確になります。"
              />
              <FeatureCard
                icon={<Calendar className="text-gray-900 dark:text-white h-6 w-6" />}
                title="テスト管理"
                desc="定期テストや資格試験の日程を登録し、それに関連する勉強タスクを計画的に進めることができます。"
              />
              <FeatureCard
                icon={<Zap className="text-gray-900 dark:text-white h-6 w-6" />}
                title="柔軟なタグ付け"
                desc="「重要」「要復習」など、自分だけのタグをタスクに付けて、柔軟にフィルタリングや検索ができます。"
              />
              <FeatureCard
                icon={<Users className="text-gray-900 dark:text-white h-6 w-6" />}
                title="学習コミュニティ"
                desc="友達と進捗を共有したり、教え合ったりできる機能も開発中です。一緒に頑張る仲間を見つけよう。"
              />
              <FeatureCard
                icon={<Shield className="text-gray-900 dark:text-white h-6 w-6" />}
                title="安全なデータ管理"
                desc="あなたの学習データは安全に保護されます。安心して学習に集中できる環境を提供します。"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-8 bg-white dark:bg-gray-900">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white">
              今すぐ始めましょう
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 font-light">
              アカウント作成は無料です。数分で始められます。
            </p>
            <div className="flex justify-center mt-12">
              <Link 
                href='/login' 
                className="px-8 py-3.5 text-base font-medium text-white dark:text-gray-900 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors rounded-sm"
              >
                今すぐ始める
              </Link>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-12 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-light">{desc}</p>
      </div>
    </div>
  );
}