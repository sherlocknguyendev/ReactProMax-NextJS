
'use client'
import { SessionProvider } from "next-auth/react"
import ThemeRegistry from '@/components/theme-registry/theme.registry';

// Đây là 1 wrapper, bọc và gián tiếp biến các children ở trong nó thành client component (tránh mất tính server component ở 1 số component)
export default function NextAuthWrapper({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}
