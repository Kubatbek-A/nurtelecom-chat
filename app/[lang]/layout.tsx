import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

import '@/app/[lang]/globals.css'
import { cn } from '@/lib/utils'
import { Providers } from '@/components/providers'
import { Header } from '@/components/header'
import { Toaster } from '@/components/ui/sonner'
import { i18n } from '@/i18n.config'
import { LanguageProvider } from '@/contexts/LanguageContext'

export const metadata = {
  metadataBase: process.env.VERCEL_URL
    ? new URL(`https://${process.env.VERCEL_URL}`)
    : undefined,
  title: {
    default: 'O! AI Chatbot',
    template: `%s - AI Chatbot`
  },
  description: 'An AI-powered chatbot.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  }
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}

export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }))
}

interface RootLayoutProps {
  children: React.ReactNode
  params: { lang: string }
}

export default function RootLayout({
  children,
  params: { lang }
}: RootLayoutProps) {
  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={cn(
          'font-sans antialiased',
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <LanguageProvider initialLang={lang}>
          <Toaster position="top-center" />
          <Providers
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex flex-col flex-1 bg-muted/50">
                {children}
              </main>
            </div>
          </Providers>
        </LanguageProvider>
      </body>
    </html>
  )
}
