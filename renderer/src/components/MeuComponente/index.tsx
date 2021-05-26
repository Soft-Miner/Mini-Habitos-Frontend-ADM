interface MeuComponente {
  children: JSX.Element;
  aa: string;
}

const MeuComponente = ({ children, aa }: MeuComponente) => {
  return (
    <div>
      <h1>{aa}</h1>
      <button>{children}</button>
    </div>
  );
};

export default MeuComponente;
