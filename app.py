import random

import pandas as pd
import requests
from flask import Flask, jsonify, render_template, request
from rapidfuzz import process

app = Flask(__name__)



API_KEY='04c22eaa97494e91a60162355241206'
DATA = pd.read_csv('static/worldcities.csv')


@app.route('/', methods=['GET', 'POST'])
def home():
    return render_template('index.html')


@app.route('/search', methods=['POST'])
def search():
    data = request.json
    text = data['search']
    return jsonify(matches=searchCity(text, DATA['city']), status=200)


def searchCity(name, data):
    # Lets convert it into list as it is faster to search
    cities = data.tolist()
    # Now we will use rapidfuzz to get the best matches for the given name
    matches = process.extract(name, cities, limit=4)
    # We only need the name of the city
    matches = [match[0] for match in matches]
    return matches


@app.route('/weather', methods=['POST'])
def weather():
    data = request.json
    print(data)
    return jsonify(weather=getWeather(data), status=200)

def getWeather(city):
    url = f'http://api.weatherapi.com/v1/current.json?key={API_KEY}&q={city}'
    response = requests.get(url)
    weather = response.json()
    print(weather)
    return weather

@app.route('/location', methods=['GET'])
def get_location():
    try: 
        ip_address = requests.get('https://httpbin.org/ip').json().get('origin')
        city = requests.get(f'https://ipinfo.io/{ip_address}/json').json().get('city')
        return city
    except ConnectionError:
        return 'error'

if __name__ == '__main__':
    app.run(debug=True)
