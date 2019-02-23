import React, { Component } from 'react';

const LoginForm = props => {
    let usernameRef = React.createRef();
    let passwordRef = React.createRef();

    const handleSubmit = e => {
        e.preventDefault();
        const user = {
            username: usernameRef.current.value,
            password: passwordRef.current.value
        };
        props.submitForm(user);
    };

    return (
        <form onSubmit={e => handleSubmit(e)}>
            <label htmlFor="username">Username:</label>
            <input type="text" name="username" ref={usernameRef} required />
            <label htmlFor="password">Password:</label>
            <input type="password" name="password" ref={passwordRef} required />
            <button type="submit">Login</button>
        </form>
    );
};

class Login extends Component {
    state = {
        error: false
    };

    handleSubmit = user => {
        const formData = new FormData();
        formData.append('username', user.username);
        formData.append('password', user.password);
        fetch('api/login', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(result => {
                console.log(result);
                if (result && result.success) {
                    this.setState({ error: false });
                    this.props.login(result);
                } else {
                    this.setState({ error: true });
                }
            });
    };

    render() {
        return (
            <div>
                <h1>Login here</h1>
                {this.state.error ? <span className="error">Login Failed. Please try again.</span> : null}
                <LoginForm submitForm={this.handleSubmit} />
                <div className="error">{this.state.error}</div>
            </div>
        );
    }
}

export default Login;
