
// layout: share layout giữa các page con (tái sử dụng layout)

import ThemeRegistry from '@/components/theme-registry/theme.registry';
import NextAuthWrapper from '@/lib/next.auth.wrapper';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* ThemeRegistry: caching data: Lưu dữ liệu */}
        <ThemeRegistry>
          {/* NextAuthWrapper: lưu và chia sẻ session giữa các component */}
          <NextAuthWrapper>
            {children}
          </NextAuthWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
