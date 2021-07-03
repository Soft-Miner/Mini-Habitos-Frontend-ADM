import { useCallback } from 'react';
import Button from '../Button';
import styles from './styles.module.scss';

interface SaveCancelButtonsInterface {
  disabled?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}

const SaveCancelButtons = ({
  disabled,
  onSave,
  onCancel,
}: SaveCancelButtonsInterface) => {
  const handleSaveClick = useCallback(() => {
    if (onSave) {
      onSave();
    }
  }, [onSave]);

  const handleCancelClick = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  return (
    <div className={styles.buttons}>
      <Button
        onClick={handleSaveClick}
        loading={disabled}
        disabled={disabled}
        type="button"
        style={{
          width: '171.5px',
          gridArea: 'saveButton',
          marginBottom: '1rem',
        }}
      >
        Salvar
      </Button>
      <Button
        loading={disabled}
        disabled={disabled}
        onClick={handleCancelClick}
        variant="secondary"
        type="button"
        style={{
          width: '171.5px',
          gridArea: 'cancelButton',
          marginBottom: '1rem',
        }}
      >
        Cancelar
      </Button>
    </div>
  );
};

export default SaveCancelButtons;
