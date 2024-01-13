import QRCode from 'qrcode.react';


const QRCodeDisplay = ({ dateTime, prize, voucherId }) => (
    <figure>
      {/* <QRCode id='qr-code' value={`${dateTime.toUTCString()} - ${prize} - ${voucherId}`} /> */}
      <QRCode id='qr-code' value={`https://escapade-gourmande-coupon-validateur-front.vercel.app/${voucherId}`} />
      {/* <figcaption>
        QR Code for {prize} - {dateTime.toLocaleString()}
      </figcaption> */}
      <br />
      {voucherId}
    </figure>
  );
  

export default QRCodeDisplay;
