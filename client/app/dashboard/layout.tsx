import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 md:ml-64">
        <Header />
        <main className="flex-1 p-6 md:px-8 overflow-auto">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}