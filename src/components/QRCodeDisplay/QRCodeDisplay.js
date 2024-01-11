import QRCode from 'qrcode.react';


const QRCodeDisplay = ({ dateTime, prize }) => (
    <figure>
      <QRCode id='qr-code' value={`${dateTime.toUTCString()} - ${prize}`} />
      {/* <figcaption>
        QR Code for {prize} - {dateTime.toLocaleString()}
      </figcaption> */}
    </figure>
  );
  

export default QRCodeDisplay;
