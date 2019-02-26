// @flow
import axios from "../axios-coins";

export const updatedObject = (oldObject, updatedProps) => {
    return {
        ...oldObject,
        ...updatedProps
    }
};

export const getMilliseconds = (value) => {
    value = value.replace(/-/g, "/");
    return new Date(value).getTime() / 1000;
};

export const stringify = (value) => {
    return JSON.stringify(value)
};

export const compareForNotUniqMatch = (otherArray) => {
    return function (current) {
        return otherArray.filter(function (other) {
            return other.id === current.id
        }).length === 0;
    }
};

export const compareForUniqMatch = (firstArray, secondArray) => firstArray.filter(function (o1) {
    return secondArray.some(function (o2) {
        return o1.id === o2.id && getMilliseconds(o2.time) !== o1.time;
    })
});

export const getIdsOfCoins = (array) => {
    let arr = [];
    array.map(coin => {
        return arr.push(coin.id)
    });
    return arr
};

export const axiosRequest = (bodyFormData, func, value) => {
    return dispatch => {
        axios.post('https://dev.viaduct.pro/moonhubapp/wp-admin/admin-ajax.php', bodyFormData)
            .then(response => {
                dispatch(func(response.data, value));
            })
            .catch(error => {
                // dispatch(fetchIngredientsFailed())
            })
    }
};