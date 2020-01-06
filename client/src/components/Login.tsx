import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import axios from 'axios';

import useStyles from '../useStyles';
import { ethers } from 'ethers';

const Login = ({ setIdentity }) => {
    const classes = useStyles();
    const [name, setName] = useState('');
    const [role, setRole] = useState('Prosumer');
    const [postalAddress, setPostalAddress] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const handleName = (e) => {
        setName(e.target.value as string);
    };
    const handleRole = (e) => {
        setRole(e.target.value as string);
    };
    const handlePostalAddress = (e) => {
        setPostalAddress(e.target.value as string);
    };
    const handlePrivateKey = (e) => {
        setPrivateKey(e.target.value as string);
    };
    const handleNew = async (e) => {
        e.preventDefault();
        const response = await axios({
            method: 'post',
            url: 'http://localhost:3000/identity',
            data: {
              name: name,
              role: role,
              postalAddress: postalAddress,
            }
          });
        setIdentity({ name: name, role: role, postalAddress: postalAddress, address: response.headers.location.split('/')[2], privateKey: response.data.privateKey });
    };
    const handleOld = async (e) => {
        e.preventDefault();
        const address = new ethers.Wallet(privateKey).address;
        const response = await axios({
            method: 'get',
            url: 'http://localhost:3000/identity/' + address
        });
        setIdentity({ privateKey, address, ...response.data });
    };
    return (
        <Grid container spacing={1}>
            <Grid item xs={6}>
                <Typography variant="h3">
                    Log in
                </Typography>
                <Typography variant="body1">
                    If you have been here before, please provide your private key below to log in.
                </Typography>
                <form onSubmit={handleOld}>
                    <div>
                        <TextField required label="Private key" helperText="e.g. 0xF12B835dFe0..." onChange={handlePrivateKey}>{privateKey}</TextField>
                    </div>
                    <div>
                        <Button className={classes.button} variant="contained" color="primary" type="submit">Log in</Button>
                    </div>
                </form>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="h3">Create a private key</Typography>
                <Typography variant="body1">If it is your first time here, fill in your details and click the button below to create a private key.</Typography>
                <form onSubmit={handleNew}>
                    <div>
                        <TextField required className={classes.formControl} label="Name" helperText="e.g. Tintin Milou" onChange={handleName}>{name}</TextField>
                    </div>
                    <div>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="role-label">Role</InputLabel>
                            <Select value={role} labelId="role-label" displayEmpty onChange={handleRole}>
                                <MenuItem value="Prosumer">I own a household battery</MenuItem>
                                <MenuItem value="Manufacturer">I manufacture household batteries</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div>
                        <TextField required className={classes.formControl} label="Postal address" helperText="e.g. Quai de l'industrie 1, 1070 Anderlecht" onChange={handlePostalAddress}>{postalAddress}</TextField>
                    </div>
                    <div>
                        <Button className={classes.button} variant="contained" color="primary" type="submit">Create a private key</Button>
                    </div>
                </form>
            </Grid>
        </Grid>);
};

export default Login;