import { useRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import Button from '../../components/Button';
import HabitCard from '../../components/HabitCard';
import Loading from '../../components/Loading';
import api from '../../services/api';
import { getStorage, removeStorage } from '../../utils/storage';
import styles from './styles.module.scss';

interface Habit {
  id: string;
  name: string;
  icon: string;
}

function Home() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const logout = () => {
    removeStorage('access_token');
    removeStorage('refresh_token');
    router.push('/login');
  };

  const editHabit = (id: string) => {
    router.push(`/habits/${id}`);
  };

  const goToCreateHabit = () => {
    router.push(`/new-habit`);
  };

  useEffect(() => {
    const access_token = getStorage('access_token');

    api
      .get('/api/habits', {
        headers: {
          authorization: `Bearer ${access_token}`,
        },
      })
      .then((response) => {
        setHabits(response.data);
      })
      .catch((error) => {
        setError(error.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;

  return (
    <div className={styles.container}>
      <h1>Estes são todos os mini-hábitos</h1>

      {error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <div className={styles.allCards}>
          {habits.map((habit) => (
            <HabitCard
              onClick={() => editHabit(habit.id)}
              key={habit.id}
              name={habit.name}
              icon={habit.icon}
            />
          ))}
        </div>
      )}
      <Button
        onClick={goToCreateHabit}
        variant="secondary"
        style={{
          marginTop: '4rem',
          whiteSpace: 'nowrap',
          width: 'min-content',
        }}
      >
        + Adicionar Mini-hábito
      </Button>

      <div onClick={logout} className={styles.logoutContainer}>
        <ReactSVG src={'/icons/logout.svg'} />
        <p className={styles.logout}>Sair</p>
      </div>
    </div>
  );
}

export default Home;
