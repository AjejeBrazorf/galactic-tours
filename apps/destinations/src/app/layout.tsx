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
      <body>{children}</body>
    </html>
  )
}
