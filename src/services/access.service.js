'use strict';
const ShopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { BadRequestError, ConflictRequestError, AuthFailureError, NotFoundError } = require('../core/error.response');

// Service
const { findByEmail } = require('./shop.service');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
};
class AccessService {
    static handlerRefreshTokenV2 = async ({ keyStore, user, refreshToken }) => {
        const { userId, email } = user;
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userId);
            throw new NotFoundError(' Something went wrong happened !! please login again');
        }
        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not regited');
        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new AuthFailureError(' Shop not registered 2');
        const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey);
        await keyStore.update({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        });
        return {
            user,
            tokens
        };
    };

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id);
        console.log(`delKey`, { delKey });
        return delKey;
    };

    /*
     1. check email in dbs
     2. match passwords
     3. create access token and refresh token
     4.generate return token
     5. get data return login
          */
    static login = async ({ email, password, refreshToken = null }) => {
        //1.AccessService
        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new BadRequestError('Shop not registered');
        //2.
        const match = bcrypt.compare(password, foundShop.password);
        if (!match) throw new AuthFailureError('Authentication error');
        //3.
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');
        //4. generate return token
        const tokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey);
        await KeyTokenService.createKeyToken({ refreshToken: tokens.refreshToken, privateKey, publicKey });
        return {
            shop: getInfoData({
                fields: ['_id', 'name', 'email'],
                object: foundShop
            }),
            tokens
        };
    };

    static signUp = async ({ name, email, password }) => {
        // try {
        //Step 1: check email exists ??

        const holderShop = await ShopModel.findOne({ email }).lean();
        if (holderShop) {
            throw new BadRequestError('Shop already registered! ');
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newShop = await ShopModel.create({
            name,
            email,
            password: passwordHash,
            roles: [RoleShop.SHOP]
        });
        if (newShop) {
            //create privateKey and publicKey follow JWT arguments
            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');
            // Public key CryptoGraphy Standard !
            console.log({ privateKey, publicKey }); // after created, save to collection KeyStore

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            });
            if (!keyStore) {
                //throw new BadRequestError('Error: Shop already registered!   ');
                return {
                    code: ' keyStore xxxx',
                    message: 'keyStore error'
                };
            }
            // create token pair
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);
            return {
                code: 201,
                metadata: {
                    shop: getInfoData({
                        fields: ['_id', 'name', 'email'],
                        object: newShop
                    }),
                    tokens
                }
            };
        }
        return {
            code: 200,
            metadata: null
        };
    };
}

module.exports = AccessService;
