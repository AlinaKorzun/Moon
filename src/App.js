import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Route, Switch, withRouter, Redirect} from 'react-router-dom';

import asyncComponent from './hoc/asyncComponent/asyncComponent';

import Layout from './hoc/Layout/Layout';
import Aux from './hoc/Aux/Aux';
import AllCoinsBuilder from './containers/AllCoinsBuilder/AllCoinsBuilder';
import * as actions from './store/actions/index';

const asyncWatchlist = asyncComponent(() => {
    return import('./containers/WatchlistBuilder/WatchlistBuilder')
});

const asyncOpenCoin = asyncComponent(() => {
    return import('./containers/OpenCoin/OpenCoin')
});


class App extends Component {
    componentDidMount() {
        this.props.onInitDB();

        setTimeout(() => {
            this.props.onGetCoinsIds()
        }, 5000)
    }

    render() {
        let routes = (
            <Switch>
                <Route
                    path="/watchlist"
                    component={asyncWatchlist}/>
                <Route
                    path="/opencoin/:id"
                    component={asyncOpenCoin}/>
                <Route
                    path="/"
                    exact
                    component={AllCoinsBuilder}/>
                <Redirect to='/'/>
            </Switch>
        );

        return (
            <Aux>
                <Layout>
                    {routes}
                </Layout>
            </Aux>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onInitDB: () => dispatch(actions.initDB()),
        onGetCoinsIds: () => dispatch(actions.getCoinsIds())
    }
};

export default withRouter(connect(null, mapDispatchToProps)(App));
