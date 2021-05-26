import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useState,
  FocusEvent,
  LegacyRef,
} from 'react';
import { ReactSVG } from 'react-svg';
import styles from './styles.module.scss';

interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
  icon: string;
  inputRef?: LegacyRef<HTMLInputElement>;
}

const Input = ({
  label,
  icon,
  inputRef,
  onBlur,
  onFocus,
  ...rest
}: InputProps) => {
  const [isActive, setIsActive] = useState(false);

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    setIsActive(true);

    if (onFocus) {
      onFocus(event);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setIsActive(false);

    if (onBlur) {
      onBlur(event);
    }
  };

  return (
    <div className={styles.container}>
      <label className={isActive ? styles.active : ''}>
        {label}

        <div className={styles.inputContainer}>
          <input
            {...rest}
            ref={inputRef}
            className={styles.input}
            onFocus={handleFocus}
            onBlur={handleBlur}
          ></input>

          <ReactSVG className={styles.icon} src={icon} />
        </div>
      </label>
    </div>
  );
};

export default Input;
