import React, { Component } from 'react';
import Card from './bCard'

const RouteStep = props => {
    const { step } = props;
    return (
        <div className="step-group">
            <span className="type">{step.travel_mode}</span>
            <span className="direction">{step.html_instructions}</span>
            <span className="distance">{step.distance.text}</span>
            <span className="time">{step.duration.text}</span>
        </div>
    );
};

class QuicktripResult extends Component {
    state = {
        showDetails: false
    };

    createGmapsUrl = directions => {
        console.log("create gmaps url")
        const urlSteps = directions.legs[0]
        const startAddress = urlSteps['start_address']
        const endAddress = urlSteps['end_address']
        const gmapsUrl = "https://www.google.com/maps/dir/?api=1&origin=" + startAddress + "&destination=" + endAddress + "&travelmode=transit&dir_action=navigate"
        return encodeURI(gmapsUrl)

    }
    
    render() {
        const { yelp } = this.props.result;
        const directions = this.props.result.directions.length > 0 ? this.props.result.directions[0] : '';

        return (
            <div className="qt-result-group">
                <div className="row">
                <Card yelp={this.props.result} directions={this.props.result.directions.length > 0 ? this.props.result.directions[0] : ''}></Card>

                </div>



                {/* <div className="qt-location-details">
                    <img src={yelp.image_url} alt={yelp.name} />
                    <h3>{yelp.name}</h3>
                    <div className="qt-details-group">
                        <div className="rating">
                            {yelp.rating}
                            <span className="small-badge"> ({yelp.review_count})</span>
                        </div>
                        <span className="pricing">{yelp.price}</span>
                    </div>
                    <div className="qt-details-group">
                        <div className="total-distance">{directions.legs[0].distance.text}</div>
                        <div className="total-time">{directions.legs[0].duration.text}</div>
                    </div>
                    {this.state.showDetails ? (
                        <div className="qt-details-group">
                            <div className="address">{yelp.location.display_address[0]}</div>
                            <div className="phone">{yelp.display_phone}</div>
                            <a href={yelp.url} target="_blank" rel="noopener noreferrer">
                                View on Yelp
                            </a>
                        </div>
                    ) : null}
                </div> */}

                {/* <div className="btn-group">
                    <button
                        className="btn"
                        onClick={() => {
                            this.setState({ showDetails: !this.state.showDetails });
                        }}>
                        {this.state.showDetails ? 'Hide Details' : 'Show Details'}
                    </button>

                    {this.state.showDetails ? (
                        <a className="btn" href={this.createGmapsUrl(directions)} target="_blank" rel="noopener noreferrer">
                            Open in G Maps
                        </a>
                       
                    ) : null}
                </div> */}

                {/* {this.state.showDetails ? (
                    <div className="steps-container">
                        {directions.legs[0].steps.map((step, idx) => (
                            <RouteStep step={step} key={idx} />
                        ))}
                    </div>
                ) : null} */}
            </div>
        );
    }
}

export default QuicktripResult;
