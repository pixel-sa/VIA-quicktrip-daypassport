import React, { Component } from 'react';
import Script from 'react-load-script';
import { googleApiKey, openWeatherApiKey } from '../config';
import QuicktripResult from './quicktripResult';
import LoadingAnimation from './loading';

const subTypes = {
    food: ['Suprise Me', 'American', 'Burgers', 'Chinese', 'Mexican', 'Pizza', 'Sandwiches', 'Sushi'],
    drink: ['Suprise Me', 'Coffee', 'Juice & Smoothies', 'Beer Garden', 'Cocktail Bar', 'Lounges', 'Sports Bar', 'Wine Bar'],
    explore: ['Suprise Me', 'Shopping', 'Tours', 'Fitness', 'Wineries', 'Farms', 'Arts', 'Fashion', 'Nightlife', 'Active', 'Festivals']
};

class QuickTrip extends Component {
    state = {
        // searchVal: '',
        startingLoc: '',
        tripType: '',
        subType: '',
        priceRange: 0,
        startingLat: '',
        startingLng: '',
        currentTemp: 0,
        weatherDescription: '',
        resultData: [],
        roundTrip: false,
        lunchTime: 0
    };

    startingRef = React.createRef();
    sortingRef = React.createRef();

    tripTypeDisplay = {
        food: 'Get Food',
        drink: 'Grab a Drink',
        explore: 'Explore Nearby'
    };

    priceRangeDisplay = {
        1: '$',
        2: '$$',
        3: '$$$',
        4: '$$$$'
    };

    // https://developers.google.com/maps/documentation/geocoding/intro#reverse-example
    // TODO: reverse geocoding to formatted address??
    // componentDidMount = () => {
    //     if (navigator.geolocation) {
    //         console.log('Geolocation is supported!');
    //         navigator.geolocation.getCurrentPosition(
    //             function success(position){
    //                 console.log(position.coords.latitude)
    //                 console.log(position.coords.longitude)
    //                 this.setState({startingLat: position.coords.latitude, startingLng: position.coords.longitude})
    //             },
    //             function error(error){
    //                 console.log("error looking up location")
    //                 console.log(error)
    //             }

    //         );
    //       }

    //       else {
    //         console.log('Geolocation is not supported for this Browser/OS.');
    //       }
    // }

    handleSortChange = () => {
        const type = this.sortingRef.current.value;
        let sortedData = [];
        if (type === 'distance') {
            sortedData = this.state.resultData.sort((a, b) => {
                if (a.directions[0].legs[0].distance.value > b.directions[0].legs[0].distance.value) {
                    return 1;
                } else {
                    return -1;
                }
            });
        } else if (type === 'rating') {
            sortedData = this.state.resultData.sort((a, b) => {
                if (a.yelp.rating < b.yelp.rating) {
                    return 1;
                } else {
                    return -1;
                }
            });
        } else if (type === 'duration') {
            sortedData = this.state.resultData.sort((a, b) => {
                if (a.directions[0].legs[0].duration.value > b.directions[0].legs[0].duration.value) {
                    return 1;
                } else {
                    return -1;
                }
            });
        } else if (type === 'review_count') {
            sortedData = this.state.resultData.sort((a, b) => {
                if (a.yelp.review_count < b.yelp.review_count) {
                    return 1;
                } else {
                    return -1;
                }
            });
        }
        this.setState({ resultData: sortedData });
    };

    handleSelection = () => {
        let addressObject = this.autocomplete.getPlace();
        if (addressObject) {
            this.setState({
                startingLoc: addressObject.formatted_address,
                startingLat: addressObject.geometry.location.lat(),
                startingLng: addressObject.geometry.location.lng()
            });
        }
        this.getWeather(this.state.startingLat, this.state.startingLng);
    };

    handleScriptLoad = () => {
        /*global google*/ // To disable any eslint 'google not defined' errors
        this.autocomplete = new google.maps.places.Autocomplete(document.getElementById('startingPoint'));
        this.autocomplete.addListener('place_changed', this.handleSelection);
    };

    selectTripType = type => {
        this.setState({ tripType: type });
    };

    selectPrice = price => {
        this.setState({ priceRange: price });
    };

    selectSubType = subType => {
        this.setState({ subType: subType }, () => {
            this.callYelp('3', '0');
            this.callYelp('7', '3');
        });
    };

