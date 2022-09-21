import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css';

import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

import type { AppProps } from 'next/app'
import Head from 'next/head'
import Navigation from '../components/NavigationComponent';



function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <title>Covvizzes</title>
      <meta name="description" content="covid-19 visualized" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Navigation />
    <Component {...pageProps} />
  </>
}

export default MyApp
