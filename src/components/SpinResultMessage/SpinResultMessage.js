
import './SpinResultMessage.css'
const SpinResultMessage = ({ result, prizes }) => (
    <p>
  {result === -1 ? (
    <span className="notification">
      Désolée, vous n'êtes pas autorisé à participer plusieurs fois dans la même journée.
    </span>
  ) : (
    <span className="success">
      Vous avez remporté : {prizes[result]}!
    </span>
  )}
</p>
  );
  
  export default SpinResultMessage;
  