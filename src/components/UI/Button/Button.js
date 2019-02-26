import React from 'react';
import {NavLink} from 'react-router-dom';

import classes from './Button.css';

const button = props => (
    <NavLink
        className={classes.Button}
        to={props.link}>{props.children}</NavLink>
);

export default button;

