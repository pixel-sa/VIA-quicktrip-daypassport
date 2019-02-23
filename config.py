# Load enviroment variables from .env file
from dotenv import load_dotenv
load_dotenv()
import os


# Build DB uri from enviroment variables
db_uri = 'mysql://{0}:{1}@{2}'.format(os.getenv('DB_USER'), os.getenv('DB_PASSWORD'), os.getenv('DB_HOST'))
