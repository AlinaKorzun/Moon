import React from 'react';

import classes from './Header.css';
import SearchBar from './SearchBar/SearchBar';
import Filter from './Filter/Filter';
import Aux from '../../hoc/Aux/Aux';
import Button from '../../components/UI/Button/Button';

const header = (props) => {
    let additionalHeader = null;
    let text = props.layout === 'All' ? 'All Coins List' : props.layout === 'OpenCoin' ? 'Open Coin' : 'Watchlist';

    if (props.layout === 'All') {
        additionalHeader = (
            <Aux>
                <SearchBar searchInput={props.searchInput}/>
                <Filter
                    direction={props.nameDirection}
                    rightDirection={props.rightDirection}
                    picDirection={props.picDirection}/>
            </Aux>
        )
    }

    return (
        <div className={classes.Header}>
            <div className={classes.GeneralWrapper}>
                <p>{text}</p>
                {props.layout === 'All' ?
                    <Button link="/watchlist">Go to Watchlist</Button>
                    : <Button link="/">Go to all coins list</Button>
                }
            </div>
            {additionalHeader}
        </div>
    )
};

export default header;