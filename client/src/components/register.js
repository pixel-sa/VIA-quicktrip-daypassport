import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import AppContext from '../AppContext';

const RegisterForm = props => {
    let emailRef = React.createRef();
    let passwordRef = React.createRef();
    let confirmPassRef = React.createRef();

    const handleSubmit = e => {
        e.preventDefault();
        const user = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
            confirmPass: confirmPassRef.current.value
        };
        props.submitForm(user);
    };

    return (
        <form onSubmit={e => handleSubmit(e)}>
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" ref={emailRef} required />
            <label htmlFor="password">Password:</label>
            <input type="password" name="password" ref={passwordRef} required />
            <label htmlFor="confirmPass">Confirm Password:</label>
            <input type="password" name="confirmPass" ref={confirmPassRef} required />
            <button type="submit">Sign Up</button>
        </form>
    );
};

class Register extends Component {
    state = {
        error: ''
    };

    handleSubmit = user => {
        if (user.password === user.confirmPass) {
            this.setState({ error: '' });
            console.log('Same');
            const formData = new FormData();
            formData.append('email', user.email);
            formData.append('password', user.password);
            this.register(formData);
        } else {
            this.setState({ error: 'Passwords MUST match' });
        }
    };

    register = formData => {
        fetch('api/register', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(result => {
                console.log(result);
            })
            .catch(err => console.log(err));
    };

    render() {
        return (
            <div>
                <h1>Sign up here!</h1>
                <RegisterForm submitForm={this.handleSubmit} />
                <div className="error">{this.state.error}</div>
            </div>
        );
    }
}

Register.contextType = AppContext;
export default Register;
