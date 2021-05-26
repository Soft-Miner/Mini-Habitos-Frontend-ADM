import { useRouter } from 'next/router';

const EditHabit = () => {
  const router = useRouter();
  const { id } = router.query;
  const goBack = () => {
    router.push('/home');
  };

  return (
    <div>
      <h1>Editando o hábito {id}</h1>
      <button onClick={goBack}>Voltar</button>
    </div>
  );
};

export default EditHabit;
