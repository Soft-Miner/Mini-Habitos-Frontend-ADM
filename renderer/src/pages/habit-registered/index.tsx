import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styles from './styles.module.scss';

const HabitResgistered = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push('/home');
    }, 1000);
  }, [router]);

  return (
    <div className={styles.container}>
      <h1>Mini-hábito cadastrado!</h1>
    </div>
  );
};

export default HabitResgistered;
