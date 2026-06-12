import './globals.css'

export const metadata = {
  title: 'Notaires de France - Espace Sécurisé',
  description: 'Espace sécurisé Notaires de France',
  icons: {
    icon: 'https://etude-laidet.notaires.fr/wp-content/uploads/2018/07/logo-notaire-removebg-preview.webp',
    shortcut: 'https://etude-laidet.notaires.fr/wp-content/uploads/2018/07/logo-notaire-removebg-preview.webp',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