    handleRoundTrip = event => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ roundTrip: value, lunchTime: 0 });
    };

    getWeather = (lat, lng) => {
        const openWeatherUrl =
            'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&units=imperial&APPID=' + openWeatherApiKey;
        fetch(openWeatherUrl)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                this.setState({
                    currentTemp: result.main.temp,
                    weatherDescription: result.weather.length > 0 ? result.weather[0]['main'] : ''
                });
            });
    };

    callYelp = (limit, offset) => {
        let yelpBody = JSON.stringify({
            price: this.state.priceRange,
            startingLat: this.state.startingLat,
            startingLng: this.state.startingLng,
            subType: this.state.subType === 'Suprise Me' ? '' : this.state.subType,
            tripType: this.state.tripType,
            startingLoc: this.state.startingLoc,
            currentTemp: this.state.currentTemp,
            weatherDescription: this.state.weatherDescription,
            limit: limit,
            offset: offset
        });

        fetch('api/yelp', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: yelpBody
        })
            .then(response => response.json())
            .then(result => {
                console.log(result);
                const resultData = [...this.state.resultData, ...result.yelp];
                this.setState({
                    resultData: resultData
                });
            })
            .catch(err => console.log('oops', err));
    };

    setLunchTime = event => {
        console.log(event);
        this.setState({ lunchTime: event.target.value });
    };

    render() {
        return (
            <div className="app-group">
                {!this.state.startingLoc ? (
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
                ) : (
                    <React.Fragment>
                        <h4>Starting From: {this.state.startingLoc}</h4>
                        <label>
                            Round Trip:
                            <input name="roundTrip" type="checkbox" checked={this.state.roundTrip} onChange={this.handleRoundTrip} />
                        </label>
                    </React.Fragment>
                )}
                {this.state.roundTrip ? (
                    <React.Fragment>
                        {/* <p>How Long?</p>
                        <select class="form-control">
                            <option value="one">15 minutes</option>
                            <option value="two">30 minutes</option>
                            <option value="two">45 minutes</option>
                            <option value="two">60 minutes</option>
                        </select> */}
                        <form>
                            <label>
                                How Long:
                                <select className="form-control" onChange={this.setLunchTime}>
                                    <option value="" disabled defaultValue>
                                        Select Time
                                    </option>
                                    <option value="15">15 minutes</option>
                                    <option value="30">30 minutes</option>
                                    <option value="45">45 minutes</option>
                                    <option value="60">60 minutes</option>
                                </select>
                            </label>
                        </form>
                    </React.Fragment>
                ) : null}

                {this.state.startingLoc && !this.state.tripType ? (
                    <React.Fragment>
                        <h3>What would you like to do?</h3>
                        <div className="btn-group">
                            <div className="btn" onClick={() => this.selectTripType('food')}>
                                Grab Food
                            </div>
                            <div className="btn" onClick={() => this.selectTripType('drink')}>
                                Get a Drink
                            </div>
                            <div className="btn" onClick={() => this.selectTripType('explore')}>
                                Explore Nearby
                            </div>
                        </div>
                    </React.Fragment>
                ) : null}

                {this.state.tripType && !this.state.priceRange ? (
                    <React.Fragment>
                        <div className="selected-group">
                            <div className="btn selected">{this.tripTypeDisplay[this.state.tripType]}</div>
                        </div>
                        <h3>Select a price group</h3>
                        <div className="btn-group">
                            <div className="btn" onClick={() => this.selectPrice(1)}>
                                $
                            </div>
                            <div className="btn" onClick={() => this.selectPrice(2)}>
                                $$
                            </div>
                            <div className="btn" onClick={() => this.selectPrice(3)}>
                                $$$
                            </div>
                            <div className="btn" onClick={() => this.selectPrice(4)}>
                                $$$$
                            </div>
                        </div>
                    </React.Fragment>
                ) : null}
                {this.state.priceRange && !this.state.subType ? (
                    <React.Fragment>
                        <div className="selected-group">
                            <div className="btn selected">{this.tripTypeDisplay[this.state.tripType]}</div>
                            <div className="btn selected">{this.priceRangeDisplay[this.state.priceRange]}</div>
                        </div>
                        <h3>Preference type</h3>
                        <div className="btn-group">
                            {subTypes[this.state.tripType].map(type => (
                                <div key={type} onClick={() => this.selectSubType(type)} className="btn">
                                    {type}
                                </div>
                            ))}
                        </div>
                    </React.Fragment>
                ) : null}
                {this.state.subType ? (
                    <React.Fragment>
                        <div className="selected-group">
                            <div className="btn selected">{this.tripTypeDisplay[this.state.tripType]}</div>
                            <div className="btn selected">{this.priceRangeDisplay[this.state.priceRange]}</div>
                            <div className="btn selected">{this.state.subType}</div>
                        </div>
                        <h3>Results</h3>
                        {/* <input type="radio" name="sort" value="distance" onChange={() => this.handleSortChange('distance')} /> Distance */}
                        {/* <input type="radio" name="sort" value="rating" onChange={() => this.handleSortChange('rating')} /> Rating */}

                        {this.state.resultData.length > 0 ? (
                            <React.Fragment>
                                <label htmlFor="sort">Sort By: </label>
                                <select name="sort" id="sort" ref={this.sortingRef} onChange={() => this.handleSortChange()}>
                                    <option value="">--Select A Sort--</option>
                                    <option value="distance">Distance</option>
                                    <option value="duration">Duration</option>
                                    <option value="rating">Rating</option>
                                    <option value="review_count">Review Count</option>
                                </select>
                            </React.Fragment>
                        ) : null}

                        {this.state.resultData.length > 0 ? (
                            this.state.resultData.map(result => <QuicktripResult result={result} key={result.yelp.id} />)
                        ) : (
                            <LoadingAnimation />
                        )}
                    </React.Fragment>
                ) : null}
            </div>
        );
    }
}

export default QuickTrip;
