import * as actionTypes from './actionTypes';

import {
    stringify,
    compareForNotUniqMatch,
    compareForUniqMatch,
    getIdsOfCoins,
    getMilliseconds,
    axiosRequest
} from '../../shared/utility';


export const initDB = () => {
    console.log('initDB');
    return dispatch => {
        let db = openDatabase('CoinsProj', '0.1', 'CoinsProj content database', 20 * 1024 * 1024);

        db.transaction(function (tx) {
                tx.executeSql(
                    "SELECT COUNT(*) FROM allCoins",
                    [],
                    function (result) {
                        console.log('success_assets');
                        dispatch(initCoins(''));
                    },
                    function (tx, error) {
                        console.log('fail_assets');
                        tx.executeSql(
                            "CREATE TABLE IF NOT EXISTS allCoins (id INTEGER UNIQUE, title TEXT, title_long TEXT, logo TEXT, all_prices TEXT, checked TEXT, one_day TEXT, one_week TEXT, one_month TEXT, three_months TEXT, six_months TEXT, all_year TEXT, time REAL, algorithm TEXT, proof_type TEXT, markets TEXT, supply TEXT, tranding_volume TEXT, high_notif TEXT, price TEXT)",
                            [],
                            null,
                            null
                        );
                        dispatch(initCoins(''));
                    }
                );
                db = null;
            }
        );
    }
};

export const initCoins = (value, notUniqIds) => {
    console.log('initCoins');
    return dispatch => {
        let bodyFormData = new URLSearchParams();
        bodyFormData.append('action', 'app_get_coins_list');

        if (localStorage.getItem('firstMount') !== 'nope') {
            localStorage.setItem("firstMount", 'nope');
            bodyFormData.append('watchlist', true);

            dispatch(axiosRequest(bodyFormData, addCoinsToDBFirst))

        } else if (value === '' && localStorage.getItem('firstMount') === 'nope') {
            dispatch(getCoinsFromDB());

        } else if (value !== '') {
            bodyFormData.append('ids', value);
            dispatch(axiosRequest(bodyFormData, addCoinsToDB, notUniqIds));
        }
    }
};

export const addCoinsToDBFirst = coins => {
    let coinsLet = coins.data,
        db = openDatabase('CoinsProj', '0.1', 'CoinsProj content database', 20 * 1024 * 1024);

    return dispatch => {
        db.transaction(function (tx_insert) {
            console.log('ok');

            for (let i = 0; i < coinsLet.length; i++) {
                tx_insert.executeSql(
                    ("INSERT OR REPLACE INTO allCoins(id, title, title_long, logo, all_prices, checked, one_day, one_week, one_month, three_months, six_months, all_year, time, algorithm, proof_type, markets, supply, tranding_volume, high_notif, price ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"),
                    [coinsLet[i].ID, coinsLet[i].post_title, coinsLet[i].vd_coin_name, '', stringify(coinsLet[i].vd_coin_data_USD), 'not', stringify(coinsLet[i].vd_coin_current_day_data_USD), stringify(coinsLet[i].vd_coin_week_data_USD), stringify(coinsLet[i].vd_coin_1month_data_USD), stringify(coinsLet[i].vd_coin_3month_data_USD), stringify(coinsLet[i].vd_coin_6month_data_USD), stringify(coinsLet[i].vd_coin_historical_data_USD), getMilliseconds(coinsLet[i].post_modified_gmt), coinsLet[i].vd_coin_algorithm, coinsLet[i].vd_coin_proof_type, stringify(coinsLet[i].vd_coin_markets_USD), stringify(coinsLet[i].vd_coin_snapshot.General), '', '', coinsLet[i].vd_coin_data_USD.PRICE.toFixed(5)],

                    function (tx_insert, result) {
                        // console.log(result);
                    },
                    function (tx, error) {
                        //console.log(error)
                    }
                );
            }
        });
        dispatch(getCoinsFromDB(coinsLet));
    }
};

