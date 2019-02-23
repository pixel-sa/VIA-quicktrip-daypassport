import React, { Component } from "react";

class Index extends Component {
    state = {
        apiData: ""
    };

    testApi = () => {
        fetch('/api/test')
            .then(response => response.json())
            .then(result => {
                console.log(result)
                this.setState({ apiData: result.test });
            })
    }

    render() {
        return (
            <div className="exampleClass">
                <h1>Hello World</h1>
                <button onClick={this.testApi}>Test API</button>
                <h4>{this.state.apiData}</h4>
            </div>
        );
    }
}

export default Index;
