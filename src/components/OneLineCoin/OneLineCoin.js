import React from 'react';

import {withRouter} from 'react-router-dom';

import classes from './OneLineCoin.css';
import Add from '../../assets/images/down-arrow.png'
import Remove from '../../assets/images/cancel.png'

const oneLineCoin = (props) => {

    const id = props.eachCoin.id;
    const isChecked = props.checked === 'Add' ? 'Add' : 'Remove';
    const picSrc = (props.component === 'all' && isChecked === 'Add') ? Add : Remove;

    const openCoinHandler = (id, coin) => {
        props.idClick(id, coin);
        props.history.push('/opencoin/' + id)
    };

    return (
        <div
            className={classes.OneLineCoin}
            onClick={() => openCoinHandler(id, props.eachCoin)}>

            <div className={classes.CoinTitle}>{props.eachCoin.title_long} ({props.eachCoin.title})</div>
            <div className={classes.SmallWrapper}>
                <div className={classes.CoinPrice}>${props.eachCoin.price}</div>
                <div
                    className={classes[isChecked]}
                    onClick={(event) => {props.addClick(event, id)}}>
                    <img className={classes[isChecked]} src={picSrc} alt=""/>
                </div>
            </div>
        </div>
    )
};

export default withRouter(oneLineCoin);