import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { BottomNav } from '@/components/BottomNav';
import { AgeGateModal } from '@/components/AgeGateModal';
import { WhatsAppSupport } from '@/components/WhatsAppSupport';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Frndma — Real People • Genuine Connections ❤️ (18+ Dating Platform)',
  description:
    'Meet someone who gets you. Frndma is a modern, premium dating and social connection platform for consenting adults (18+). Discover verified profiles, view details, and unlock direct contacts.',
  icons: {
    icon: '/logo.png?v=6',
    apple: '/logo.png?v=6',
  },
  keywords: [
    'dating',
    'connections',
    'real people',
    'dating app',
    'relationships',
    'romantic connections',
    '18+ dating',
  ],
  openGraph: {
    title: 'Frndma — Real People • Genuine Connections ❤️',
    description: 'Find someone who gets you. Modern adult dating platform with verified profiles.',
    url: 'https://frndma.com',
    siteName: 'Frndma',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-transparent text-zinc-100 min-h-screen flex flex-col selection:bg-primary selection:text-white relative">
        {/* Global Fixed Background: Mobile View vs Windows/Desktop View */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Mobile view image (mobile view bg img.png) */}
          <img
            src="/images/frndma-mobile-bg.png"
            alt="Frndma Mobile View"
            className="w-full h-full object-cover object-top brightness-90 contrast-105 block md:hidden"
          />
          {/* Windows / Desktop view image (frndma windows vie -bg.jpg) */}
          <img
            src="/images/frndma-windows-bg.jpg"
            alt="Frndma Windows View"
            className="w-full h-full object-cover object-center brightness-90 contrast-105 hidden md:block"
          />
          {/* Subtle gradient overlay to ensure crystal clear readability of text and cards */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/75" />
        </div>

        <AgeGateModal />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 pb-20 md:pb-12 relative">{children}</main>
          <BottomNav />
          <WhatsAppSupport variant="float" />
        </div>
      </body>
    </html>
  );
}
