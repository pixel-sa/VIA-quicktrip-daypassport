import React, { Component } from 'react';
import QuickTrip from './quickTrip';
import DayAdventure from './dayAdventure';

class Index extends Component {
    state = {
        tripType: ''
    };

    handleTripTypeSelection = type => {
        this.setState({ tripType: type });
    };

    renderTripPlannerByType = () => {
        if (this.state.tripType === 'quick') {
            return <QuickTrip />;
        } else if (this.state.tripType === 'day') {
            return <DayAdventure />;
        }
    };

    render() {
        return (
            <div>
                {!this.state.tripType ? (
                    <div className="btn-group">
                        <div className="btn" onClick={() => this.handleTripTypeSelection('quick')}>
                            Quick Trip
                        </div>
                        <div className="btn" onClick={() => this.handleTripTypeSelection('day')}>
                            Day Trip
                        </div>
                    </div>
                ) : (
                    <div className="btn selected">{this.state.tripType === 'quick' ? 'Quick Trip' : 'Day Trip'}</div>
                )}
                {this.state.tripType ? this.renderTripPlannerByType() : null}
            </div>
        );
    }
}

export default Index;
