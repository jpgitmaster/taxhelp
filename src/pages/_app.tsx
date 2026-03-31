import Axios from 'axios';
import Head from 'next/head';
import '@/styles/globals.css';
import '@/styles/globals.scss';
import type { AppProps } from "next/app";
import { SessionProvider } from 'next-auth/react';
import CMS_Layout from '@/components/layouts/CMS_Layout';
import { AppProvider } from '@/components/layouts/context/AppProvider';

export default function App({ Component, pageProps }: AppProps) {
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL
  return (
    <SessionProvider session={pageProps.session}>
      <Head>
          <title>TaxHelp - Books of Accounts & DAT File System</title>
          <meta name="description" content="Created by JP VASQUEZ" />
          <link rel="icon" href="/svgs/icon.png" sizes="32x32" type='image/png' />
      </Head>
      <AppProvider>
        {
          pageProps.session?.user ?
          <CMS_Layout>
            <Component {...pageProps} />
          </CMS_Layout>
          :
          <Component {...pageProps} />
        }
      </AppProvider>
    </SessionProvider>
  );
}
