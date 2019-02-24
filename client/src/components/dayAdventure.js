import React, { Component } from 'react';
import Script from 'react-load-script';
import { adventures, timeSelections } from './adventureData';
import { googleApiKey, openWeatherApiKey } from '../config';
import DatePicker from 'react-date-picker';

const AdventureChoice = props => {
    const { name, description, route, destinations } = props.adventure;
    return (
        <div className="choice-group">
            <h4>{name}</h4>
            <p>{description}</p>
            <div className="btn" onClick={() => props.handleAdventureSelection(route)}>
                Select
            </div>
            <h6>Featured destinations:</h6>
            <ul>
                {destinations.map(dest => (
                    <li key={dest.name}>{dest.name}</li>
                ))}
            </ul>
        </div>
    );
};

const AdventureDestination = props => {
    const { name, description, imageUrl, time } = props.adventure;
    return (
        <div className="destination-group">
            <img src={imageUrl} alt={name} />
            <h5>{name}</h5>
            <p>{description}</p>
            <span className="add-dest-btn" onClick={() => props.handleAddDestToRoute(props.adventure)}>
                Add
            </span>
        </div>
    );
};

const AdventureDestAdd = props => {
    const { name, description, imageUrl, time } = props.adventure;
    return (
        <div className="adding-stop-time">
            <img src={imageUrl} alt={name} />
            <h5>{name}</h5>
            <p>{description}</p>
            <p style={{ fontStyle: 'italic' }}>People typically spend {time} minutes here</p>
            <label htmlFor="stopTime">Amount of time to allocate for stop</label>
            <select name="stopTime" id="stopTime" ref={props.stopTimeRef}>
                <option value="">--Select a time</option>
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">60 min</option>
                <option value="90">90 min</option>
                <option value="120">120 min</option>
                <option value="150">150 min</option>
                <option value="180">180 min</option>
            </select>
            <div>
                <div className="btn" onClick={() => props.handleAddCancel()}>
                    Cancel
                </div>
                <div className="btn" onClick={() => props.handleStopTimeSelect()}>
                    Add to Trip
                </div>
            </div>
        </div>
    );
};

const AdventureStop = props => {
    const { name, imageUrl, description, time } = props.adventure;
    return (
        <React.Fragment>
            {props.adventure.direction ? (
                <React.Fragment>
                    {props.adventure.direction.legs[0].steps.map(step => (
                        <div className="step-group">
                            <span className="type">{step.travel_mode}</span>
                            <span className="direction">{step.html_instructions}</span>
                            <span className="distance">{step.distance.text}</span>
                            <span className="time">{step.duration.text}</span>
                        </div>
                    ))}
                    <a
                        href={
                            'https://www.google.com/maps/dir/?api=1&origin=' +
                            props.adventure.direction.legs[0].start_address +
                            '&destination=' +
                            props.adventure.direction.legs[0].end_address +
                            '&travelmode=transit&dir_action=navigate'
                        }
                        target="_blank"
                        className="btn">
                        Open in G Maps
                    </a>
                </React.Fragment>
            ) : null}
            <div className="destination-stop">
                <img src={imageUrl} alt={name} />
                <h5>{name}</h5>
                <p>{description}</p>
                <p>Time allocated: {time} minutes</p>
            </div>
        </React.Fragment>
    );
};

const parseTimeParts = time => {
    let timeParts = time.split(':');
    let hour = parseInt(timeParts[0]);
    let minute = parseInt(timeParts[1].substring(0, 2));
    if (timeParts[1].substring(2, 4) === 'PM') {
        hour += 12;
    }
    return [hour, minute];
};

class DayAdventure extends Component {
    state = {
        tripType: '',
        adventureChoice: {},
        startingLocMethod: '',
        startingLoc: '',
        date: new Date(),
        time: '',
        startTimeSet: false,
        routeStops: [],
        routeComplete: false,
        settingStopTime: false
    };

    startingRef = React.createRef();
    timeRef = React.createRef();
    stopTimeRef = React.createRef();

    tripTypeDisplay = {
        build: 'Build your own',
        choose: 'Choose an Adventure'
    };

    handleTypeSelection = type => {
        this.setState({ tripType: type });
    };

    handleAdventureSelection = route => {
        const choice = adventures.filter(x => x.route === route)[0];
        this.setState({
            adventureChoice: choice,
            startingLocMethod: 'address'
        });
    };

    handleStartingLocMethodSelection = method => {
        this.setState({ startingLocMethod: method });
    };

