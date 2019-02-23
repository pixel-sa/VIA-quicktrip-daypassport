# PROJECT-X

## Setup

### To run on local machine

1. Install python backend dependencies by running the following in the root of the project:

```shell
pip install -r requirements.txt
```

2. Create a .env file in the root of the project. You can set this up according to the .env_sample file including in project

3. Set up the database tables with the following command from the root of the project:

```shell
PYTHONPATH=. python build_db.py
```

4. Install javascript dependencies by first changing directories to the client folder then instaling them with:

```shell
cd client
npm install
```

5. The app will need credentials for Yelp api and Google api. There is a .env-sample filen in the root of the project with the required information for the backend, and a /client/src/config-sample.js file that also holds the key for the google places api for the front end address auto complete. Both of these files need to be replicated with out the '-sample' in the file name and the correct credentials entered.

## Running for development

1. Start the flask server by running the following in the root of the project:

```shell
PYTHONPATH=. FLASK_ENV=development FLASK_APP=main.py flask run
```

2. Then in a seperate terminal window or tab start the react development server by changing directories to the client folder then starting the script:

```shell
cd client
npm run start
```

The app should now be accesable through your localhost on port 3000. Both development servers should hot reload anytime changes are made.

## Production set up

1. To deploy you must first build a production build of the react application with the following commands:

```shell
cd client
npm run build
```

The flask app will now serve the react application to the client via the '/' route
