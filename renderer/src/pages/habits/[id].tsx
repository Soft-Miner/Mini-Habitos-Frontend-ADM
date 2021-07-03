import { useRouter } from 'next/dist/client/router';
import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Loading from '../../components/Loading';
import api from '../../services/api';
import { getStorage } from '../../utils/storage';
import styles from './styles.module.scss';
import GoBackArrow from '../../components/GoBackArrow';
import { Form } from '@unform/web';
import { SubmitHandler, FormHandles } from '@unform/core';
import ImageInput from '../../components/InputImageUnform/index';
import { Input } from '../../components/Inputs';
import TextArea from '../../components/TextArea';
import Button from '../../components/Button';
import * as yup from 'yup';
import SaveCancelButtons from '../../components/SaveCancelButtons';

interface Challenge {
  description: string;
  level: string;
  icon: string;
  xp_reward: string;
  id: string;
  changed: boolean;
  new: boolean;
}

interface Habit {
  name: string;
  description: string;
  icon: string;
  challenges: Challenge[];
  changed: boolean;
}

let count = 1;

const EditHabit = () => {
  const [initialHabit, setInitialHabit] = useState<Habit>(null);
  const [habit, setHabit] = useState<Habit>(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingSubmitHabit, setLoadingSubmitHabit] = useState(false);
  const [loadingSubmitChallenges, setLoadingSubmitChallenges] = useState<
    boolean[]
  >([]);
  const [error, setError] = useState('');
  const formHabitRef = useRef<FormHandles>(null);
  const [challengesFormsRefs, setChallengesFormsRefs] = useState<
    React.MutableRefObject<FormHandles>[]
  >([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (habit) {
      const challenges = habit.challenges.length;

      setChallengesFormsRefs((previous) =>
        Array.from(Array(challenges).keys()).map(
          (_, index) => previous[index] || createRef<FormHandles>()
        )
      );
    }
  }, [habit]);

  useEffect(() => {
    const access_token = getStorage('access_token');

    if (id) {
      api
        .get(`/api/habits/${id}`, {
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        })
        .then((response) => {
          const challenges = response.data.challenges.map(
            (currentChallenge: Challenge) => ({
              description: currentChallenge.description,
              level: currentChallenge.level,
              icon: currentChallenge.icon,
              xp_reward: currentChallenge.xp_reward,
              id: currentChallenge.id,
            })
          );
          setHabit({ ...response.data, challenges });
          setInitialHabit(response.data);
          setLoadingSubmitChallenges(
            Array.from(Array(response.data.challenges.length).keys()).map(
              () => false
            )
          );
        })
        .catch((error) => {
          setError(error.response.data.message);
        })
        .finally(() => {
          setLoadingPage(false);
        });
    }
  }, [id]);

  const addChallenge = useCallback(() => {
    const newChallenge: Challenge = {
      id: (count++).toString(),
      description: '',
      icon: '',
      changed: true,
      level: '',
      new: true,
      xp_reward: '',
    };

    setHabit((previous) => ({
      ...previous,
      challenges: [...previous.challenges, newChallenge],
    }));
  }, []);

  const handleHabitSubmit: SubmitHandler<Habit> = useCallback(
    async (dataToSubmit) => {
      setError('');
      formHabitRef.current.setErrors({});

      const schema = yup.object().shape({
        name: yup.string().required(),
        description: yup.string().required(),
        icon: yup.string().required(),
      });

      try {
        await schema.validate(
          { ...dataToSubmit, icon: habit.icon },
          { abortEarly: false }
        );
      } catch (error) {
        const validationErrors = {};

        if (error instanceof yup.ValidationError) {
          error.inner.forEach((currentError) => {
            validationErrors[currentError.path] = currentError.message;
          });
          formHabitRef.current.setErrors(validationErrors);
        }
        return;
      }

      setLoadingSubmitHabit(true);

      const { description, name, icon } = dataToSubmit;
      const data = new FormData();
      data.append('name', name);
      data.append('description', description);
      data.append('icon', icon);

      const access_token = getStorage('access_token');

      api
        .put(`/api/habits/${id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            authorization: `Bearer ${access_token}`,
          },
        })
        .then((response) => {
          const editedHabit = response.data.habit;

          setInitialHabit((previous) => ({
            ...previous,
            name: editedHabit.name,
            description: editedHabit.description,
            icon: editedHabit.icon,
          }));
          setHabit((previous) => ({
            ...previous,
            name: editedHabit.name,
            description: editedHabit.description,
            icon: editedHabit.icon,
            changed: false,
          }));

          console.log(response.data.message);
        })
        .catch((error) => {
          setError(error.response.data.message);
        })
        .finally(() => {
          setLoadingSubmitHabit(false);
        });
    },
    [habit, id]
  );

  const handleEditChallengeSubmit = useCallback(
    async (dataToSubmit: Challenge, indexToEdit: number, updating = true) => {
      const netLoadingSubmitChallenges = [...loadingSubmitChallenges];

      setError('');

      const formRef = challengesFormsRefs[indexToEdit];

      formRef.current.setErrors({});

      const schema = yup.object().shape({
        description: yup.string().required(),
        icon: yup.string().required(),
        level: yup.string().required(),
        xp_reward: yup.string().required(),
      });

      try {
        await schema.validate(
          { ...dataToSubmit, icon: habit.challenges[indexToEdit].icon },
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
        return;
      }

      netLoadingSubmitChallenges[indexToEdit] = true;
      setLoadingSubmitChallenges(netLoadingSubmitChallenges);

      const access_token = getStorage('access_token');

      if (updating) {
        const { description, icon, id: challengeId } = dataToSubmit;
        const data = new FormData();
        data.append('description', description);
        data.append('icon', icon);

        api
          .put(`/api/challenges/${challengeId}`, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
              authorization: `Bearer ${access_token}`,
            },
          })
          .then((response) => {
            const challengeUpdated = response.data.challenge;

            const habitChallengesUpdated = [...habit.challenges];
            const initialHabitChallengesUpdated = [...initialHabit.challenges];

            habitChallengesUpdated[indexToEdit] = challengeUpdated;
            initialHabitChallengesUpdated[indexToEdit] = challengeUpdated;

            setHabit((previous) => ({
              ...previous,
              challenges: habitChallengesUpdated,
            }));
            setInitialHabit((previous) => ({
              ...previous,
              challenges: initialHabitChallengesUpdated,
            }));

            console.log(response.data.message);
          })
          .catch((error) => {
            setError(error.response.data.message);
          })
          .finally(() => {
            netLoadingSubmitChallenges[indexToEdit] = false;
            setLoadingSubmitChallenges(netLoadingSubmitChallenges);
          });
      } else {
        const { level, xp_reward, description, icon } = dataToSubmit;

        const data = new FormData();
        data.append('description', description);
        data.append('icon', icon);
        data.append('level', level);
        data.append('xp_reward', xp_reward);

        api
          .post(`/api/habits/${id}/challenges`, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
              authorization: `Bearer ${access_token}`,
            },
          })
          .then((response) => {
            const newChallenge = response.data.challenge;

            const habitChallengesUpdated = [...habit.challenges];
            const initialHabitChallengesUpdated = [
              ...initialHabit.challenges,
              newChallenge,
            ];

            habitChallengesUpdated[indexToEdit] = newChallenge;

            setHabit((previous) => ({
              ...previous,
              challenges: habitChallengesUpdated,
            }));
            setInitialHabit((previous) => ({
              ...previous,
              challenges: initialHabitChallengesUpdated,
            }));

            console.log(response.data.message);
          })
          .catch((error) => {
            setError(error.response.data.message);
          })
          .finally(() => {
            netLoadingSubmitChallenges[indexToEdit] = false;
            setLoadingSubmitChallenges(netLoadingSubmitChallenges);
          });
      }
    },
    [challengesFormsRefs, habit, id, initialHabit, loadingSubmitChallenges]
  );

  const handleCancelHabitChanges = useCallback(() => {
    const { name, description, icon } = initialHabit;

    setHabit((previous) => ({
      ...previous,
      name,
      description,
      icon,
      changed: false,
    }));
  }, [initialHabit]);

  const handleCancelChallengeChanges = useCallback(
    (index: number, remove: boolean) => {
      const { challenges } = habit;

      const challengesUpdated = [...challenges];

      if (remove) {
        challengesUpdated.splice(index, 1);
      } else {
        const { challenges: initialChallenges } = initialHabit;
        const challengeUpdated = challengesUpdated[index];

        const initialChallenge = initialChallenges[index];

        challengeUpdated.changed = false;
        challengeUpdated.icon = initialChallenge.icon;
        challengeUpdated.description = initialChallenge.description;
        challengeUpdated.level = initialChallenge.level;
        challengeUpdated.xp_reward = initialChallenge.xp_reward;
      }

      setHabit((previous) => ({
        ...previous,
        challenges: challengesUpdated,
      }));
    },
    [habit, initialHabit]
  );

  if (loadingPage) return <Loading />;

  if (!habit || error)
    return <>{error && <p className={styles.error}>{error}</p>}</>;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Edite as informações deste mini-hábito</h1>

        <Form ref={formHabitRef} onSubmit={handleHabitSubmit}>
          <ImageInput
            onFileChange={(newIcon) => {
              if (newIcon) {
                const newIconUrl = URL.createObjectURL(newIcon);

                setHabit((previous) => ({
                  ...previous,
                  icon: newIconUrl,
                  changed: true,
                }));
              } else {
                setHabit((previous) => ({
                  ...previous,
                  icon: null,
                  changed: true,
                }));
              }
            }}
            icon={habit.icon}
            style={{ alignItems: 'center', marginBottom: '1rem' }}
            name="icon"
          />

          <Input
            onChange={(event) => {
              const newValue = event.target.value;
              setHabit((previous) => ({
                ...previous,
                name: newValue,
                changed: true,
              }));
            }}
            value={habit.name}
            name="name"
            label="Nome"
            placeholder="Nome"
            style={{ marginBottom: '1rem' }}
          />

          <div className={styles.textAreaHabitContainer}>
            <TextArea
              onChange={(event) => {
                const newValue = event.target.value;
                setHabit((previous) => ({
                  ...previous,
                  description: newValue,
                  changed: true,
                }));
              }}
              value={habit.description}
              name="description"
              style={{ height: '8.5625rem' }}
              placeholder="Descrição..."
              label="Descrição"
            ></TextArea>
          </div>

          {habit.changed && (
            <SaveCancelButtons
              onSave={() => formHabitRef.current.submitForm()}
              onCancel={handleCancelHabitChanges}
              disabled={loadingSubmitHabit}
            />
          )}
        </Form>

        <h2 className={styles.challengesTitle}>Desafios</h2>

        {habit.challenges.map((challenge, index) => (
          <Form
            ref={challengesFormsRefs[index]}
            key={index}
            onSubmit={(data) =>
              handleEditChallengeSubmit(
                { ...data, id: challenge.id },
                index,
                !challenge.new
              )
            }
          >
            <div className={styles.fixedChallenge}>
              <Input
                name="level"
                label="Level"
                onChange={(event) => {
                  const challengesUpdated = [...habit.challenges];
                  challengesUpdated[index].changed = true;

                  challengesUpdated[index].level = event.target.value;

                  setHabit((previous) => ({
                    ...previous,
                    challenges: challengesUpdated,
                  }));
                }}
                disabled={!challenge.new}
                value={challenge.level}
                placeholder="0"
                style={{
                  gridArea: 'inputLevel',
                }}
              />
              <ImageInput
                name="icon"
                onFileChange={(newIcon) => {
                  const challengesUpdated = [...habit.challenges];
                  challengesUpdated[index].changed = true;

                  challengesUpdated[index].icon = newIcon
                    ? URL.createObjectURL(newIcon)
                    : null;

                  setHabit((previous) => ({
                    ...previous,
                    challenges: challengesUpdated,
                  }));
                }}
                icon={challenge.icon}
                initialIcon={challenge.icon}
                style={{
                  alignItems: 'center',
                  gridArea: 'inputFile',
                }}
              />
              <Input
                name="xp_reward"
                onChange={(event) => {
                  const challengesUpdated = [...habit.challenges];
                  challengesUpdated[index].changed = true;

                  challengesUpdated[index].xp_reward = event.target.value;

                  setHabit((previous) => ({
                    ...previous,
                    challenges: challengesUpdated,
                  }));
                }}
                label="XP Reward"
                disabled={!challenge.new}
                value={challenge.xp_reward}
                placeholder="0"
                style={{
                  gridArea: 'inputXp',
                }}
              />
              <TextArea
                name="description"
                value={challenge.description}
                onChange={(event) => {
                  const challengesUpdated = [...habit.challenges];
                  challengesUpdated[index].changed = true;
                  challengesUpdated[index].description = event.target.value;

                  setHabit((previous) => ({
                    ...previous,
                    challenges: challengesUpdated,
                  }));
                }}
                style={{
                  gridArea: 'inputDescr',
                  height: '10.75rem',
                }}
                placeholder="Descrição..."
                label="Descrição"
              ></TextArea>
            </div>
            {challenge.changed && (
              <SaveCancelButtons
                onSave={() => challengesFormsRefs[index].current.submitForm()}
                onCancel={() =>
                  handleCancelChallengeChanges(index, challenge.new)
                }
                disabled={loadingSubmitChallenges[index]}
              />
            )}
          </Form>
        ))}

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
          + Adicionar desafio
        </Button>
      </div>
      <GoBackArrow />
    </div>
  );
};

export default EditHabit;
