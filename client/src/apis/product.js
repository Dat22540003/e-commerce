import axios from '../axios';

export const apiGetProducts = (params) =>
    axios({
        url: '/product/',
        method: 'get',
        params,
    });

export const apiGetProduct = (pid) =>
    axios({
        url: '/product/' + pid,
        method: 'get',
    });

export const apiRating = (data) =>
    axios({
        url: '/product/ratings',
        method: 'put',
        data,
    });

export const apiCreateProduct = (data) =>
    axios({
        url: '/product/',
        method: 'post',
        data,
    });

export const apiUpdateProduct = (data, pid) =>
    axios({
        url: '/product/' + pid,
        method: 'put',
        data,
    });

export const apiDeleteProduct = (pid) =>
    axios({
        url: '/product/' + pid,
        method: 'delete',
    });

export const apiAddVariant = (data, pid) =>
    axios({
        url: '/product/variant/' + pid,
        method: 'put',
        data,
    });

export const apiCreateOrder = (data) =>
    axios({
        url: '/order/',
        method: 'post',
        data,
    });

export const apiGetOrders = (params) =>
    axios({
        url: '/order/admin',
        method: 'get',
        params,
    });

export const apiGetUserOrder = (params) =>
    axios({
        url: '/order/',
        method: 'get',
        params,
    });
