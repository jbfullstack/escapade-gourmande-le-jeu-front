
import './SpinResultMessage.css'
const SpinResultMessage = ({ result, prizes, voucherId }) => (
    <p>
      {result === -1 ? (
        <span className="notification">
          Désolée, vous n'êtes pas autorisé à participer plusieurs fois dans la même journée.
          {voucherId}
        </span>
      ) : (
          <>
            <span className="success">
              Vous avez remporté : {prizes[result]}!
              {voucherId}
            </span>
            <span className="voucher-id">
              {voucherId}
            </span>
          </>
      )}
    </p>
  );
  
  export default SpinResultMessage;
  