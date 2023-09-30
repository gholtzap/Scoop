import Head from 'next/head';
import dynamic from 'next/dynamic';


const DynamicMapComponent = dynamic(
    () => import('../components/MapComponent'),
    {
      ssr: false,
      loading: () => <p>Loading map...</p>
    }
  );

export default function Home() {
  return (
    <div>
      <Head>
        <title>Interactive Map</title>
      </Head>

      <main>
        <DynamicMapComponent />
      </main>
    </div>
  );
}
