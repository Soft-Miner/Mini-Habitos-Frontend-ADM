import React, { useRef, useEffect, useState, CSSProperties } from 'react';
import { useField } from '@unform/core';
import { ReactSVG } from 'react-svg';
import styles from './styles.module.scss';

interface Props {
  name: string;
  initialIcon?: string;
  onFileChange: (file: File | undefined) => void;
  style?: CSSProperties;
}

type InputProps = JSX.IntrinsicElements['input'] & Props;

export default function ImageInput({
  name,
  onFileChange,
  initialIcon,
  style,
  ...rest
}: InputProps) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState(initialIcon || '');
  const [isActive] = useState(false);

  const { fieldName, registerField, defaultValue, error } = useField(name);

  const [preview, setPreview] = useState(defaultValue);

  const handleFileChange = () => {
    const files = inputFileRef.current?.files;

    const hasFiles = !!files && files.length > 0;
    if (hasFiles) {
      const file = (files as FileList).item(0);
      const fileUrl = URL.createObjectURL(file);

      onFileChange(file);
      setImageUrl(fileUrl);
    } else {
      onFileChange(undefined);
      setImageUrl('');
    }
  };

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputFileRef.current,
      path: 'files[0]',
      clearValue(ref: HTMLInputElement) {
        ref.value = '';
        setPreview(null);
      },
      setValue(_: HTMLInputElement, value: string) {
        setPreview(value);
      },
    });
  }, [fieldName, registerField]);

  const handleInputFile = () => {
    inputFileRef.current?.click();
  };

  return (
    <div style={style} className={styles.container}>
      <p className={error ? styles.error : isActive ? styles.active : ''}>
        Ícone
      </p>
      <div
        className={`${styles.iconContainer} ${
          error ? styles.vermelho : imageUrl ? '' : styles.dashed
        }`}
        onClick={handleInputFile}
      >
        {imageUrl ? (
          <img className={styles.icon} src={imageUrl} alt="Icon" />
        ) : (
          <ReactSVG src="/icons/plus.svg" className={styles.plusIcon} />
        )}
        {preview && <img src={preview} alt="Preview" width="100" />}
        <input
          type="file"
          ref={inputFileRef}
          onChange={handleFileChange}
          accept="image/svg+xml"
          {...rest}
        />
      </div>

      {error && <label className={styles.errorLabel}>{error}</label>}
    </div>
  );
}
