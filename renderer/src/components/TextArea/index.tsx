import { useField } from '@unform/core';
import {
  DetailedHTMLProps,
  LegacyRef,
  FocusEvent,
  TextareaHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './styles.module.scss';

interface TextAreaProps
  extends DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  label: string;
  textAreaRef?: LegacyRef<HTMLTextAreaElement>;
  resize?: boolean;
  name: string;
}

export const TextArea = ({
  label,
  resize = true,
  name,
  onBlur,
  onFocus,
  ...rest
}: TextAreaProps) => {
  const { fieldName, registerField, error } = useField(name);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    registerField<HTMLTextAreaElement>({
      name: fieldName,
      ref: textAreaRef,
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

  const handleFocus = (event: FocusEvent<HTMLTextAreaElement>) => {
    setIsActive(true);

    if (onFocus) {
      onFocus(event);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLTextAreaElement>) => {
    setIsActive(false);

    if (onBlur) {
      onBlur(event);
    }
  };

  return (
    <div className={styles.container}>
      <label className={error ? styles.error : isActive ? styles.active : ''}>
        {label}
        <textarea
          {...rest}
          ref={textAreaRef}
          className={`${styles.textarea} 
          ${resize ? styles.resize : ''}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={300}
        />
      </label>
      {error && <label className={styles.errorLabel}>{error}</label>}
    </div>
  );
};

export default TextArea;
