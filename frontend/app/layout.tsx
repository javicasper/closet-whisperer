'use client';

import './globals.scss';
import { useState } from 'react';
import { Content } from '@carbon/react';
import ThemeProvider from '@/components/theme/ThemeProvider';
import AppHeader from '@/components/layout/AppHeader';
import AppSideNav from '@/components/layout/AppSideNav';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSideNavExpanded, setIsSideNavExpanded] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>Closet Whisperer - AI-Powered Virtual Closet</title>
        <meta name="description" content="Smart outfit recommendations powered by AI. Manage your wardrobe effortlessly." />
      </head>
      <body>
        <ThemeProvider>
          <AppHeader onMenuClick={() => setIsSideNavExpanded(!isSideNavExpanded)} />
          <AppSideNav isOpen={isSideNavExpanded} />
          <Content style={{ marginTop: '3rem', padding: '2rem' }}>
            {children}
          </Content>
        </ThemeProvider>
      </body>
    </html>
  );
}
