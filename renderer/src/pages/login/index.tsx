import React, { useRef, useState } from 'react';
import styles from './styles.module.scss';
import Lottie from 'react-lottie';
import logoAnimation from '../../assets/lotties/Logo.json';
import api from '../../services/api';
import { useRouter } from 'next/router';
import { Input, InputPassword } from '../../components/Inputs';
import { setStorage } from '../../utils/storage';
import Button from '../../components/Button';
import { Form } from '@unform/web';
import * as yup from 'yup';

interface FormData {
  password: string;
  email: string;
}

function Home() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  const router = useRouter();

  const handleSubmit = async ({ email, password }: FormData) => {
    setLoading(true);
    setError('');
    formRef.current.setErrors({});

    const schema = yup.object().shape({
      email: yup
        .string()
        .email('Email precisa ser um email válido.')
        .required('Email é obrigatório.'),
      password: yup.string().required('Senha é obrigatória.'),
    });

    try {
      await schema.validate(
        { email, password },
        {
          abortEarly: false,
        }
      );
    } catch (error) {
      const validationErrors = {};

      if (error instanceof yup.ValidationError) {
        error.inner.forEach((currentError) => {
          validationErrors[currentError.path] = currentError.message;
        });
        formRef.current.setErrors(validationErrors);
      }

      setLoading(false);
      return;
    }

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
          />
        </div>

        <h1 className={styles.h1}>Entre para acessar a plataforma</h1>

        <Form ref={formRef} onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Input
            name="email"
            label="Email"
            placeholder="Email"
            icon="/icons/emailIcon.svg"
            style={{ marginBottom: '1rem' }}
          />
          <InputPassword
            name="password"
            label="Senha"
            placeholder="Senha"
            style={{ marginBottom: '1rem' }}
          />

          {error && <p className={styles.error}>{error}</p>}

          <Button
            variant="primary"
            loading={loading}
            disabled={loading}
            style={{ marginTop: '1rem' }}
          >
            Entrar
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Home;
