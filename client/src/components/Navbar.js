import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import AppContext from '../AppContext';

class Navbar extends Component {
    state = {};
    render() {
        return (
            <div className="navbar">
                <NavLink exact to="/" activeClassName="active">
                    Home
                </NavLink>
                {this.context.isAuthenticated ? (
                    <React.Fragment>
                        <NavLink to="/account" activeClassName="active">
                            Account
                        </NavLink>
                        <a href="#" onClick={this.context.logout}>
                            Logout
                        </a>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <NavLink to="/register" activeClassName="active">
                            Register
                        </NavLink>
                        <NavLink to="/login" activeClassName="active">
                            Login
                        </NavLink>
                    </React.Fragment>
                )}
            </div>
        );
    }
}

Navbar.contextType = AppContext;
export default Navbar;
