import { useRouter } from 'next/dist/client/router';
import React from 'react';
import Head from '../../components/Head';
import styles from './styles.module.scss';

function Home() {
  const router = useRouter();
  const goToAuth = () => {
    router.push('/authenticate');
  };
  return (
    <div className={styles.container}>
      <Head title="Mini Hábitos" />
      <h1>Home</h1>
      <button onClick={goToAuth}>
        Redirecionar para a página de autenticação
      </button>
    </div>
  );
}

export default Home;
