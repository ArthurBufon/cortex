import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/Components/Ui/Sonner';
import { TooltipProvider } from '@/Components/Ui/Tooltip';
import { initializeTheme } from '@/Hooks/UseAppearance';
import AppLayout from '@/Layouts/AppLayout';
import AuthLayout from '@/Layouts/AuthLayout';
import SettingsLayout from '@/Layouts/Settings/SettingsLayout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'Welcome':
                return null;
            case name.startsWith('Auth/'):
                return AuthLayout;
            case name.startsWith('Settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
