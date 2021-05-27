import { useField } from '@unform/core';
import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useState,
  FocusEvent,
  LegacyRef,
  CSSProperties,
  useRef,
  useEffect,
} from 'react';
import { ReactSVG } from 'react-svg';
import styles from '../styles.module.scss';

interface InputPasswordProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
  name: string;
  inputRef?: LegacyRef<HTMLInputElement>;
  style?: CSSProperties;
}

export const InputPassword = ({
  label,
  name,
  style,
  onBlur,
  onFocus,
  ...rest
}: InputPasswordProps) => {
  const { fieldName, defaultValue, registerField, error } = useField(name);
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    registerField<HTMLInputElement>({
      name: fieldName,
      ref: inputRef,
      getValue: (ref) => {
        return ref.current.value;
      },
      setValue: (ref, value) => {
        ref.current.value = value;
      },
      clearValue: (ref) => {
        ref.current.value = '';
      },
    });
  }, [fieldName, registerField]);

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
    <div style={style} className={styles.container}>
      <label className={error ? styles.error : isActive ? styles.active : ''}>
        {label}

        <div className={styles.inputContainer}>
          <input
            {...rest}
            defaultValue={defaultValue}
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
      {error && <label className={styles.errorLabel}>{error}</label>}
    </div>
  );
};

export default InputPassword;
