'use client'

import { Plus, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import NotificationsDialog from "./notifications-dialog";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import CreateTaskModal from "./create-task-modal";
import { Input } from "../ui/input";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Header() {
    const handleLogout = async () => {
        await signOut({ callbackUrl: "/login" });
    };

    return (
        <header className="relative border border-gray-200 dark:border-gray-700 h-[60px] rounded mb-4 bg-white dark:border-none dark:bg-neutral-900 flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
                <SidebarTrigger />
                <span className="font-bold text-lg text-gray-700 dark:text-gray-200 ">Taskit</span>
            </div>
            <div className="flex items-center gap-2 relative">
                <ThemeToggle />
                <NotificationsDialog />
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