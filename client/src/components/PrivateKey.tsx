import React from 'react';
import Typography from '@material-ui/core/Typography';

const PrivateKey = ({ privateKey }) =>
    <Typography variant="body1">Your private key is <code>{privateKey}</code>, keep it somewhere safe for logging in later!</Typography>;

export default PrivateKey;