export const metadata = {
  title: 'Galactic Destinations',
  description: 'Explore galactic destinations in a 3D map',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body style={{ margin: 0, padding: 0, height: '100vh' }}>{children}</body>
    </html>
  )
}
