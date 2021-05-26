import { ReactSVG } from 'react-svg';
import styles from './styles.module.scss';

interface HabitCardProps {
  name: string;
  icon: string;
  onClick?: () => void;
}

const HabitCard = ({ name, icon, onClick }: HabitCardProps) => {
  return (
    <div onClick={onClick} className={styles.container}>
      <img width="64" height="64" src={icon} />
      <p>{name}</p>
      <img src={'/icons/edit.svg'} />
    </div>
  );
};

export default HabitCard;
