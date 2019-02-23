import os
from sqlalchemy import create_engine
from config import db_uri

# Initialize a db connection
mysql_engine = create_engine(db_uri)
# Create Database if it does not already exist
mysql_engine.execute(
    'CREATE DATABASE IF NOT EXISTS {0}'.format(os.getenv('DB_NAME')))
# Import app and db instance and create tables from models
from api.app import app, db
with app.app_context():
    db.create_all()
