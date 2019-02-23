import React, { Component } from 'react';

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
    state = {};
    render() {
        console.log(this.props.result);
        const { yelp } = this.props.result;
        const directions = this.props.result.directions.length > 0 ? this.props.result.directions[0] : '';
        return (
            <div className="qt-result-group">
                <div className="name">{yelp.name}</div>
                <img src={yelp.image_url} alt={yelp.name} />
                <span className="rating">{yelp.rating}</span>
                <span className="rating-count">{yelp.review_count}</span>
                <span className="pricing">{yelp.price}</span>
                <span className="phone">{yelp.display_phone}</span>
                <a href={yelp.url}>View on Yelp</a>
                <span className="total-distance">{directions.legs[0].distance.text}</span>
                <span className="total-time">{directions.legs[0].duration.text}</span>

                <div className="steps-container">
                    {directions.legs[0].steps.map((step, idx) => (
                        <RouteStep step={step} key={idx} />
                    ))}
                </div>
            </div>
        );
    }
}

export default QuicktripResult;
