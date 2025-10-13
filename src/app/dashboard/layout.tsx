'use client';

import React, { useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useFirebaseUser } from "@/hooks/use-firebase-user";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard/sidebar";
import Header from '@/components/dashboard/header';
import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";
import Spinner from '@/components/ui/spinner';
import { Metadata } from 'next';


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = useFirebaseUser();
    const router = useRouter();

    useEffect(() => {
        if (user === null) {
            router.replace("/login");
        }
    }, [user, router]);

    if (user === undefined) {
        return (
            <Spinner className="flex justify-center items-center h-screen"/>
        )
    }

    return (
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
    );
}