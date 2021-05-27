import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import ButtonLoading from './ButtonLoading';
import styles from './styles.module.scss';

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

const Button = ({
  children,
  variant = 'primary',
  loading = false,
  ...rest
}: ButtonProps) => {
  return (
    <button
      {...rest}
      className={`${styles.button} ${
        variant === 'primary' ? styles.primary : styles.secondary
      }`}
    >
      {loading ? <ButtonLoading variant={variant} /> : children}
    </button>
  );
};

export default Button;
