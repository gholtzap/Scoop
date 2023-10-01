import type { AppProps } from "next/app";
import "leaflet/dist/leaflet.css";
import "../styles/globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Theme appearance="dark">
      <Component {...pageProps} />
    </Theme>
  );
}

export default MyApp;
