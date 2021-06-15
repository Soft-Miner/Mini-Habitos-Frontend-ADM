import Button from '../../components/Button';
import { Input } from '../../components/Inputs';
import TextArea from '../../components/TextArea';
import styles from './styles.module.scss';
import { Form } from '@unform/web';
import { useRef, useState } from 'react';
import { ReactSVG } from 'react-svg';
import * as yup from 'yup';
import ImageInput from '../../components/InputImageUnform/index';
import api from '../../services/api';
import { getStorage } from '../../utils/storage/getStorage';
import { useRouter } from 'next/router';

interface Challenge {
  description: string;
  level: string;
  icon: File;
  xp_reward: string;
}

interface Habit {
  name: string;
  description: string;
  icon: File;
  challenges: Challenge[];
}

let count = 1;
const NewHabit = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef(null);
  const router = useRouter();

  const addChallenge = () => {
    const newArray = [...challenges];
    newArray.push({ id: count });
    setChallenges(newArray);
    count++;
  };

  const deleteChallenge = (id: number) => {
    const arrayToDelet = [...challenges];
    let indexToRemove: number;
    for (let i = 0; i < arrayToDelet.length; i++) {
      if (arrayToDelet[i].id === id) {
        indexToRemove = i;
      }
    }
    arrayToDelet.splice(indexToRemove, 1);
    setChallenges(arrayToDelet);
  };

  const handleSubmit = async ({
    name,
    description,
    icon,
    challenges,
  }: Habit) => {
    setLoading(true);
    setError('');
    formRef.current.setErrors({});

    const schema = yup.object().shape({
      name: yup.string().required('Nome é necessário.'),
      description: yup.string().required('Descrição é necessário.'),
      icon: yup.mixed().required('Ícone é necessário.'),
      challenges: yup.array().of(
        yup.object().shape({
          description: yup.string().required('Descrição é necessário.'),
          level: yup.string().required('Level é necessário.'),
          xp_reward: yup.string().required('XP Reward é necessário.'),
          icon: yup.mixed().required('Ícone é necessário.'),
        })
      ),
    });

    try {
      await schema.validate(
        {
          name,
          description,
          icon,
          challenges,
        },
        { abortEarly: false }
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

    const challengesWithoutIcon = challenges.map(
      ({ description, level, xp_reward }) => {
        return {
          description,
          level: Number(level),
          xp_reward: Number(xp_reward),
        };
      }
    );

    const data = new FormData();
    data.append('name', name);
    data.append('description', description);
    data.append('challenges', JSON.stringify(challengesWithoutIcon));
    data.append('icon', icon);
    challenges.forEach((challenge) => {
      data.append('challengesIcons', challenge.icon);
    });

    const access_token = getStorage('access_token');

    api
      .post('/api/habits/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${access_token}`,
        },
      })
      .then(() => {
        router.push('/habit-registered');
      })
      .catch((error) => {
        const errorMessage = error.response.data.message;
        setError(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Cadastre um novo mini-hábito</h1>

        <Form ref={formRef} onSubmit={handleSubmit}>
          <ImageInput
            name="icon"
            onFileChange={(file) => {
              file;
            }}
          />

          <Input
            name="name"
            label="Nome"
            placeholder="Nome"
            style={{ marginBottom: '2rem' }}
          />

          <TextArea
            name="description"
            style={{ height: '8.5625rem' }}
            placeholder="Descrição..."
            label="Descrição"
          ></TextArea>

          <h1 className={styles.desafio}>Desafios</h1>

          <div className={styles.fixedChallenge}>
            <Input
              name="challenges[0].level"
              disabled={true}
              value="0"
              label="Level"
              placeholder="0"
              style={{
                gridArea: 'inputLevel',
              }}
            />
            <ImageInput
              name="challenges[0].icon"
              style={{
                alignItems: 'center',
                gridArea: 'inputFile',
              }}
              onFileChange={(file) => {
                file;
              }}
            />
            <Input
              name="challenges[0].xp_reward"
              label="XP Reward"
              placeholder="0"
              style={{
                gridArea: 'inputXp',
              }}
            />
            <TextArea
              name="challenges[0].description"
              style={{ gridArea: 'inputDescr', height: '10.75rem' }}
              placeholder="Descrição..."
              label="Descrição"
            ></TextArea>
          </div>

          {challenges.map((challenge, index) => (
            <div className={styles.containerChallenge} key={challenge.id}>
              <div className={styles.challengesCards}>
                <Input
                  name={`challenges[${index + 1}].level`}
                  label="Level"
                  placeholder="0"
                  style={{
                    gridArea: 'inputLevel',
                  }}
                />
                <ImageInput
                  name={`challenges[${index + 1}].icon`}
                  style={{
                    alignItems: 'center',
                    gridArea: 'inputFile',
                  }}
                  onFileChange={(file) => {
                    file;
                  }}
                />
                <Input
                  name={`challenges[${index + 1}].xp_reward`}
                  label="XP Reward"
                  placeholder="0"
                  style={{
                    gridArea: 'inputXp',
                  }}
                />
                <TextArea
                  name={`challenges[${index + 1}].description`}
                  style={{ gridArea: 'inputDescr', height: '10.75rem' }}
                  placeholder="Descrição..."
                  label="Descrição"
                ></TextArea>
              </div>

              <ReactSVG
                onClick={() => deleteChallenge(challenge.id)}
                className={styles.icon}
                src={'icons/trash_can.svg'}
              />
            </div>
          ))}

          {error && <p className={styles.error}>{error}</p>}

          <Button
            type="button"
            onClick={addChallenge}
            style={{
              alignSelf: 'center',
              width: '22.4375rem',
              marginTop: '1.375rem',
            }}
            variant={'secondary'}
          >
            + Adcionar desafio
          </Button>

          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            style={{
              alignSelf: 'center',
              marginTop: '1.75rem',
              width: '22.5rem',
              height: '34px',
              marginBottom: '2.125rem',
            }}
          >
            Cadastrar
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default NewHabit;
