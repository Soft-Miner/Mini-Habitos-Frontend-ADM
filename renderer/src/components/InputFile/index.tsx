import { useRef, useState } from 'react';
import styles from './styles.module.scss';
import { ReactSVG } from 'react-svg';

interface InputFileProps {
  initialIcon?: string;
  onFileChange: (file: File | undefined) => void;
}

const InputFile = ({ onFileChange, initialIcon }: InputFileProps) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState(initialIcon || '');

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

  const handleInputFile = () => {
    inputFileRef.current?.click();
  };

  return (
    <div className={styles.container}>
      <p>Ícone</p>
      <div
        className={`${styles.iconContainer} ${imageUrl ? '' : styles.dashed}`}
        onClick={handleInputFile}
      >
        {imageUrl ? (
          <img className={styles.icon} src={imageUrl} alt="Icon" />
        ) : (
          <ReactSVG src="/icons/plus.svg" className={styles.plusIcon} />
        )}

        <input
          ref={inputFileRef}
          onChange={handleFileChange}
          accept="image/svg+xml"
          type="file"
        />
      </div>
    </div>
  );
};

export default InputFile;