    handleStartingLocSelection = () => {
        let addressObject = this.autocomplete.getPlace();
        if (addressObject) {
            this.setState({
                startingLoc: addressObject.formatted_address
                // startingLat: addressObject.geometry.location.lat(),
                // startingLng: addressObject.geometry.location.lng()
            });
        }
    };

    handleDateChange = date => {
        if (this.state.time) {
            const timeParts = parseTimeParts(this.state.time);
            date.setHours(timeParts[0]);
            date.setMinutes(timeParts[1]);
        }
        this.setState({ date: date });
    };

    handleTimeChange = () => {
        const timeString = this.timeRef.current.value;
        const timeParts = parseTimeParts(timeString);
        let date = this.state.date;
        date.setHours(timeParts[0]);
        date.setMinutes(timeParts[1]);
        this.setState({
            date: date,
            time: timeString
        });
    };

    handleStartSet = () => {
        if (this.state.time) {
            this.setState({ startTimeSet: true });
        }
    };

    handleAddDestToRoute = destination => {
        this.setState({ settingStopTime: destination });
    };

    handleStopTimeSelect = () => {
        const stopTime = this.stopTimeRef.current.value;
        if (stopTime) {
            console.log(stopTime);
            const destination = this.state.settingStopTime;
            destination.time = stopTime;
            const currentStops = this.state.routeStops;
            currentStops.push(destination);
            let adventure = this.state.adventureChoice;
            adventure.destinations = adventure.destinations.filter(x => x.name !== destination.name);
            console.log(currentStops);
            this.setState({
                routeStops: currentStops,
                settingStopTime: false,
                adventureChoice: adventure
            });
        }
    };

    handleAddCancel = () => {
        this.setState({ settingStopTime: false });
    };

    handleScriptLoad = () => {
        /*global google*/ // To disable any eslint 'google not defined' errors
        this.autocomplete = new google.maps.places.Autocomplete(document.getElementById('startingPoint'));
        this.autocomplete.addListener('place_changed', this.handleStartingLocSelection);
    };

    renderStartingLocMethod = () => {
        const method = this.state.startingLocMethod;
        if (method === 'address') {
            return (
                <React.Fragment>
                    <Script
                        url={'https://maps.googleapis.com/maps/api/js?key=' + googleApiKey + '&libraries=places'}
                        onLoad={this.handleScriptLoad}
                    />
                    <input
                        // onChange={() => this.handleInputChange()}
                        type="text"
                        name="startingPoint"
                        id="startingPoint"
                        ref={this.startingRef}
                        placeholder="Starting Point"
                    />
                </React.Fragment>
            );
        } else if (method === 'pardRide') {
            // render zipcode finder for nearest park and ride
        } else if (method === 'parkDest') {
            //render dest picker for recommended parking locations
        }
    };

    handleCompleteRouteClick = async () => {
        // todo: send request to get results
        this.setState({ routeComplete: true });
        const adventure = this.state.routeStops;
        const data = await this.getDirections(this.state.startingLoc, adventure[0].address, this.state.date.getTime() / 1000);
        adventure[0].direction = data[0];
        this.setState({ routeStops: adventure });
        let newTime = this.state.date.getTime() / 1000;
        newTime += data[0].legs[0].duration.value + adventure[0].time * 60;
        const dataNext = await this.getDirections(adventure[0].address, adventure[1].address, newTime);
        adventure[1].direction = dataNext[0];
        this.setState({ routeStops: adventure });
        // .then(data => {
        //     adventure[0].direction = data
        //     const newTime = this.state.date.getTime / 1000
        //     // newTime += data.
        //     this.getDirections(adventure[0].address, adventure[1].address, )
        // })
    };

    getDirections = (start, stop, time) => {
        return new Promise((resolve, reject) => {
            const bodyParams = JSON.stringify({
                startLoc: start,
                destLoc: stop,
                time: time
            });
            console.log(bodyParams);
            fetch('/api/directions', {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: bodyParams
            })
                .then(response => response.json())
                .then(result => {
                    console.log(result.data);
                    resolve(result.data);
                })
                .catch(err => reject(err));
        });
    };

