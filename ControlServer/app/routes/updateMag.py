import requests
import json
from ip2geotools.databases.noncommercial import DbIpCity
from datetime import datetime
import pyowm,random
from pymongo import MongoClient
from bson.json_util import dumps
import sys


def getAuroraStatus(magnetic,cloud):
    if magnetic == 3 and cloud == 3:
        return 'green'
    elif magnetic == 1 and cloud == 1:
        return 'red'
    else:
        return 'yellow'

def getCloudScore(cloud):
    if cloud <= 30:
        return 3
    elif cloud > 30 and cloud < 50:
        return 2
    else:
        return 1

def getTime():
    now = datetime.now()
    return now.strftime("%d/%m/%Y %H:%M:%S")


client = MongoClient(port=27017)
db = client.iot
city_status = db['aurora-tracker-dev'].find()
city_list = []
for c in city_status:
    city_list.append(c['city'])

for city in city_list:
    city_status = db['aurora-tracker-dev'].find_one({'city':city})
    # Get magnetic randomly
    magnetic = random.randint(1,3)

    # Get cloud based on cloud API
    api_key = "92984517878f8b07e1cc4aa98152e803"
    OpenWMap=pyowm.OWM(api_key)                   # Use API key to get data
    Weather=OpenWMap.weather_at_place(city)  # give where you need to see the weather
    Data=Weather.get_weather()                   # get out data in the mentioned location
    cloud = Data.get_clouds() # get current cloud
    cloud_score = getCloudScore(cloud)

    # Get current time
    time = getTime()
    
    # Get aurora score
    aurora_status = getAuroraStatus(magnetic, cloud_score)

    city_status = db['aurora-tracker-dev'].update_one({'_id': city_status['_id']},{'$set': {'magnetic':magnetic, 'cloud':cloud_score, 'signal':aurora_status, 'time':time}})

city_status = db['aurora-tracker-dev'].find()
for cs in city_status:
    print(cs)

#f=open("log.txt", "a+")
#f.write(f'Last update:{time}')
#f.write("\n")
#f.close()
