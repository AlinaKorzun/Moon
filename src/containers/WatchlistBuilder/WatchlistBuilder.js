import React, {Component} from 'react';
import {connect} from 'react-redux';

import Header from '../../components/Header/Header';
import OneLineCoin from '../../components/OneLineCoin/OneLineCoin';
import Aux from '../../hoc/Aux/Aux';
import classes from "./WatchlistBuilder.css";
import * as coinTypes from "../../store/actions/index";

class WatchlistBuilder extends Component {
    componentDidMount() {
        console.log('watch')
    }

    render() {
        let transformedCoins,
            coins,
            filteredList,
            outputWatchlist,
            checkedList = this.props.checkedList;

        let transformedCheckedList = Object.values(checkedList);

        if (this.props.coins !== null) {
            coins = this.props.coins !== null ? {...this.props.coins} : null;
            transformedCoins = Object.values(coins);

            filteredList = transformedCoins.filter(coin => {
                return transformedCheckedList.find(id => id === coin.id);
            });


            outputWatchlist = filteredList.map(coin => {
                const id = coin.id;
                let checked;

                transformedCheckedList.indexOf(id) !== -1 ? checked = 'Add' : checked = 'Remove';

                return <OneLineCoin
                    component='watch'
                    eachCoin={coin}
                    checked={checked}
                    addClick={this.props.onAddOrRemoveToWatchlist}
                    idClick={this.props.onsetCheckedCoinId}
                    key={coin.id}/>
            });
        }

        return (
            <Aux>
                <Header layout="Watchlist"/>
                <div className={classes.WatchlistBuilder}>
                    {outputWatchlist}
                </div>
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
        coins: state.coins.coins,
        checkedList: state.coins.checkedList,
        id: state.coins.openCoinId
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onAddOrRemoveToWatchlist: (event, id) => dispatch(coinTypes.addOrRemoveToWatchlist(event, id)),
        onsetCheckedCoinId: (id, coin) => dispatch(coinTypes.setCheckedCoinId(id, coin))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(WatchlistBuilder);