import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Video Generation Agent',
  description: 'Generate and upload videos to TikTok and YouTube',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
