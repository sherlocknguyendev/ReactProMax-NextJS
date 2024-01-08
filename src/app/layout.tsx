
// layout: share layout giữa các page con (tái sử dụng layout)

import ThemeRegistry from '@/components/theme-registry/theme.registry';
import NextAuthWrapper from '@/lib/next.auth.wrapper';
import { TrackContextProvider } from '@/lib/track.wrapper';
import { ToastProvider } from '@/ultis/toast';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* ThemeRegistry: caching data: Lưu dữ liệu */}
        {/* NextAuthWrapper: lưu và chia sẻ session giữa các component */}
        <ThemeRegistry>
          <NextAuthWrapper>
            <ToastProvider>
              <TrackContextProvider>
                {children}
              </TrackContextProvider>
            </ToastProvider>
          </NextAuthWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
