import React, { useRef, useState } from 'react';
import styles from './styles.module.scss';
import Lottie from 'react-lottie';
import logoAnimation from '../../assets/lotties/Logo.json';
import api from '../../services/api';
import { useRouter } from 'next/router';
import Input from '../../components/Input';
import InputPassword from '../../components/InputPassword';
import { setStorage } from '../../utils/storage';

function Home() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputEmailRef = useRef<HTMLInputElement>(null);
  const inputPasswordRef = useRef<HTMLInputElement>(null);

  const handleLogin = () => {
    setLoading(true);
    const email = inputEmailRef.current.value;
    const password = inputPasswordRef.current.value;

    /** @TODO validar com yup */

    api
      .post('/api/super_users/authenticate', {
        email,
        password,
      })
      .then((resposta) => {
        const access_token = resposta.data.access_token;
        const refresh_token = resposta.data.refresh_token;
        setStorage('access_token', access_token);
        setStorage('refresh_token', refresh_token);
        router.push('/home');
      })
      .catch((errorResponse) => {
        const errorMensage = errorResponse.response.status;
        if (errorMensage === 401) {
          setError('Email ou senha incorretos.');
        } else {
          setError('Algo deu errado. Tente mais tarde.');
        }
        setLoading(false);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.animationContainer}>
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: logoAnimation,
            }}
            isClickToPauseDisabled={true}
            speed={0.8}
          />
        </div>

        <h1 className={styles.h1}>Entre para acessar a plataforma</h1>

        <Input
          inputRef={inputEmailRef}
          label="Email"
          placeholder="Email"
          icon="/icons/emailIcon.svg"
        />
        <InputPassword
          inputRef={inputPasswordRef}
          label="Senha"
          placeholder="Senha"
        />

        {error && <span className={styles.error}>{error}</span>}

        <button
          disabled={loading ? true : false}
          className={styles.button}
          onClick={handleLogin}
        >
          {loading ? 'Carregando...' : 'Continuar'}
        </button>
      </div>
    </div>
  );
}

export default Home;
