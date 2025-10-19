import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard/sidebar";
import Header from '@/components/dashboard/header';
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <SessionProvider session={session}>
            <SidebarProvider>
                <AppSidebar />
                <main className="w-full">
                    <div className="px-4 py-4">
                        <div className="sticky top-4 z-30 bg-white">
                            <Header />
                        </div>
                        {children}
                    </div>
                </main>
                <Toaster />
            </SidebarProvider>
        </SessionProvider>
    );
}