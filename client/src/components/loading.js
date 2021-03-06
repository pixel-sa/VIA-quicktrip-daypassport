import React, { Component } from 'react';

class LoadingAnimation extends Component {
    state = {
        going: false
    };

    componentDidMount() {
        setTimeout(() => {
            this.setState({ going: true });
        }, 100);
    }

    render() {
        const loaderClasses = this.state.going ? 'loader go' : 'loader';
        return (
            <div className="loading-container">
                <div className={loaderClasses}>
                    <img src="../images/busIcon.png" alt=""/>
                </div>
            </div>
        );
    }
}

export default LoadingAnimation;
