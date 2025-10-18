import { auth } from "@/../auth";
import Link from "next/link";

export default async function NotFound() {
    const session = await auth();

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-xl mb-8">お探しのページは見つかりませんでした</p>
            {session?.user ? (
                <Link href="/dashboard" className="px-4 py-2 bg-black text-white rounded-sm">
                    ダッシュボードに戻る
                </Link>
            ) : (
                <Link href="/login" className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition flex items-center">
                    ログイン
                </Link>
            )}
        </div>
    );
}