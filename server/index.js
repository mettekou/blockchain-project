const fs = require('fs');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ethers = require('ethers');

const app = express();
const port = 3000;
const padding = '000000000000000000000000';

app.use(bodyParser.json());
app.use(cors({exposedHeaders: ['Location']}));

const provider = new ethers.providers.JsonRpcProvider("http://localhost:9545");
const signer = provider.getSigner(0);
const EthereumDIDRegistryAddress = '0x39EdC6a59573E3Ae5A4a076991d48Cf466925828';
const EthereumDIDRegistryAbi = JSON.parse(fs.readFileSync('abis/EthereumDIDRegistry.json')).abi;
const EthereumDIDRegistrySigner = new ethers.Contract(EthereumDIDRegistryAddress, EthereumDIDRegistryAbi, signer);
const EthereumClaimsRegistryAddress = '0xa6bD2581279D8635C5Fff2FF19125b29F2E9B2f1'
const EthereumClaimsRegistryAbi = JSON.parse(fs.readFileSync('abis/EthereumClaimsRegistry.json')).abi;
const EthereumClaimsRegistrySigner = new ethers.Contract(EthereumClaimsRegistryAddress, EthereumClaimsRegistryAbi, signer);

const DIDAttributeChangeds = [];
EthereumDIDRegistrySigner.on('DIDAttributeChanged(address,bytes32,bytes,uint,uint)', (identity, name, value, validTo, previousChange) => {
    DIDAttributeChangeds.push({
        identity: identity,
        name: ethers.utils.parseBytes32String(name),
        value: ethers.utils.toUtf8String(value),
        validTo: validTo,
        previousChange: previousChange,
    });
});

const ClaimSets = [];
EthereumClaimsRegistrySigner.on('ClaimSet(address,address,bytes32,bytes32,uint)', (issuer, subject, key, value, updatedAt) => {
    ClaimSets.push({
        issuer: issuer,
        subject: subject,
        key: key,
        value: value,
        updatedAt: updatedAt,
    });
});

provider.resetEventsBlock(0);

const seedWallet = async (wallet) => {
    const seedAmount = ethers.utils.parseUnits('0.001', 'ether').toHexString();
    const signerAddress = await signer.getAddress();
    await provider.send('eth_sendTransaction', {
        from: signerAddress,
        to: wallet.address,
        value: seedAmount,
    });
};

const updateIdentity = async ({ name, role, postalAddress }, wallet) => {
    const identityValidity = 60 * 60 * 24 * 365;
    const EthereumDIDRegistryWallet = new ethers.Contract(EthereumDIDRegistryAddress, EthereumDIDRegistryAbi, wallet);

    await EthereumDIDRegistryWallet.setAttribute(wallet.address, ethers.utils.formatBytes32String('X-Name'), ethers.utils.toUtf8Bytes(name || "Unkown"), identityValidity);
    await EthereumDIDRegistryWallet.setAttribute(wallet.address, ethers.utils.formatBytes32String('X-Role'), ethers.utils.toUtf8Bytes(role || "Unknown"), identityValidity);
    await EthereumDIDRegistryWallet.setAttribute(wallet.address, ethers.utils.formatBytes32String('X-PostalAddress'), ethers.utils.toUtf8Bytes(postalAddress || "Unknown"), identityValidity);
};

app.post('/identity', async (req, res) => {
    const wallet = ethers.Wallet.createRandom().connect(provider);
    
    try {
        await seedWallet(wallet);
        await updateIdentity(req.body, wallet);
        res.status(201).setHeader('Location', `/identity/${wallet.address}`);
        return res.send({ privateKey: wallet.privateKey });
    } catch (e) {
        console.error(e);
        return res.status(500).send();
    }
});

app.get('/identity/:id', (req, res) => {
    const attributes = DIDAttributeChangeds.filter(event => event.identity === req.params.id);

    if (attributes.length === 0) {
        return res.status(404).send();
    }

    attributes.reverse();
    const nameAttribute = attributes.find(attribute => attribute.name === 'X-Name');
    const roleAttribute = attributes.find(attribute => attribute.name === 'X-Role');
    const postalAddressAttribute = attributes.find(attribute => attribute.name === 'X-PostalAddress');
    return res.status(200).send({ name: nameAttribute.value, role: roleAttribute.value, postalAddress: postalAddressAttribute.value });
});

