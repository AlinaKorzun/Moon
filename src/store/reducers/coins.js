import * as actionTypes from '../actions/actionTypes';
import {updatedObject} from '../../shared/utility';

const initialState = {
    coins: null,
    checkedList: [],
    openCoinId: 0,
    coin: null,
    loading: false
};

const setCoins = (state, action) => {
    const allCoins = action.coins;
    let newCoinsObj = [],
        checkedFilter = [];

    for (let key in allCoins) {
        if (!isNaN(+key)) {
            newCoinsObj.push(
                allCoins[key]
            )
        }
    }

    newCoinsObj.filter(coin => {
        if (coin.checked === 'yes') {
            checkedFilter.push(coin.id)
        }
        return checkedFilter
    });

    const updatedCoins = updatedObject(state.coins, newCoinsObj);
    const updatedFilter = updatedObject(state.checkedList, checkedFilter);

    return updatedObject(state, {
        coins: updatedCoins,
        checkedList: updatedFilter
    });
};

const setCheckedList = (state, action) => {
    const newId = action.id,
        checkedListCopy = {...state.checkedList};
    let checkedArray = Object.values(checkedListCopy);

    if (checkedArray.indexOf(newId) !== -1) {
        let index = checkedArray.indexOf(newId);
        checkedArray.splice(index, 1)
    } else {
        checkedArray.push(newId)
    }

    return updatedObject(state, {
        checkedList: checkedArray
    })
};

const setCheckedCoinId = (state, action) => {
    const newId = action.id;

    return updatedObject(state, {
        openCoinId: newId
    })
};

const addToStateOpenCoinData = (state, action) => {
    return updatedObject(state, {
        coin: action.coin,
        loading: false
    })
};

const backFromOpenCoin = state => {
    return updatedObject(state, {
        coin: ''
    })
};

const coinsBuilder = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_COIN_DATA:
            return setCoins(state, action);
        case actionTypes.ADD_OR_REMOVE_TO_WATCHLIST:
            return setCheckedList(state, action);
        case actionTypes.SET_CHECKED_COIN_ID:
            return setCheckedCoinId(state, action);
        case actionTypes.ADD_TO_STATE_OPEN_COIN_DATA:
            return addToStateOpenCoinData(state, action);
        case actionTypes.BACK_FROM_OPEN_COIN:
            return backFromOpenCoin(state, action);
        default:
            return state
    }
};


export default coinsBuilder;