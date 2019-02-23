import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from './history';
import AppContext from './AppContext';
import PrivateRoute from './components/privateRoute';
import Index from './components/index';
import NotFound from './components/NotFound';
import Navbar from './components/Navbar';
import Register from './components/register';
import Login from './components/login';
import Account from './components/account';

class App extends Component {
    state = {
        isAuthenticated: false,
        token: '',
        logout: () => this.logout()
    };

    initState = () => {
        const token = sessionStorage.getItem('token') || '';
        const isAuthenticated = token ? true : false;
        this.setState({
            token: token,
            isAuthenticated: isAuthenticated
        });
    };

    login = auth => {
        sessionStorage.setItem('token', auth.token);
        this.initState();
        if (this.state.isAuthenticated) {
            history.push('/account');
        }
    };

    logout = () => {
        history.push('/login');
        sessionStorage.removeItem('token');
        this.initState();
    };

    // PrivateRoute = ({ componenet: Component, ...rest }) => (
    //     <Route
    //         {...rest}
    //         render={props => (this.state.isAuthenticated ? <componenet {...props} /> : <Redirect to="/login" />)}
    //     />
    // );

    render() {
        return (
            <Router history={history}>
                <AppContext.Provider value={this.state}>
                    <React.Fragment>
                        <Navbar />
                        <Switch>
                            <Route exact path="/" component={Index} />
                            <PrivateRoute path="/account" component={Account} isAuthenticated={this.state.isAuthenticated} />
                            <Route path="/register" component={Register} />
                            <Route path="/login" render={() => <Login login={this.login} />} />
                            <Route component={NotFound} />
                        </Switch>
                    </React.Fragment>
                </AppContext.Provider>
            </Router>
        );
    }
}

export default App;
