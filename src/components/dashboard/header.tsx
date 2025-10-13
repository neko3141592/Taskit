import { Plus, Search } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useFirebaseUser } from "@/hooks/use-firebase-user";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import CreateTaskModal from "./create-task-modal";
import { Input } from "../ui/input";

export default function Header() {
    const user = useFirebaseUser();

    const handleLogout = async () => {
        await signOut(auth);
    };

    return (
        <header className="border border-gray-200 h-[60px] rounded mb-4 bg-white flex items-center justify-between px-6">
            {/* 左側：ロゴやタイトル */}
            <div className="flex items-center gap-3">
                <SidebarTrigger />
                <span className="font-bold text-lg text-gray-700 ">Taskit</span>
            </div>
            <div className="flex items-center gap-2">
                {/* 検索ダイアログ */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="p-2 bg-transparent hover:bg-transparent hover:text-gray-500 hover:shadow-none focus:bg-transparent active:bg-transparent"
                            style={{ boxShadow: "none" }}
                        >
                            <Search className="h-5 w-5 text-gray-500" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[350px]">
                        <DialogHeader>
                            <DialogTitle>クイック検索</DialogTitle>
                        </DialogHeader>
                        <form>
                            <Input
                                type="text"
                                placeholder="キーワードを入力"
                                className="mt-2"
                            />
                            {/* 検索結果表示などはここに追加可能 */}
                        </form>
                    </DialogContent>
                </Dialog>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="default"
                            className="flex items-center gap-2 font-semibold"
                            size="sm"
                        >
                            <Plus className="h-4 w-4" />
                            作成
                        </Button>
                    </DialogTrigger>
                    <CreateTaskModal />
                </Dialog>
            </div>
        </header>
    );
}