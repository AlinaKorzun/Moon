import React from 'react';

import classes from './SearchBar.css';

const searchBar = props => {
    return (
        <div className={classes.InputWrapper}>
            <input
                type="text"
                placeholder="Search coin by name..."
                onChange={props.searchInput}/>
        </div>
    )
};

export default searchBar;