const SpinButton = ({ onClick, isDisabled }) => (
    <button onClick={onClick} disabled={isDisabled} className={isDisabled ? 'disabled' : ''}>
      Cliquez pour jouer
    </button>
  );
  
  export default SpinButton;
  