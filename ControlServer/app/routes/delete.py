import requests
import json
from ip2geotools.databases.noncommercial import DbIpCity
from datetime import datetime
import pyowm,random
from pymongo import MongoClient
from bson.json_util import dumps
import sys

client = MongoClient(port=27017)
db = client.iot
city_status = db['aurora-tracker-dev'].find()
for c in city_status:
    print(c)

city_status = db['aurora-tracker-dev'].delete_one({'city':'noormarkku'})
