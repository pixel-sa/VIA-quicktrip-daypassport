import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

class PrivateRoute extends Component {
    render() {
        const { component: Component, isAuthenticated, ...rest } = this.props;
        if (isAuthenticated) {
            return <Component {...rest} />;
        } else {
            return <Redirect to="/login" />;
        }
    }
}

export default withRouter(PrivateRoute);
