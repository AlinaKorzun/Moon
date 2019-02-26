import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import classes from './OpenCoin.css';
import Header from '../../components/Header/Header';
import Aux from '../../hoc/Aux/Aux';
import * as coinTypes from "../../store/actions/index";
import Chart from '../../components/Chart/Chart';
import Spinner from '../../components/UI/Spinner/Spinner';
import Add from '../../assets/images/down-arrow.png'
import Remove from '../../assets/images/cancel.png'

class OpenCoin extends Component {
    state = {
        btns: {
            'one_day': '1D',
            'one_week': '1W',
            'one_month': '1M',
            'three_months': '3M',
            'six_months': '6M',
            'all_year': '1Y'
        },
        timeArray: [],
        priceArray: [],
        exactData: 'one_day',
        newData: [],
        redirect: false,
        price: '',
        tooltipData: '',
        date: ''
    };

    componentDidMount() {
        this.props.onInitOpenCoin(this.props.id);


    };

    componentDidUpdate(prevProps) {
        if (prevProps.coin !== this.props.coin) {
            this.setNewData('one_day');
            this.setState({
                tooltipData: {yLabel: this.props.coin.price}
            })
        }
    };

    componentWillUnmount() {
        this.props.onBackFromOpenCoin()
    };

    setNewData = (data) => {
        const coin = this.props.coin;

        if (coin) {
            const oneDay = JSON.parse(coin[data]);
            const timeArray = oneDay.map(item => item.time);
            const priceArray = oneDay.map(item => item.close);

            this.setState({
                timeArray: timeArray,
                priceArray: priceArray
            })
        }
    };

    clickBtn = (item) => {
        this.setState((prevState) => {
            if (prevState.exactData !== item) {
                return {exactData: item}
            }
        });
        this.setNewData(item);
    };

    dataMaker = tooltip => {
        const choosenBtn = this.state.exactData;
        const dates = new Date(tooltip.xLabel * 1000);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const year = dates.getFullYear();
        const month = months[dates.getMonth()];
        const date = dates.getDate();
        const hours = dates.getHours() < 10 ? '0' + dates.getHours() : dates.getHours();
        const minutes = dates.getMinutes() < 10 ? '0' + dates.getMinutes() : dates.getMinutes();

        let dataTooltip = '';

        if (this.state.tooltipData.xLabel !== tooltip.xLabel) {
            this.setState({
                tooltipData: tooltip
            });

            if (choosenBtn === 'one_day') {
                this.setState({
                    date: `TODAY ${hours}:${minutes}`
                });
            } else {
                this.setState({
                    date: `${date} ${month} ${year} ${hours}:${minutes}`
                });
            }
        }

        if (choosenBtn === 'one_day') {

            dataTooltip = `TODAY ${hours}:${minutes}`;
        } else {

            dataTooltip = `${date} ${month} ${year} ${hours}:${minutes}`;
        }

        return dataTooltip
    };

    mouseEvent = event => {
        if (event === 'mouseout') {
            this.setState({
                tooltipData: {yLabel: this.props.coin.price},
                date: ''
            })
        }
    };

    render() {
        const coin = this.props.coin === null ? '' : this.props.coin;
        const id = this.props.id === null ? '' : this.props.id;
        const transformedCheckedList = Object.values(this.props.checkedList);
        const picSrc = (transformedCheckedList.includes(id)) ? Remove : Add;
        const checkedPicText = (transformedCheckedList.includes(id)) ? 'Remove coin from your watchlist' : 'Add coin to your watchlist';

        let summary;

        const btns = Object.entries(this.state.btns).map(item => {
            const classNames = [classes.EachChartBtn, (item[0] === this.state.exactData ? classes.active : '')];
            return (
                <div className={classNames.join(' ')} key={item[0]}
                     onClick={() => this.clickBtn(item[0])}>{item[1]}</div>
            )
        });

        if (this.props.id > 0 && (coin === '' || typeof coin === 'undefined')) {
            summary = <Spinner/>

        } else if (coin) {
            summary = (
                <Aux>
                    <Header layout="OpenCoin"/>
                    <div className={classes.OpenCoin}>
                        <div className={classes.NameWrapper}>
                            <p>{coin.title_long} ({coin.title})</p>
                            <div className={classes.AddOrRemoveCoin}>
                                <p>{checkedPicText}</p>
                                <img onClick={(event) => this.props.onAddOrRemoveToWatchlist(event, id)} src={picSrc}
                                     alt=""/>
                            </div>
                        </div>
                        <div className={classes.PriceWrapper}><p>{this.state.date} ${this.state.tooltipData.yLabel} </p>
                        </div>

                        <div className={classes.ChartWrapper}>
                            <Chart
                                time={this.state.timeArray}
                                data={this.state.priceArray}
                                mouseEvent={this.mouseEvent}
                                dataMaker={this.dataMaker}/>
                        </div>
                        <div className={classes.underChartBtn}>
                            {btns}
                        </div>
                    </div>
                </Aux>
            )
        } else {
            summary = <Redirect to='/'/>;
        }

        return summary
    }
}

const mapStateToProps = state => {
    return {
        id: state.coins.openCoinId,
        coin: state.coins.coin,
        checkedList: state.coins.checkedList
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onInitOpenCoin: id => dispatch(coinTypes.initOpenCoin(id)),
        onBackFromOpenCoin: () => dispatch(coinTypes.backFromOpenCoin()),
        onAddOrRemoveToWatchlist: (event, id) => dispatch(coinTypes.addOrRemoveToWatchlist(event, id))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(OpenCoin);