import type { Metadata, Viewport } from 'next';
import { Share_Tech_Mono } from 'next/font/google';
import './globals.css';
import { PWAProvider } from '@/components/PWAProvider';

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech-mono',
  display: 'swap',
});

const APP_NAME = 'CNPJ Terminal // CyberLookup Enterprise';
// Meta description otimizada com 139 caracteres (perfeita para Google e redes sociais)
const APP_DESCRIPTION =
  'Consulta de CNPJ ultrarrápida com dados oficiais da Receita Federal, Quadro Societário (QSA), CNAE e Capital em interface Matrix CRT.';
const APP_URL = 'https://eager-fermi.vercel.app';

export const viewport: Viewport = {
  themeColor: '#020B05',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: APP_NAME,
    template: `%s // ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: 'CNPJ Terminal',
  authors: [{ name: 'CyberLookup Security Division' }],
  generator: 'Next.js 14 App Router',
  keywords: [
    'CNPJ Terminal',
    'Consulta Cadastral Corporativa',
    'Consulta CNPJ',
    'Receita Federal',
    'Quadro Societário',
    'QSA',
    'Razão Social',
    'CNAE',
    'Capital Social',
    'CyberLookup',
    'Matrix CRT',
    'Brutalismo Digital',
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CNPJ Terminal',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: ['/icon.svg'],
    apple: [
      { url: '/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: APP_URL,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    siteName: 'CNPJ Terminal CyberLookup',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'CNPJ Terminal // CyberLookup Enterprise Banner Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: ['/og-image.svg'],
    creator: '@cyberlookup',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={shareTechMono.variable}>
      <head>
        <link rel="canonical" href={APP_URL} />
      </head>
      <body className="bg-matrix-black text-matrix-green font-mono antialiased selection:bg-matrix-green selection:text-matrix-black">
        {children}
        <PWAProvider />
      </body>
    </html>
  );
}
