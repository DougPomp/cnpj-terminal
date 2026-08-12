import type { Metadata } from 'next';
import { Share_Tech_Mono } from 'next/font/google';
import './globals.css';

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CNPJ Terminal // CyberLookup Enterprise',
  description: 'Plataforma brutalista de consulta cadastral corporativa (CNPJ) com interface retro-futurista CRT Matrix.',
  keywords: ['CNPJ', 'Consulta Empresarial', 'Receita Federal', 'CyberLookup', 'Matrix Terminal', 'Brutalismo Digital'],
  authors: [{ name: 'CyberLookup Security Division' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={shareTechMono.variable}>
      <body className="bg-matrix-black text-matrix-green font-mono antialiased selection:bg-matrix-green selection:text-matrix-black">
        {children}
      </body>
    </html>
  );
}
