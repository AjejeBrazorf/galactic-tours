import dynamic from 'next/dynamic'

const Map = dynamic(
  () => import('@/components/Map/Map').then((mod) => mod.default),
  { ssr: false }
)

export default function Home() {
  return (
    <main>
      <Map />
    </main>
  )
}
