import type { AppProps } from 'next/app';
import Head from '../components/Head';
import '../styles/global.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head title="Mini Hábitos" />

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
