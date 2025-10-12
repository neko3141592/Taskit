import { useEffect, useState } from "react";
import { LogOut, User, Plus } from "lucide-react";
import { getAuth, signOut, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase"; // firebase.tsで初期化したappをimport
import {  SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button";
import { useFirebaseUser } from "@/hooks/use-firebase-user";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import CreateTaskModal from "./create-task-modal";


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
                <span className="font-bold text-lg text-gray-700">Taskit</span>
            </div>
            <div className="flex items-center gap-4">
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