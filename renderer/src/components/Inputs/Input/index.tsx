import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useState,
  FocusEvent,
  CSSProperties,
  useRef,
  useEffect,
} from 'react';
import { ReactSVG } from 'react-svg';
import { useField } from '@unform/core';
import styles from '../styles.module.scss';

interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
  name: string;
  icon?: string;
  style?: CSSProperties;
}

export const Input = ({
  label,
  name,
  icon,
  style,
  onBlur,
  onFocus,
  ...rest
}: InputProps) => {
  const { fieldName, defaultValue, registerField, error } = useField(name);
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

  return (
    <div style={style} className={styles.container}>
      <label className={error ? styles.error : isActive ? styles.active : ''}>
        {label}

        <div className={styles.inputContainer}>
          <input
            defaultValue={defaultValue}
            ref={inputRef}
            className={styles.input}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...rest}
          ></input>

          {icon && <ReactSVG className={styles.icon} src={icon} />}
        </div>
      </label>
      {error && <label className={styles.errorLabel}>{error}</label>}
    </div>
  );
};
