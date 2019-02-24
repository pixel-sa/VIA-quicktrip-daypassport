import React, { Component } from 'react';
import QuickTrip from './quickTrip';
import DayAdventure from './dayAdventure';
import { Link } from 'react-router-dom';

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
        const mainHeader = {
            // backgroundColor: "#c8102e",
            color: 'white',
            height: '250px',
            background: '-webkit-linear-gradient(86deg, rgb(228, 16, 41), rgb(98, 10, 10))',
            background: 'linear-gradient(86deg, rgb(228, 16, 41), rgb(98, 10, 10))',
            marginBottom: '50px'
        };

        const quickTripButton = {
            backgroundColor: 'white'
        };
        const dayTripButton = {
            backgroundColor: 'white'
        };

        return (
            <div>
                <div className="row" style={{ padding: '20px' }}>
                    <div className="col-sm">
                        <div>
                            <Link to="/home">
                                <img src="../images/Main-Logo.png" alt="" style={{ width: '50px' }} />
                            </Link>
                            Adventures
                        </div>
                    </div>
                </div>
                <div className="container-fluid" style={mainHeader}>
                    <div className="row" style={{ paddingTop: '75px' }}>
                        <div className="col-sm" style={{ paddingLeft: '100px' }}>
                            <h1>
                                ADVENTURE <br /> AWAITS
                            </h1>
                        </div>

                        <div className="col-sm">
                            {!this.state.tripType ? (
                                <div className="row">
                                    <div className="col-sm">
                                        <div className="btn" onClick={() => this.handleTripTypeSelection('quick')} style={quickTripButton}>
                                            <i className="fa fa-bus" style={{ paddingRight: '5px' }} />
                                            Quick Trip
                                        </div>
                                    </div>

                                    <div className="col-sm">
                                        <div className="btn" onClick={() => this.handleTripTypeSelection('day')} style={dayTripButton}>
                                            <i className="fa fa-compass" style={{ paddingRight: '5px' }} />
                                            Day Trip
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="btn selected">{this.state.tripType === 'quick' ? 'Quick Trip' : 'Day Trip'}</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="row" />

                <div className="row">{this.state.tripType ? this.renderTripPlannerByType() : null}</div>
            </div>
        );
    }
}

export default Index;
