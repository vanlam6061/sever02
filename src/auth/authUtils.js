'use strict';

const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');

//Services
const { findByUserId } = require('../services/keyToken.service');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'refreshToken'
};

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // access token
        const accessToken = await JWT.sign(payload, publicKey, {
            // algorithm: 'RS256',
            expiresIn: '2 days'
        });
        console.log(`access Token ::`, accessToken);
        // refreshToken
        const refreshToken = await JWT.sign(payload, privateKey, {
            // algorithm: 'RS256',
            expiresIn: '7 days'
        });
        console.log(` refToken:`, refreshToken);
        // verify
        await JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`error verify::`, err);
            } else {
                console.log(`decode::`, decode);
            }
        });
        return { accessToken, refreshToken };
    } catch (error) {}
};

//authentication

const authenticationV2 = asyncHandler(async (req, res, next) => {
    /*
    1- Check userId missing ?
    2. get accessToken
    3.verify Token
    4. check keyStore with this userId ?
    5. check keyStore with this userId
    6. Ok all => return next()
    */
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError('Invalid request');
    //2.get accessToken
    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError('Not found keyStore');
    //3.verify Token
    if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESH];
            const decodeUser = await JWT.verify(refreshToken, keyStore.privateKey);
            if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId');
            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = refreshToken;
            return next();
        } catch (error) {
            throw error;
        }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION];

    if (!accessToken) throw new AuthFailureError('Invalid request');

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        // const decodeUser = await JWT.verify(accessToken, keyStore.publicKey);

        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId');
        req.keyStore = keyStore;
        req.user = decodeUser; //{userId, email}
        return next();
    } catch (error) {
        throw error;
    }
});
const verifyJWT = async (token, ketSecret) => {
    return await JWT.verify(token, ketSecret);
};
module.exports = { createTokenPair, verifyJWT, authenticationV2 };
