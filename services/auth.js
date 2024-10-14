const jwt = require('jsonwebtoken');
const Auth = require('../models/auth');

const generateAccessToken = (payload) => jwt.sign(
    {
        id: payload.id,
        email: payload.email,
        role: payload.role,
        isVerified: payload.is_verified,
    },
    process.env.ACCESS_TOKEN_KEY,
    {
        expiresIn: '6h'
    }
);

const generateRefreshToken = (payload) => jwt.sign(
    {
        id: payload.id,
        email: payload.email,
        role: payload.role,
        isVerified: payload.is_verified,
    },
    process.env.REFRESH_TOKEN_KEY,
    {
        expiresIn: '1d'
    }
);

const verifyJWT = (token, secret) => jwt.verify(token, secret);

const createAuth = async (payload) => {
    const auth = await Auth.create(payload);
    return {
        id: auth.id
    };
}

const getAuth = async (conditions) => {
    const auth = await Auth.findOne(conditions);
    return auth;
}

const updateAuth = async (userId, payload) => {
    const auth = await Auth.update(payload, {
        where: {
            user_id: userId,
        }
    });
    return auth;
}

const deleteAuth = async (userId) => {
    const auth = await Auth.destroy({
        where: {
            user_id: userId
        }
    });
    return auth;
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyJWT,
    createAuth,
    getAuth,
    updateAuth,
    deleteAuth
};