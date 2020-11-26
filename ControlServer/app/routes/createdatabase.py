import json

# Rules
# magnetic score can be 1, 2, 3. 3 means that the magnetic activity is strong (highest chance to see aurora)
# cloud score can be 1, 2, 3. 3 means that there are not much cloud in the sky so aurora is visible.
# if both magnetic and cloud score are 3 then aurora score is 3 (green)
# if both magnetic and cloud score are 1 then aurora score is 1 (red)
# the rest is 2 (yellow)

data = {}
data['Oulu'] = {
    'magnetic': 1,
    'cloud': 0,
    'aurora': ''
}

with open('data.json', 'w') as outfile:
    json.dump(data, outfile)
