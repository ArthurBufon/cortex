import { AppContent } from '@/Components/AppContent';
import { AppShell } from '@/Components/AppShell';
import { AppSidebar } from '@/Components/AppSidebar';
import { AppSidebarHeader } from '@/Components/AppSidebarHeader';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
