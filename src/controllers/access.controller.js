'use strict';

const AccessService = require('../services/access.service');
const { OK, CREATED, SuccessResponse } = require('../core/success.response');

class AccessController {
    handlerRefreshTokenV2 = async (req, res, next) => {
        new SuccessResponse({
            message: 'handle RefreshToken Successful',
            metadata: await AccessService.handlerRefreshTokenV2({ refreshToken: req.refreshToken, user: req.user, keyStore: req.keyStore })
        }).send(res);
    };
    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout Successful',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res);
    };
    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body)
        }).send(res);
    };
    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Registered Ok',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send(res);
    };
}

module.exports = new AccessController();
