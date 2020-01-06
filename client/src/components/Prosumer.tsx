import React, { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader, BrowserQRCodeSvgWriter } from '@zxing/library';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import { ethers } from 'ethers';

const webcamId = 'qr-code-input';
const resultId = 'qr-code-result';

const Prosumer = ({ identity }) => {
  const [privateKey, setPrivateKey] = useState('');
  const reader = useRef(new BrowserQRCodeReader());
  const decodeContinuouslyAsync = async () => {
    const videoInputDevices = await reader.current.listVideoInputDevices();

    try {
      await reader.current.decodeFromInputVideoDeviceContinuously(
        videoInputDevices[0].deviceId,
        webcamId,
        async (result) => {
          if (result) {
            setPrivateKey(result.getText());
            const response = await axios({
              method: 'put',
              url: 'http://localhost:3000/asset/' + new ethers.Wallet(privateKey).address,
              data: {
                privateKey: privateKey,
                owner: identity.address,
              }
            });
            console.log(response);
          }
        },
      );
    } catch (exception) { }
  };

  useEffect(() => {
    if (privateKey === '') {
      decodeContinuouslyAsync();
    } else {
      const writer = new BrowserQRCodeSvgWriter();
      writer.write(privateKey, 300, 300);
      writer.writeToDom(`#${resultId}`, privateKey, 300, 300);
    }
  });

  if (privateKey === '') {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h3">Register</Typography>
          <Typography variant="body1">Hold the QR code for your household battery in front of your camera to register it</Typography>
          <video id={webcamId} />
        </Grid>
      </Grid>
    );
  }

  return (<Grid container>
    <Grid item xs={12}>
      <Typography variant="h3">Success</Typography>
      <Typography variant="body1">Your smart battery has been registered</Typography>
      <div id={resultId} />
    </Grid>
  </Grid>);
};

export default Prosumer;
