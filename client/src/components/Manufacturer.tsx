import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';

import PrivateKey from './PrivateKey';
import useStyles from '../useStyles';

const Manufacturer = ({ identity }) => {
    const classes = useStyles();
    const [serialNumber, setSerialNumber] = useState('');
    const [capacity, setCapacity] = useState('');
    const [asset, setAsset] = useState({ privateKey: '' });
    const handleSerialNumber = (e) => {
        setSerialNumber(e.target.value as string);
    };
    const handleCapacity = (e) => {
        setCapacity(e.target.value as string);
    };
    const handleRegister = async (e) => {
        e.preventDefault();
        const response = await axios({
            method: 'post',
            url: 'http://localhost:3000/asset',
            data: {
                privateKey: identity.privateKey,
                serialNumber: serialNumber,
                capacity: capacity,
            },
        });
        setAsset({ address: response.headers.location.split('/')[2], ...response.data});
    };

    if (asset.privateKey !== '') {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <PrivateKey privateKey={identity.privateKey} />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h3">Success</Typography>
                    <Typography variant="body1">Your household battery private key is <code>{asset.privateKey}</code>.</Typography>
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container>
        <Grid item xs={12}>
          <PrivateKey privateKey={identity.privateKey} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h3">Register</Typography>
          <Typography variant="body1">Fill in the details of the produced household battery below to register it.</Typography>
          <form onSubmit={handleRegister}>
                    <div>
                        <TextField required className={classes.formControl} label="Serial number" onChange={handleSerialNumber}>{serialNumber}</TextField>
                    </div>
                    <div>
                        <TextField required className={classes.formControl} label="Capacity (Ah)" onChange={handleCapacity}>{capacity}</TextField>
                    </div>
                    <div>
                        <Button className={classes.button} variant="contained" color="primary" type="submit">Register the asset</Button>
                    </div>
                </form>
        </Grid>
      </Grid>);
};

export default Manufacturer;