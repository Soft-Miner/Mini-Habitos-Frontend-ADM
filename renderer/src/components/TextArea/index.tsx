import { DetailedHTMLProps, LegacyRef, TextareaHTMLAttributes } from 'react';
import styles from './styles.module.scss';

interface TextAreaProps
  extends DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  label: string;
  textAreaRef?: LegacyRef<HTMLTextAreaElement>;
  resize?: boolean;
}

const TextArea = ({
  label,
  resize = true,
  textAreaRef,
  ...rest
}: TextAreaProps) => {
  return (
    <div className={styles.container}>
      <p className={styles.label}>{label}</p>
      <textarea
        {...rest}
        ref={textAreaRef}
        className={`${styles.textarea} ${resize ? styles.resize : ''}`}
        maxLength={300}
      />
    </div>
  );
};

export default TextArea;
