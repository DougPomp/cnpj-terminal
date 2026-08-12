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
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: ['/icon.png'],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
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
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'CNPJ Terminal // CyberLookup Enterprise Banner Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [`${APP_URL}/og-image.png`],
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
        <meta property="og:image:secure_url" content={`${APP_URL}/og-image.png`} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </head>
      <body className="bg-matrix-black text-matrix-green font-mono antialiased selection:bg-matrix-green selection:text-matrix-black">
        {children}
        <PWAProvider />
      </body>
    </html>
  );
}
