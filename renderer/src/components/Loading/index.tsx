import styles from './styles.module.scss';
import Lottie from 'react-lottie';
import logoAnimation from '../../assets/lotties/Logo.json';

const Loading = () => {
  return (
    <div className={styles.container}>
      <div className={styles.animationContainer}>
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: logoAnimation,
          }}
          isClickToPauseDisabled={true}
          speed={2.5}
        />
      </div>
    </div>
  );
};

export default Loading;
