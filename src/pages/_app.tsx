import type { AppProps } from 'next/app';
import 'leaflet/dist/leaflet.css';
import '../styles/globals.css';


function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
