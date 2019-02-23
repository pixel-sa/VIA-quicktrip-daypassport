import json
import pprint
import requests
import sys
import os
import googlemaps
from datetime import datetime

YELP_API_KEY= os.getenv("YELP_API_KEY")
GOOGLE_API_KEY= os.getenv("GOOGLE_API_KEY")
ENDPOINT = "https://api.yelp.com/v3/businesses/search"
HEADERS = {'Authorization': 'bearer %s' % YELP_API_KEY}
# PARAMETERS = {'term': 'coffee', 'limit' : 3, 'radius': 1000, 'location': 'San Antonio'}

#TODO update parameters... to be dynamic

def makeYelpRequest(data):
    print("make yelp request")

    PARAMETERS = {
        # This is in meters
        "radius": 10000,
        "limit" : 2,
        "price" : data['price'],
        "term" : data['subType'],
        # "latitude": data['startingLat'],
        # "longitude": data ['startingLng']
        "location": data['startingLoc']
    }
    print(PARAMETERS)

    response = requests.get(url = ENDPOINT, params=PARAMETERS, headers=HEADERS)

    #TODO: CHECK RESPONSE, if 200, return, if error, return error code

    business_data = response.json()
    print(business_data)
    print(type(business_data))

    yelp_object = []
    for business in business_data['businesses'][0:1]:
        business_name = business['name']
        address = business['location']['address1']
        city = business['location']['city']
        state = business['location']['state']
        zip_code = business['location']['zip_code']
        full_address = address + " " + city + " " + state + " " + zip_code
        print(full_address)

        gmaps = googlemaps.Client(key=GOOGLE_API_KEY)

    
        now = datetime.now()
        directions_result = gmaps.directions(data['startingLoc'],
                                            full_address,
                                            mode="transit",
                                            departure_time=now)

        yelp_object.append({"yelp": business, "directions": directions_result})

    return yelp_object

