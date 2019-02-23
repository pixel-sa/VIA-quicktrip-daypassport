from flask import jsonify, request, render_template
from api.app import app
from api import data_service, yelp
import json


@app.route('/')
def index():
    '''
    Returns index.html from react production bundle
    '''
    print('hello')
    return render_template('index.html')


@app.route('/api/test')
def test():
    '''
    returns test data for api test
    '''
    return jsonify({'test': 'API works'})


@app.route('/api/register', methods=['POST'])
def register():
    result = data_service.addUser(request.form)
    return jsonify({'success': result}), 200


@app.route('/api/login', methods=['POST'])
def login():
    result = data_service.loginUser(request.form)
    return jsonify({'success': result['success'], 'token': result['token']}), 200


@app.route('/api/yelp', methods=['POST'])
def yelpRequest():
    data = request.json
    print(data)
    result = yelp.makeYelpRequest(data)
    return jsonify({'yelp': result}), 200
