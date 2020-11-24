# Please install this first
# pip install ip2geotools

import requests
import json
from ip2geotools.databases.noncommercial import DbIpCity

client_IP = '130.231.203.188'
response = DbIpCity.get(client_IP, api_key='free')
print(f'IP address: {response.ip_address}')
print(f'Lattitude: {response.latitude}')
print(f'Longtitude: {response.longitude}')
print(f'City: {response.city}')

api_key = "92984517878f8b07e1cc4aa98152e803"
lat = response.latitude
lon = response.longitude
url = "https://api.openweathermap.org/data/2.5/onecall?lat=%s&lon=%s&appid=%s&units=metric" % (lat, lon, api_key)

response = requests.get(url)
data = json.loads(response.text)
print(data)

with open('weather.json', 'w') as outfile:
    json.dump(data, outfile)