    render() {
        return (
            <div className="app-group">
                {!this.state.tripType ? (
                    <div className="btn-group">
                        <div className="btn" onClick={() => this.handleTypeSelection('build')}>
                            Build Your Own
                        </div>
                        <div className="btn" onClick={() => this.handleTypeSelection('choose')}>
                            Choose an Adventure
                        </div>
                    </div>
                ) : null}
                {this.state.tripType === 'build' ? (
                    <div>
                        <h3>This feature is comming soon.</h3>
                        <h4>Check back later for updates!</h4>
                    </div>
                ) : null}
                {this.state.tripType === 'choose' && !this.state.adventureChoice.name ? (
                    <React.Fragment>
                        <div className="selected-group">
                            <div className="btn selected">{this.tripTypeDisplay[this.state.tripType]}</div>
                        </div>
                        <div className="adventure-choices">
                            {adventures.map(adventure => (
                                <AdventureChoice
                                    adventure={adventure}
                                    key={adventure.route}
                                    handleAdventureSelection={this.handleAdventureSelection}
                                />
                            ))}
                        </div>
                    </React.Fragment>
                ) : null}
                {this.state.adventureChoice.name && !this.state.startingLocMethod ? (
                    <React.Fragment>
                        <div className="selected-group">
                            <div className="btn selected">{this.tripTypeDisplay[this.state.tripType]}</div>
                            <div className="btn selected">{this.state.adventureChoice.name}</div>
                        </div>
                        <h3>Where would you like to start?</h3>
                        <div className="btn-group">
                            <div className="btn" onClick={() => this.handleStartingLocMethodSelection('address')}>
                                Enter an address
                            </div>
                            <div className="btn" onClick={() => this.handleStartingLocMethodSelection('parkRide')}>
                                Nearest Park & Ride
                            </div>
                            <div className="btn" onClick={() => this.handleStartingLocMethodSelection('pareDest')}>
                                Park at featured destination
                            </div>
                        </div>
                    </React.Fragment>
                ) : null}
                {this.state.startingLocMethod && !this.state.startingLoc ? (
                    <React.Fragment>
                        <div className="selected-group">
                            <div className="btn selected">{this.tripTypeDisplay[this.state.tripType]}</div>
                            <div className="btn selected">{this.state.adventureChoice.name}</div>
                        </div>
                        <h3>Where would you like to start?</h3>
                        {this.renderStartingLocMethod()}
                    </React.Fragment>
                ) : null}
                {this.state.startingLoc && !this.state.startTimeSet ? (
                    <React.Fragment>
                        <div className="selected-group">
                            <div className="btn selected">{this.tripTypeDisplay[this.state.tripType]}</div>
                            <div className="btn selected">{this.state.adventureChoice.name}</div>
                        </div>
                        <h5>Starting from: {this.state.startingLoc}</h5>
                        <h3>When do you want to start your adventure?</h3>
                        <div className="date-select-group">
                            <DatePicker onChange={this.handleDateChange} value={this.state.date} clearIcon={null} />
                            <select name="time" id="time" ref={this.timeRef} onChange={this.handleTimeChange}>
                                <option value="">--Select a time--</option>
                                {timeSelections.map(time => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                            <div className="btn" onClick={this.handleStartSet}>
                                Set start time
                            </div>
                        </div>
                    </React.Fragment>
                ) : null}
                {this.state.startTimeSet ? (
                    <React.Fragment>
                        <div className="selected-group">
                            <div className="btn selected">{this.tripTypeDisplay[this.state.tripType]}</div>
                            <div className="btn selected">{this.state.adventureChoice.name}</div>
                        </div>
                        <h5>
                            Starting from: {this.state.startingLoc} on {this.state.date.toLocaleDateString()} @ {this.state.time}
                        </h5>
                        {this.state.routeStops.length > 0 ? (
                            <React.Fragment>
                                {this.state.routeStops.map(stop => (
                                    <AdventureStop adventure={stop} />
                                ))}
                                {!this.state.routeComplete ? (
                                    <div className="btn complete-btn" onClick={() => this.handleCompleteRouteClick()}>
                                        Complete Adventure
                                    </div>
                                ) : null}
                            </React.Fragment>
                        ) : null}
                        {!this.state.routeComplete ? (
                            <React.Fragment>
                                <h4 style={{ marginTop: '40px' }}>Add a destination</h4>
                                <div className="adventure-destination-cntr">
                                    {this.state.settingStopTime ? (
                                        <AdventureDestAdd
                                            adventure={this.state.settingStopTime}
                                            stopTimeRef={this.stopTimeRef}
                                            handleStopTimeSelect={this.handleStopTimeSelect}
                                            handleAddCancel={this.handleAddCancel}
                                        />
                                    ) : (
                                        this.state.adventureChoice.destinations.map(adventure => (
                                            <AdventureDestination
                                                adventure={adventure}
                                                key={adventure.name}
                                                handleAddDestToRoute={this.handleAddDestToRoute}
                                            />
                                        ))
                                    )}
                                </div>
                            </React.Fragment>
                        ) : null}
                    </React.Fragment>
                ) : null}
            </div>
        );
    }
}

export default DayAdventure;
