import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
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
    );
}