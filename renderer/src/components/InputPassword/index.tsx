import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useState,
  FocusEvent,
  LegacyRef,
} from 'react';
import { ReactSVG } from 'react-svg';
import styles from './styles.module.scss';

interface InputPasswordProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
  inputRef?: LegacyRef<HTMLInputElement>;
}

const InputPassword = ({
  label,
  inputRef,
  onBlur,
  onFocus,
  ...rest
}: InputPasswordProps) => {
  const [isActive, setIsActive] = useState(false);
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);

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

  const toggleVisibility = (event) => {
    event.preventDefault();

    setPasswordIsVisible(!passwordIsVisible);
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
            type={passwordIsVisible ? 'text' : 'password'}
          ></input>

          <ReactSVG
            onMouseDown={toggleVisibility}
            className={styles.icon}
            src={
              passwordIsVisible
                ? '/icons/closedEye.svg'
                : '/icons/openedEye.svg'
            }
          />
        </div>
      </label>
    </div>
  );
};

export default InputPassword;
