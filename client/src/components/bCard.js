import React, { Component } from 'react';

const RouteStep = props => {
    const { step } = props;
    console.log("****************")
    console.log(step)
    return (
        <div>
            {/* <span className="type">{step.travel_mode}</span> */}   
          
            <span className="direction">{step.html_instructions}</span>
            <p className="text-right"><small>{step.duration.text}</small></p>
            <hr/>
            {/* <span className="distance">{step.distance.text}</span>
            <hr/> */}
            {/* <span className="time">{step.duration.text}</span> */}
        </div>
    );
};

class bCard extends Component {
    createGmapsUrl = directions => {
        console.log("create gmaps url")
        const urlSteps = directions.legs[0]
        const startAddress = urlSteps['start_address']
        const endAddress = urlSteps['end_address']
        const gmapsUrl = "https://www.google.com/maps/dir/?api=1&origin=" + startAddress + "&destination=" + endAddress + "&travelmode=transit&dir_action=navigate"
        return encodeURI(gmapsUrl)

    }

    render() {
        const directions = this.props.directions
        const {yelp} = this.props.yelp
        console.log(directions)
        console.log(directions)

        const cardHeader = {
            backgroundColor: "#c8102e",
            color: "white",
        }

        const placeImg = {
            
            width: "250px",
            borderRadius: "5px",
            display: "inline-block"
            
        }

        const boxShadow = {
            boxShadow: "0 4px 2px -2px rgba(0,0,0,0.2)",
            width: "100rem"

        }

        return (

            <div className="card" style={boxShadow}>
                <div className="card-header" style={cardHeader}>
                    <div className="row">
                        <div className="col-sm text-left">
                            <h3>
                                {yelp.name}
                            </h3>
                        </div>
                        <div className="col-sm text-right">
                            <div className="total-distance">{directions.legs[0].distance.text}</div>
                            <div className="total-time">{directions.legs[0].duration.text}</div>                    
                        </div>
                           
                    </div>
                             
                </div>
               
                <div className="card-body">
                    <div className="row">
                        <div className="col-sm">
                            <img style={placeImg} src={yelp.image_url} alt={yelp.name}/>

                        </div>
                        <div className="col-sm text-left">
                               
                            <span><span style={{color: "orange"}} className="fa fa-star checked"></span> {yelp.rating} ({yelp.review_count} Reviews)</span>
                            <p style={{color: "green", marginLeft:"20px"}} >{yelp.price} </p>
                        
                            <p style={{marginBottom: "0px"}}><span className="fa fa-map-marker" style={{color: "red"}} ></span> {directions.legs[0].end_address} </p>

                            <p><span className="fa fa-phone" style={{color: "red"}} ></span> {yelp.display_phone} </p>
                        
                            {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}

                            <div className>
                                <div style={{backgroundColor:"lightGray"}}>
                                    <span>Route Summary</span>
                                    <span className="pull-right "style={{paddingLeft: "5px"}}>  
                                        <a href={this.createGmapsUrl(directions)} target="_blank" rel="noopener noreferrer">
                                        Start Trip
                                        </a>    
                                    </span>

                                </div>
                                {directions.legs[0].steps.map((step, idx) => (
                                    <RouteStep step={step} key={idx} />
                                ))}
                            </div>





                          
                        </div>

                    </div>
                   
                    {/* <a data-toggle="collapse" href="#collapse-example" aria-expanded="true" aria-controls="collapse-example" id="heading-example" className="collapsed d-block">
                        <i className="fa fa-chevron-down pull-right"></i>
                    </a> */}
                    {/* <button data-toggle="collapse" data-target="#directions" className="btn btn-primary">Go somewhere</button>
                   
              
                    <div id="directions" className="collapse">
                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon
                        officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3
                        wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et.
                        Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan
                        excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt
                        you probably haven't heard of them accusamus labore sustainable VHS.
                    </div> */}
              
                </div>
                        
              

            </div>
           
            
        );
    }
}

export default bCard;