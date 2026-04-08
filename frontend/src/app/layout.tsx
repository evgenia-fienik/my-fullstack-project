import type { Metadata } from 'next';
import { Nunito_Sans, Sora } from 'next/font/google';
import Providers from './providers';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer'
import './globals.css';

const nunitoSans = Nunito_Sans({
  variable: '--font-nunito-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const sora = Sora({
  variable: '--font-sora',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'My Fullstack Project',
  description: 'My Fullstack Project',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunitoSans.variable} ${sora.variable}`}>
        <Providers>

         <div className="page">
            <Header />
            <main className="main">{children}</main>
            <Footer />
          </div>
        </Providers>
       
      </body>
    </html>
  );
}
