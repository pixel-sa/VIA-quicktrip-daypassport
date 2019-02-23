import React, { Component } from 'react';

class Account extends Component {
    state = {};
    render() {
        console.log(this.props.isWorking);
        return (
            <div>
                <h1>You are logged in!!</h1>
            </div>
        );
    }
}

export default Account;
