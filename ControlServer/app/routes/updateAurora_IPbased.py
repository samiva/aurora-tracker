# Please install this first
# pip install ip2geotools

import requests
import json
from ip2geotools.databases.noncommercial import DbIpCity
from datetime import datetime
import pyowm,random
from pymongo import MongoClient
import sys

client_IP = sys.argv[1]

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

def AuroraStatus(ipaddress):
    output = {}
    response = DbIpCity.get(ipaddress, api_key='free')
    #print(f'IP address: {response.ip_address}')
    #print(f'Lattitude: {response.latitude}')
    #print(f'Longtitude: {response.longitude}')
    #print(f'City: {response.city}')

    api_key = "92984517878f8b07e1cc4aa98152e803"
    OpenWMap=pyowm.OWM(api_key)                   # Use API key to get data
    Weather=OpenWMap.weather_at_place(response.city)  # give where you need to see the weather
    Data=Weather.get_weather()                   # get out data in the mentioned location

    cloud = Data.get_clouds() # get current cloud
    #print ("Cloud Coverage Percentage : ",cloud) # arint cloud coverage percentage
    magnetic = random.randint(1,3)
    cloud_score = getCloudScore(cloud)
    aurora_status = getAuroraStatus(magnetic, cloud_score)
    time = getTime()
    
    client = MongoClient(port=27017)
    db = client.iot
    city_status = db['aurora-tracker-dev'].find_one({'city':response.city.lower()})
    if(city_status==None):
#        print('Insert new city: {}'.format(response.city))
        db['aurora-tracker-dev'].insert_one({'city':response.city.lower(), 'magnetic':magnetic, 'cloud':cloud_score, 'aurora':aurora_status, 'time':time})
    else:
#        print("Update city status: {}".format(response.city))
        db['aurora-tracker-dev'].update_one({'_id': city_status['_id']},{'$set': {'magnetic':magnetic, 'cloud':cloud_score, 'aurora':aurora_status, 'time':time}})

    # # open data.json and update the current city 
    # with open('data.json') as json_file:
    #     data = json.load(json_file)
    #     found = False
    #     for key in data:
    #         if key == response.city:
    #             found = True
    #             data[key]['magnetic'] = random.randint(1,3)
    #             data[key]['cloud'] = getCloudScore(cloud)
    #             data[key]['aurora'] = getAuroraStatus(data[key]['magnetic'],data[key]['cloud'])
    #             data[key]['time'] = getTime()
    #             output['city'] = response.city
    #             output['color'] = data[key]['aurora']

    # # If there is no city in data.json then create a new one
    # if found is False:
    #     mag_score = random.randint(1,3)
    #     cloud_score = getCloudScore(cloud)
    #     aurora_score = getAuroraStatus(mag_score,cloud_score)

    #     data[response.city] = {
    #             'magnetic': mag_score,
    #             'cloud': cloud_score,
    #             'aurora': aurora_score,
    #             'time': getTime()
    #         }

    #     # Update data.json
    #     a_file = open("data.json", "w")
    #     json.dump(data, a_file)
    #     a_file.close()

    #     output['city'] = response.city
    #     output['color'] = aurora_score
    # return json.dumps(output)
print(AuroraStatus(client_IP))
sys.stdout.flush()
