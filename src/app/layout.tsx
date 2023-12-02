
// layout: share layout giữa các page con (tái sử dụng layout)
import ThemeRegistry from '@/components/theme-registry/theme.registry';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
