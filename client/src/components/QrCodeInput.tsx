import React, { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader, BrowserQRCodeSvgWriter } from '@zxing/library';
import { Typography } from '@material-ui/core';

const webcamId = 'qr-code-input';
const resultId = 'qr-code-result';

const QrCodeInput = () => {
  const [text, setText] = useState('');
  const [did, setDid] = useState('');
  const reader = useRef(new BrowserQRCodeReader());
  const decodeContinuouslyAsync = async () => {
    const videoInputDevices = await reader.current.listVideoInputDevices();

    try {
      await reader.current.decodeFromInputVideoDeviceContinuously(
        videoInputDevices[0].deviceId,
        webcamId,
        (result) => {
          if (result) {
            setText(result.getText());
          }
        },
      );
    } catch (exception) {}
  };

  useEffect(() => {
    if (text === '') {
      decodeContinuouslyAsync();
    } else {
      const writer = new BrowserQRCodeSvgWriter();
      writer.write(text, 300, 300);
      writer.writeToDom(`#${resultId}`, text, 300, 300);
    }
  });

  if (text === '') {
    return (
      <>
        <Typography variant="h2">Register your smart battery</Typography>
        <Typography variant="body1">Hold the QR code for your smart battery in front of your camera</Typography>
        <video id={webcamId} />
      </>
    );
  }

  return <div id={resultId} />;
};

export default QrCodeInput;
