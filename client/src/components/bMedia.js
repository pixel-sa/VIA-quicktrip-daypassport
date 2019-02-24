import React, { Component } from 'react';

class bMedia extends Component {
    render() {
        return (
            <div className="media">
            <img src="img_avatar1.png" className="align-self-center mr-3" style="width:60px"/>
            <div className="media-body">
                <h4>Media Middle</h4>
                <p>Lorem ipsum...</p>
            </div>
            </div>
        );
    }
}

export default bMedia;