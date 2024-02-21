
// layout: share layout giữa các page con (tái sử dụng layout)

import ThemeRegistry from '@/components/theme-registry/theme.registry';
import NextAuthWrapper from '@/lib/next.auth.wrapper';
import { TrackContextProvider } from '@/lib/track.wrapper';
import { ToastProvider } from '@/ultis/toast';
import Image from 'next/image';
import sunset from '../../public/sunset.jpg';
import NProgressBarWrapper from '@/lib/nprogress.bar.wrapper';
import AppHeader from '@/components/header/app.header';
import AppFooter from '@/components/footer/app.footer';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* ThemeRegistry: caching data: Lưu dữ liệu */}
        {/* NextAuthWrapper: lưu và chia sẻ session giữa các component */}
        <ThemeRegistry>
          <NProgressBarWrapper>
            <NextAuthWrapper>
              <ToastProvider>
                <TrackContextProvider>
                  {children}
                </TrackContextProvider>
              </ToastProvider>
            </NextAuthWrapper>
          </NProgressBarWrapper>
        </ThemeRegistry>

        {/* Image Component: Biến đổi ảnh gốc thành ảnh khác làm sao tăng tốc độ load và dung lương (ĐỒNG THỜI CÓ TÍNH THUỘC TÍNH RESPONSIVE) -> tăng trải nghiệm user */}
        {/* <Image
          src={sunset} --> image local 
          alt='sunset image'
          sizes="100vw"
          // Make the image display full width
          style={{
            width: '100%',
            height: 'auto',
          }}
        /> */}

      </body>
    </html>
  );
}
