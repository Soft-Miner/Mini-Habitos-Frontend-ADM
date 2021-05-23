import React from 'react';
import Head from '../../components/Head';
import styles from './styles.module.scss';
import Lottie from 'react-lottie';
import logoAnimation from '../../assets/lotties/Logo.json';
import Link from 'next/link';

function Home() {
  return (
    <div className={styles.container}>
      <h1>Página para autenticar</h1>
      <Head title="Mini Hábitos" />
      <div className={styles.animationContainer}>
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: logoAnimation,
          }}
          isClickToPauseDisabled={true}
        />
      </div>
      <Link href="/home">
        <button>Voltar para a página Home</button>
      </Link>
    </div>
  );
}

export default Home;
