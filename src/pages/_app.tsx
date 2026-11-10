import Axios from 'axios';
import Head from 'next/head';
import '@/styles/globals.css';
import '@/styles/globals.scss';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from "next/app";
import { SessionProvider } from 'next-auth/react';
import CMS_Layout from '@/components/layouts/CMS_Layout';
import { AppProvider } from '@/components/layouts/context/AppProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL
  const getLayout = Component.getLayout ?? ((page: ReactElement) => <CMS_Layout>{page}</CMS_Layout>)
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={pageProps.session}>
        <Head>
            <title>TaxHelp - Books of Accounts & DAT File System</title>
            <meta name="description" content="Created by JP VASQUEZ" />
            <link rel="icon" href="/images/favicon.png" sizes="32x32" type='image/png' />
            <meta
                property="og:image"
                content="/images/taxhelp_image3_.JPG"
            />
            <meta
                property="og:image:width"
                content="500"
            />
            <meta
                property="og:image:height"
                content="200"
            />
            <meta
                property="og:image:type"
                content="image/jpg"
            />
            <meta content="Tax made simple. Compliance made easy | TaxHelp" property="og:title"></meta>
        </Head>
        <AppProvider>
          {
            pageProps.session?.user ?
            getLayout(<Component {...pageProps} />)
            :
            <Component {...pageProps} />
          }
        </AppProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
