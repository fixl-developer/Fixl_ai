import type {Metadata} from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const interDisplay = Inter({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FixIAI | Custom AI Integration & Development',
  description: 'Custom AI systems, secure vector databases, and multi-step automated workflows built natively for your infrastructure.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${interDisplay.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-blue-500/30 selection:text-blue-200" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
