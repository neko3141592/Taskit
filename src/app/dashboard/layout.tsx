'use client';

import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/dashboard/sidebar"
import Header from '@/components/dashboard/header';
import { Toaster } from "@/components/ui/sonner"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                <div className="px-4 py-4">
                    {/* stickyヘッダー */}
                    <div className="sticky top-4 z-30 bg-white">
                        <Header />
                    </div>
                    {children}
                </div>
            </main>
            <Toaster />
        </SidebarProvider>
    );
}