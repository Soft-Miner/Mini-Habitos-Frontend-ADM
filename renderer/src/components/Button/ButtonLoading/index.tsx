import styles from './styles.module.scss';

interface ButtonLoadingProps {
  variant?: 'primary' | 'secondary';
}

const ButtonLoading = ({ variant = 'primary' }: ButtonLoadingProps) => {
  return (
    <div
      className={`${styles.ring} ${
        variant === 'primary' ? styles.primary : styles.secondary
      }`}
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default ButtonLoading;
