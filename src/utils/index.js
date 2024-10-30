'use strict';
const _ = require('lodash');

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
};
//quy đổi['a','b','c'] =>{a:1,b:1,c:1}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 1]));
};
const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 0]));
};
const removeUndefineObject = (obj) => {
    Object.keys(obj).forEach((key) => {
        if (obj[key] == null) {
            delete obj[key];
        }
    });
    return obj;
};
const updateNestedObjectParser = (obj) => {
    const final = {};
    Object.keys(obj).forEach((k) => {
        if (obj[k] === 'Object' && !Array.isArray(obj[k])) {
            const response = updateNestedObjectParser(obj[k]);
            Object.keys(response).forEach((a) => {
                final[`${k}&${a}`] = res[a];
            });
        } else {
            final[k] = obj[k];
        }
    });
    return final;
};

module.exports = { getInfoData, getSelectData, unGetSelectData, removeUndefineObject, updateNestedObjectParser };
