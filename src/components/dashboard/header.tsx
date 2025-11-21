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
import { useState } from "react";

export default function Header() {
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
    
    const handleLogout = async () => {
        await signOut({ callbackUrl: "/login" });
    };

    return (
        <header className="relative border border-gray-200 dark:border-neutral-700 h-[60px] rounded-sm mb-4 bg-white dark:border-none dark:bg-neutral-900 flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
                <SidebarTrigger />
                <span className="font-bold text-lg text-gray-900 dark:text-neutral-200 ">Taskit</span>
            </div>
            <div className="flex items-center gap-2 relative">
                <ThemeToggle />
                <NotificationsDialog />
                <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
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
                    <CreateTaskModal onClose={() => setIsCreateTaskOpen(false)} />
                </Dialog>
            </div>
        </header>
    );
}