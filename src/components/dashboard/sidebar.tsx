'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { 
    Home, ListTodo, Calendar, BarChart3, Settings, BookOpen, 
    GraduationCap, LogOut, MoreHorizontal
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useFirebaseUser } from "@/hooks/use-firebase-user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { getAuth, signOut } from "firebase/auth"; // Firebaseのログアウト機能をインポート

// --- 型定義とデータ定義は変更なし ---
interface SidebarItem {
    title: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
}
interface SidebarSection {
    label: string;
    items: SidebarItem[];
}
const sidebarSections: SidebarSection[] = [
    // ... (前回のコードと同じなので省略)
    {
        label: "基本機能",
        items: [
            { title: "ダッシュボード", url: "/dashboard", icon: Home },
            { title: "タスク一覧", url: "/dashboard/tasks", icon: ListTodo },
            { title: "カレンダー", url: "/dashboard/calendar", icon: Calendar },
        ]
    },
    {
        label: "分析",
        items: [
            { title: "統計", url: "/dashboard/statistics", icon: BarChart3 },
        ]
    },
    {
        label: "学習管理",
        items: [
            { title: "教科", url: "/dashboard/subjects", icon: BookOpen },
            { title: "テスト", url: "/dashboard/tests", icon: GraduationCap },
        ]
    },
    {
        label: "その他",
        items: [
            { title: "設定", url: "/dashboard/settings", icon: Settings },
        ]
    }
];


export default function AppSidebar() {
    const pathname = usePathname();
    const user = useFirebaseUser();

    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            window.location.href = '/login'; 
        } catch (error) {
            console.error("ログアウトエラー", error);
        }
    };

    const renderMenuItem = (item: SidebarItem) => {
        const isActive = pathname === item.url || 
                        (item.url !== '/dashboard' && pathname?.startsWith(item.url));
        
        return (
            <SidebarMenuItem key={item.title}>
                <Link 
                    href={item.url}
                    className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive 
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuItem>
        );
    };

    return (
        <Sidebar className="border-r bg-background">

            <SidebarContent className="flex-1 overflow-auto p-2">
                {sidebarSections.map((section) => (
                    <SidebarGroup key={section.label} className="mb-2">
                        <SidebarGroupLabel className="px-3 py-1 text-xs font-semibold text-muted-foreground/80">
                            {section.label}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="space-y-1">
                                {section.items.map(renderMenuItem)}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter className="border-t p-2">
                {user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="w-full justify-start h-auto px-1 py-2">
                                <div className="flex items-center gap-3 w-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user?.photoURL ?? undefined} alt={user?.displayName ?? "ユーザー"} />
                                        <AvatarFallback>{user?.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col items-start min-w-0">
                                        <span className="text-sm font-medium truncate">{user?.displayName ?? "User Name"}</span>
                                        <span className="text-xs text-muted-foreground truncate">
                                        {
                                            user?.email ? user.email.length > 24 ? user.email.substring(0, 21) + "..." : user.email
                                            : ""
                                        }       
                                        </span>
                                    </div>
                                    <MoreHorizontal className="h-5 w-5 ml-auto text-muted-foreground" />
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="top" align="start" className="w-56">
                            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>ログアウト</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </SidebarFooter>
        </Sidebar>
    );
}
