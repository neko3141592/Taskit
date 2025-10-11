import React from 'react';
import Link from 'next/link';
import { Home, ListTodo, BookOpen, User, LogOut } from 'lucide-react';

export default function DashboardLayout({
children,
}: {
children: React.ReactNode;
}) {
return (
    <div className="min-h-screen flex bg-gray-50">
    {/* サイドバー */}
    {/* <aside className="w-64 bg-black text-white flex flex-col py-6 px-4">
        <h2 className="text-xl font-bold mb-8 px-2">Taskit</h2>
        <nav className="flex flex-col gap-1 flex-1">
        <NavLink href="/dashboard" icon={<Home size={18} />} label="ダッシュボード" />
        <NavLink href="/dashboard/tasks" icon={<ListTodo size={18} />} label="タスク管理" />
        <NavLink href="/dashboard/subjects" icon={<BookOpen size={18} />} label="科目管理" />
        <NavLink href="/dashboard/profile" icon={<User size={18} />} label="プロフィール" />
        </nav>
        <div className="mt-auto pt-4">
        <button className="flex items-center gap-2 w-full px-4 py-2 text-gray-300 hover:bg-gray-800 rounded transition-colors">
            <LogOut size={18} />
            <span>ログアウト</span>
        </button>
        </div>
    </aside> */}
    
    {/* メインコンテンツ */}
    <main className="flex-1">
        {children}
    </main>
    </div>
);
}

// ナビゲーションリンクコンポーネント
function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
return (
    <Link 
    href={href} 
    className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-800 rounded transition-colors"
    >
    {icon}
    <span>{label}</span>
    </Link>
);
}