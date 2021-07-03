import styles from './styles.module.scss';
import { ReactSVG } from 'react-svg';
import { useRouter } from 'next/router';

const GoBackArrow = () => {
  const router = useRouter();

  const goBack = () => {
    router.push('/home');
  };

  return (
    <div onClick={goBack} className={styles.logoutContainer}>
      <ReactSVG src={'/icons/arrow_back.svg'} />
    </div>
  );
};

export default GoBackArrow;
