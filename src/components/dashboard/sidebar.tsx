'use client'

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
    Home, 
    ListTodo, 
    Calendar, 
    BarChart3, 
    Settings, 
    BookOpen, 
    GraduationCap,
    Users 
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarItem {
    title: string;
    url: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const dashboardItems: SidebarItem[] = [
{
    title: "ダッシュボード",
    url: "/dashboard",
    icon: Home,
},
{
    title: "タスク一覧",
    url: "/dashboard/tasks",
    icon: ListTodo,
},
{
    title: "カレンダー",
    url: "/dashboard/calendar",
    icon: Calendar,
},
]

const analyticsItems = [
{
    title: "統計",
    url: "/dashboard/statistics",
    icon: BarChart3,
},
]

const academicItems = [
{
    title: "教科",
    url: "/dashboard/subjects",
    icon: BookOpen,
},
{
    title: "テスト",
    url: "/dashboard/tests",
    icon: GraduationCap,
},
]


const systemItems = [
    {
        title: "メンバー",
        url: "/dashboard/team",
        icon: Users,
    },
    {
        title: "設定",
        url: "/dashboard/settings",
        icon: Settings,
    },
    
]

export default function AppSidebar() {
    const pathname = usePathname()

    const renderMenuItems = (items: SidebarItem[]) => {
        return items.map((item) => {
        const isActive = pathname === item.url || 
                        (item.url !== '/dashboard' && pathname?.startsWith(item.url))
        
        return (
            <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
                <Link 
                href={item.url}
                className={cn(
                    "flex items-center space-x-2 w-full",
                    isActive && "font-medium bg-accent text-accent-foreground"
                )}
                >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
                </Link>
            </SidebarMenuButton>
            </SidebarMenuItem>
        )
        })
    }

    return (
        <Sidebar className="bg-white border-r">
        
        <SidebarContent className="px-4">
            {/* 基本機能 */}
            <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground">
                基本機能
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                {renderMenuItems(dashboardItems)}
                </SidebarMenu>
            </SidebarGroupContent>
            </SidebarGroup>

            {/* 分析 */}
            <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground">
                分析
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                {renderMenuItems(analyticsItems)}
                </SidebarMenu>
            </SidebarGroupContent>
            </SidebarGroup>

            {/* 学習管理 */}
            <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground">
                学習管理
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                {renderMenuItems(academicItems)}
                </SidebarMenu>
            </SidebarGroupContent>
            </SidebarGroup>

            {/* システム */}
            <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground">
                システム
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                {renderMenuItems(systemItems)}
                </SidebarMenu>
            </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="px-4 py-2">
            
        </SidebarFooter>
    </Sidebar>
    );
}