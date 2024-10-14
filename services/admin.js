const fs = require('fs');
const jwt = require('jsonwebtoken');

// Variables
const secretFile = process.env.ADMIN_SECRET_DIRECTORY + 'adminPassword';


// Generate secrets as credentials to log in as admin
const generateSecret = () => {
    const secret = require('crypto').randomBytes(16).toString('hex');

    if (!fs.existsSync(secretFile)) {
        fs.writeFileSync(secretFile, secret);
    }
}

// Get secret from secrets file to log in as admin
const getSecret = () => {
    try {
        const data = fs.readFileSync(secretFile, 'utf8');
        return data;
    } catch (error) {
        throw new Error("Terjadi masalah dalam mengakses Secret Admin. ");
    }
}

const deleteSecret = () => {
    fs.unlinkSync(secretFile);
}

const generateAccessToken = () => jwt.sign(
    {
        id: null,
        name: 'Admin',
        role: 'admin'
    },
    process.env.ACCESS_TOKEN_KEY,
    { expiresIn: '30m' }
);

module.exports = {
    generateSecret,
    getSecret,
    deleteSecret,
    generateAccessToken
};