app.put('/identity/:id', async (req, res) => {
    const { privateKey, ...identity } = req.body;
    const wallet = new ethers.Wallet(privateKey, provider);
    
    if (wallet.address !== req.params.id) {
        return res.status(403).send();
    }

    try {
        await seedWallet(wallet);
        await updateIdentity(identity, wallet);
        return res.status(200).send();
    }
    catch (e) {
        console.error(e);
        return res.status(500).send();
    }
});

app.post('/asset', async (req, res) => {
    const { privateKey, serialNumber, capacity } = req.body;

    try {
        const manufacturer = new ethers.Wallet(privateKey, provider);
        const attributes = DIDAttributeChangeds.filter(event => event.identity === manufacturer.address);
        attributes.reverse();
        const roleAttribute = attributes.find(attribute => attribute.name === 'X-Role');
    
        if (roleAttribute.value !== 'Manufacturer') {
            return res.status(403).send();
        }
    
        const asset = ethers.Wallet.createRandom();
        const EthereumClaimsRegistryManufacturer = new ethers.Contract(EthereumClaimsRegistryAddress, EthereumClaimsRegistryAbi, manufacturer);

        await seedWallet(manufacturer);
        await EthereumClaimsRegistryManufacturer.setClaim(asset.address, ethers.utils.id('X-Manufacturer'), manufacturer.address + padding);
        await EthereumClaimsRegistryManufacturer.setClaim(asset.address, ethers.utils.id('X-SerialNumber'), ethers.utils.formatBytes32String(serialNumber));
        await EthereumClaimsRegistryManufacturer.setClaim(asset.address, ethers.utils.id('X-Capacity'), ethers.utils.formatBytes32String(capacity));

        res.status(201).setHeader('Location', `/asset/${asset.address}`);
        return res.send({ privateKey: asset.privateKey });
    } catch (e) {
        console.error(e);
        return res.status(500).send();
    }
});

/*app.get('asset/:id', (req, res) => {
    const claims = ClaimSets.filter(event => event.subject === req.params.id);

    if (claims.length === 0) {
        return res.status(404).send();
    }

    claims.reverse();

    const manufacturerClaim = claims.find(claim => claim.key === ethers.utils.keccak256('X-Manufacturer'));
    const serialNumberClaim = claims.find(claim => claim.key === ethers.utils.keccak256('X-SerialNumber'));
    const capacityClaim = claims.find(claim => claim.key === ethers.utils.keccak256('X-Capacity'));
    const ownerClaim = claims.find(claim => claim.key === ethers.utils.keccak256('X-Owner'));

    return res.status(200).send({ manufacturer: manufacturerClaim.value, role: serialNumberClaim.value, postalAddress: capacityClaim.value, owner: `/identity/${ownerClaim.value}` });
});*/

app.put('/asset/:id', async (req, res) => {
    const { privateKey, owner } = req.body;
    const asset = new ethers.Wallet(privateKey, provider);

    if (req.params.id !== asset.address) {
        return res.status(403).send();
    }

    const attributes = DIDAttributeChangeds.filter(event => event.identity === owner);
    attributes.reverse();
    const roleAttribute = attributes.find(attribute => attribute.name === 'X-Role');

    if (roleAttribute.value !== 'Prosumer') {
        return res.status(403).send();
    }

    try {
        await seedWallet(asset);
        const EthereumClaimsRegistryAsset = new ethers.Contract(EthereumClaimsRegistryAddress, EthereumClaimsRegistryAbi, asset);
        await EthereumClaimsRegistryAsset.setSelfClaim(ethers.utils.id('X-Owner'), owner + padding);
        return res.status(200).send();
    } catch (e) {
        console.error(e);
        return res.status(500).send();
    }
});

app.listen(port);