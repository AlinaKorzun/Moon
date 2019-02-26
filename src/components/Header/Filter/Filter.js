import React from 'react';

import classes from './Filter.css';

const filter = props => {
    let filterType = {
        'price': 'Price'
    };
    return (
        <div className={classes.Filter}>
            <span
                className={[classes.Name, classes[props.picDirection ? 'Up' : 'Down']].join(' ')}
                onClick={() => props.direction('title_long')}>
                Coin Name</span>
            <span className={[classes.RightFilter, classes[props.rightDirection ? 'Up' : 'Down']].join(' ')}
                  onClick={() => props.direction('price')}>
                {filterType['price']}
            </span>
        </div>
    )
};

export default filter;