'use client'

import Image from "next/image";
import Link from 'next/link'
import { CheckCircle2, Users, Zap, Calendar, BarChart3, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div>
      <main className="min-h-screen">
        <div className="flex justify-center items-center min-h-[400px] bg-gradient-to-br">
          <div className="md:flex items-center p-6 max-w-6xl mx-auto w-full">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800">学生のための学習管理アプリ</h1>
              <p className="text-gray-500 pt-4 text-lg">効率的なタスク管理を、Taskitで。</p>
              <div className="flex mt-6 gap-2">
                <Link href='/register' className="px-4 py-2 text-white bg-black rounded-sm hover:bg-gray-800 transition">今すぐ始める</Link>
                <Link href='/login' className="px-4 py-2 border border-gray-300 rounded-sm hover:bg-gray-100 transition">ログイン</Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center items-center mt-8 md:mt-0">
              <div className="relative w-[450px] h-[220px]">
                <Image
                  src="/screen-1.png"
                  alt="Taskit Screen 1"
                  width={350}
                  height={180}
                  className="rounded-xl shadow-xl absolute top-0 left-0 z-10"
                  style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
                />
                <Image
                  src="/screen-2.png"
                  alt="Taskit Screen 2"
                  width={250}
                  height={140}
                  className="rounded-xl shadow-xl absolute bottom-0 right-0 z-20"
                  style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <FeatureCard
              icon={<CheckCircle2 className="text-blue-500 h-7 w-7" />}
              title="タスク管理"
              desc="課題や勉強の進捗を「未着手」「進行中」「完了」のステータスで一目で把握。締め切り管理も簡単です。"
              bg="bg-blue-100"
            />
            <FeatureCard
              icon={<BarChart3 className="text-green-500 h-7 w-7" />}
              title="科目ごとの整理"
              desc="科目ごとにタスクを整理し、色分けして管理できます。どの科目にどれだけ時間を使っているかが明確になります。"
              bg="bg-green-100"
            />
            <FeatureCard
              icon={<Calendar className="text-yellow-500 h-7 w-7" />}
              title="テスト管理"
              desc="定期テストや資格試験の日程を登録し、それに関連する勉強タスクを計画的に進めることができます。"
              bg="bg-yellow-100"
            />
            <FeatureCard
              icon={<Zap className="text-purple-500 h-7 w-7" />}
              title="柔軟なタグ付け"
              desc="「重要」「要復習」など、自分だけのタグをタスクに付けて、柔軟にフィルタリングや検索ができます。"
              bg="bg-purple-100"
            />
            <FeatureCard
              icon={<Users className="text-red-500 h-7 w-7" />}
              title="学習コミュニティ（予定）"
              desc="友達と進捗を共有したり、教え合ったりできる機能も開発中です。一緒に頑張る仲間を見つけよう！"
              bg="bg-red-100"
            />
            <FeatureCard
              icon={<Shield className="text-gray-500 h-7 w-7" />}
              title="安全なデータ管理"
              desc="あなたの学習データは安全に保護されます。安心して学習に集中できる環境を提供します。"
              bg="bg-gray-100"
            />
          </div>
        </div>
      </main>
      <footer className="w-full bg-gray-50 border-t mt-12 py-6">
          <div className="max-w-6xl mx-auto px-4 mb-6 flex gap-2">
            <p className="mb-2">Taskit</p>
            <a
              href="https://github.com/neko3141592/Taskit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 text-sm  transition"
            >
              <Image src="/github-mark.png" alt="GitHub" width={24} height={24} className="inline-block ml-2" />
            </a>
          </div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-4">
          <div className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Taskit. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="text-gray-500  text-sm  transition">
              プライバシーポリシー
            </Link>
            
            <a
              href="mailto:yudai3.1415926@gmail.com"
              className="text-gray-500  text-sm  transition"
            >
              お問い合わせ
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  bg,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  bg: string;
}) {
  return (
    <div className={`p-6  rounded-sm bg-gray-50 hover:shadow-md transition`}>
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-full`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-gray-600 mt-4">{desc}</p>
    </div>
  );
}