export const addCoinsToDB = (coins, value) => {
    console.log('addCoinsToDB');
    let coinsLet = coins.data,
        db = openDatabase('CoinsProj', '0.1', 'CoinsProj content database', 20 * 1024 * 1024);

    return dispatch => {
        db.transaction(function (tx_insert) {
            if (typeof value !== 'undefined') {
                let updatedIds = value.split(",").map(Number);

                for (let i = 0; i < coinsLet.length; i++) {
                    let findIds = updatedIds.find(id => id === coinsLet[i].ID);

                    if (findIds) {
                        tx_insert.executeSql(
                            "UPDATE allCoins SET title=?, title_long=?, all_prices=?, one_day=?, one_week=?, one_month=?, three_months=?, six_months=?, all_year=?, time=?, algorithm=?, proof_type=?, markets=?, supply=?, price =? WHERE id =?",
                            [coinsLet[i].post_title, coinsLet[i].vd_coin_name, stringify(coinsLet[i].vd_coin_data_USD), stringify(coinsLet[i].vd_coin_current_day_data_USD), stringify(coinsLet[i].vd_coin_week_data_USD), stringify(coinsLet[i].vd_coin_1month_data_USD), stringify(coinsLet[i].vd_coin_3month_data_USD), stringify(coinsLet[i].vd_coin_6month_data_USD), stringify(coinsLet[i].vd_coin_historical_data_USD), getMilliseconds(coinsLet[i].post_modified_gmt),
                                coinsLet[i].vd_coin_algorithm, coinsLet[i].vd_coin_proof_type, stringify(coinsLet[i].vd_coin_markets_USD), stringify(coinsLet[i].vd_coin_snapshot.General), coinsLet[i].vd_coin_data_USD.PRICE.toFixed(5), coinsLet[i].ID]
                        )
                    } else {
                        tx_insert.executeSql(
                            ("INSERT OR REPLACE INTO allCoins(id, title, title_long, logo, all_prices, checked, one_day, one_week, one_month, three_months, six_months, all_year, time, algorithm, proof_type, markets, supply, tranding_volume, high_notif, price ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"),
                            [coinsLet[i].ID, coinsLet[i].post_title, coinsLet[i].vd_coin_name, '', stringify(coinsLet[i].vd_coin_data_USD), 'not', stringify(coinsLet[i].vd_coin_current_day_data_USD), stringify(coinsLet[i].vd_coin_week_data_USD), stringify(coinsLet[i].vd_coin_1month_data_USD), stringify(coinsLet[i].vd_coin_3month_data_USD), stringify(coinsLet[i].vd_coin_6month_data_USD), stringify(coinsLet[i].vd_coin_historical_data_USD), getMilliseconds(coinsLet[i].post_modified_gmt), coinsLet[i].vd_coin_algorithm, coinsLet[i].vd_coin_proof_type, stringify(coinsLet[i].vd_coin_markets_USD), stringify(coinsLet[i].vd_coin_snapshot.General), '', '', coinsLet[i].vd_coin_data_USD.PRICE.toFixed(5)],

                            function (tx_insert, result) {
                                // console.log(result);
                            },
                            function (tx_insert, error) {
                                //console.log(error)
                            });
                    }
                }
            }
        });
        dispatch(getCoinsFromDB(coinsLet));
    }
};

export const getCoinsFromDB = () => {
    console.log('getCoinsFromDB');
    let db = openDatabase('CoinsProj', '0.1', 'CoinsProj content database', 20 * 1024 * 1024);

    return dispatch => {
        db.transaction(function (tx) {
            tx.executeSql(
                "SELECT id, title, title_long, logo, all_prices, checked, time, tranding_volume, price FROM allCoins", [], function (tx, result) {
                    dispatch(setCoins(result.rows));
                }
            )
        })
    }
};

export const getCoinsIds = () => {
    console.log('getCoinsIds');

    return dispatch => {
        let bodyFormData = new URLSearchParams();

        bodyFormData.set('action', 'app_get_coins_list');
        bodyFormData.set('only_ids', 'true');

        dispatch(axiosRequest(bodyFormData, compareCoinsTime));
    }
};

export const compareCoinsTime = data => {
    console.log('compareCoinsTime');
    return (dispatch, getState) => {
        let transformedCoins = Object.values(getState().coins.coins);
        const responseFromServer = data.data;
        let resultNotUniq = compareForUniqMatch(transformedCoins, responseFromServer);
        let resultUniq = responseFromServer.filter(compareForNotUniqMatch(transformedCoins));
        let string,
            string2,
            resultString = '';

        if (resultNotUniq !== '' || resultUniq !== '') {
            string = getIdsOfCoins(resultNotUniq).join(', ');
            string2 = getIdsOfCoins(resultUniq).join(', ');
            resultString = string.concat(', ', string2);
        }

        if (resultString !== ', ') {
            if (resultString !== '') {
                dispatch(initCoins(resultString, string));
            }
        }
    }
};

export const addOrRemoveToWatchlist = (event, id) => {
    console.log('addOrRemoveToWatchlist');
    event.stopPropagation();
    return (dispatch, getState) => {

        let coinsFromState = Object.values(getState().coins.checkedList);
        const db = openDatabase('CoinsProj', '0.1', 'CoinsProj content database', 20 * 1024 * 1024);
        let checked;

        coinsFromState.indexOf(id) !== -1 ? checked = 'not' : checked = 'yes';
        dispatch(setCheckedList(id));

        db.transaction(function (tx, result) {
            tx.executeSql(
                "UPDATE allCoins SET checked=? WHERE id =? ", [checked, id], null,
            );
        });
    }
};

export const initOpenCoin = id => {
    return (dispatch) => {
        console.log(`initOpenCoin ${id}`);

        const db = openDatabase('CoinsProj', '0.1', 'CoinsProj content database', 20 * 1024 * 1024);

        db.transaction(function (tx, result) {
            tx.executeSql(
                "SELECT * FROM allCoins WHERE id = ?", [id], function (tx, result) {
                    dispatch(addToStateOpenCoinData(result.rows[0]))
                }
            );
        });
    }
};

export const addToStateOpenCoinData = value => {
    return {
        type: actionTypes.ADD_TO_STATE_OPEN_COIN_DATA,
        coin: value
    }
};

export const setCheckedList = id => {
    return {
        type: actionTypes.ADD_OR_REMOVE_TO_WATCHLIST,
        id: id
    }
};

export const setCoins = coins => {
    return {
        type: actionTypes.SET_COIN_DATA,
        coins: coins
    }
};

export const setCheckedCoinId = (id, coin) => {
    return {
        type: actionTypes.SET_CHECKED_COIN_ID,
        id: id,
        coin: coin
    }
};

export const backFromOpenCoin = () => {
    return {
        type: actionTypes.BACK_FROM_OPEN_COIN
    }
};
