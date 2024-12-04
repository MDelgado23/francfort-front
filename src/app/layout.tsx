"use client";
import { ReactNode } from 'react';
import './globals.css';
import { Header } from './components/Header/Header';
import { I18nextProvider } from 'react-i18next';
import i18n from './services/i18n';


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <I18nextProvider i18n={i18n}>
          <Header />
          {children}
        </I18nextProvider>
      </body>
    </html>
  );
}
