
// layout: share layout giữa các page con (tái sử dụng layout)
import AppFooter from '@/components/footer/app.footer';
import AppHeader from '@/components/header/app.header';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      {children}
      <div style={{ marginBottom: '200px' }}></div>
      <AppFooter />
    </>
  );
}
