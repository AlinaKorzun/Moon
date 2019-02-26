import React, {Component} from 'react';
import {connect} from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Header from '../../components/Header/Header';
import OneLineCoin from '../../components/OneLineCoin/OneLineCoin';
import classes from './AllCoinsBuilder.css';

import * as coinTypes from '../../store/actions/index';

class AllCoinsBuilder extends Component {
    state = {
        searchValue: '',
        coinsList: null,
        searching: false,
        nameDirection: true,
        rightPartDirection: true,
        changedDirection: false,
        dirValue: ''
    };

    // componentDidMount() {
    //     // console.log('did mount');
    //     // this.props.onSetCoins()
    //
    // }

    searchCoins = (event) => {
        this.setState({
            searchValue: event.target.value,
            searching: true,
            changedDirection: false
        });

        if (event.target.value.length === 0) {
            this.setState({
                searching: false
            })
        }
    };

    directionOfList = value => {
        this.setState({
            changedDirection: true,
            dirValue: value
        });

        if (value === 'title_long') {
            this.setState((prevState, props) => {
                return {
                    nameDirection: !prevState.nameDirection
                }
            });
        } else {
            this.setState((prevState, props) => {
                return {
                    rightPartDirection: !prevState.rightPartDirection
                }
            });
        }
    };


    render() {
        const coins = this.props.coins !== null ? {...this.props.coins} : null;
        let coinsList = '';

        const listForRender = list => {
            let transformedCoins = Object.values(list);
            let transformedCheckedList = Object.values(this.props.checkedList);

            const outputList = transformedCoins.map(coin => {
                const id = coin.id;
                let checked;

                transformedCheckedList.indexOf(id) !== -1 ? checked = 'Add' : checked = 'Remove';

                return <OneLineCoin
                    component='all'
                    eachCoin={coin}
                    checked={checked}
                    key={id}
                    idClick={this.props.onsetCheckedCoinId}
                    addClick={this.props.onAddOrRemoveToWatchlist}/>
            });
            return outputList
        };

        if (coins) {
            let transformedCheckedList = Object.values(this.props.coins);

            if (!this.state.searching && !this.state.changedDirection) {
                coinsList = listForRender(coins);

            } else if (this.state.searching) {

                let filteredList = transformedCheckedList.filter(coin => {
                    let shortName = coin.title.toLowerCase().includes(this.state.searchValue.toLowerCase());
                    let longName = coin.title_long.toLowerCase().includes(this.state.searchValue.toLowerCase());
                    return shortName + longName
                });
                coinsList = listForRender(filteredList);

            } else if (this.state.changedDirection && !this.state.searching) {
                const value = this.state.dirValue,
                    that = this;
                let sort,
                    aItem,
                    bItem,
                    direction;

                sort = transformedCheckedList.sort(function (a, b) {
                    if (value === 'title_long') {
                        aItem = a[value].trim();
                        bItem = b[value].trim();
                        direction = that.state.nameDirection
                    } else if (value === 'price') {
                        aItem = parseFloat(a[value]);
                        bItem = parseFloat(b[value]);
                        direction = that.state.rightPartDirection
                    }

                    if (direction) {
                        if (aItem > bItem) return 1;
                        if (aItem < bItem) return -1;
                        return 0;
                    } else {
                        if (aItem < bItem) return 1;
                        if (aItem > bItem) return -1;
                        return 0;
                    }
                });

                coinsList = listForRender(sort);
            }
        }

        return (
            <Aux>
                <Header
                    layout="All"
                    searchInput={this.searchCoins}
                    nameDirection={this.directionOfList}
                    picDirection={this.state.nameDirection}
                    rightDirection={this.state.rightPartDirection}/>
                <div className={classes.AllCoinsBuilder}>
                    {coinsList}
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

export default connect(mapStateToProps, mapDispatchToProps)(AllCoinsBuilder);