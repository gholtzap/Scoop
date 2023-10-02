import type { AppProps } from "next/app";
import "leaflet/dist/leaflet.css";
import "../styles/globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { UserProvider } from '../contexts/UserContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Theme appearance="dark">
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </Theme>
  );
}

export default MyApp;
