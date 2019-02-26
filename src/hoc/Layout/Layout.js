import React, {Component} from 'react';
// import {connect} from 'react-redux';
import Aux from '../Aux/Aux';
import classes from './Layout.css';
// import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
// import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {
    // state = {
    //     showSideDrawer: false
    // };
    //
    // sideDrawerCloseHandler = () => {
    //     this.setState({showSideDrawer: !this.state.showSideDrawer})
    // };
    //
    // sideDrawerToggleHandler = () => {
    //     console.log('click')
    //     this.setState((prevState) => {
    //         return {showSideDrawer: !this.state.showSideDrawer}
    //     });
    // };


    render() {
        return (
            <Aux>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        )
    }
}

// const mapStateToProps = state => {
//     return {
//         isAuthenticated: state.auth.token !== null
//     }
// };

//
// function mapStateToProps() {
//
// }

// export default connect(mapStateToProps)(Layout);
export default Layout;