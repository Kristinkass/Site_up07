import base64
from flask import Flask, render_template, redirect, url_for
import mysql.connector
from config1 import db_config

app = Flask(__name__, template_folder='templates', static_folder='static')

@app.template_filter('b64encode')
def b64encode_filter(data):
    return None

def get_country_data(country_name):
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM Countries WHERE name = %s", (country_name,))
    country = cursor.fetchone()

    if not country:
        conn.close()
        return None

    # Инициализация всех данных
    data = {
        'country': country,
        'locations': [],
        'flags': {},
        'coatsofarms': {},
        'cities': [],
        'history': [],
        'historicalFigures': [],
        'artists': [],
        'scientists': [],
        'celebrities': [],
        'crafts': [],
        'musicalinstruments': [],
        'dances': [],
        'literature': [],
        'cuisine': [],
        'landmarks': [],
        'travelersinfo': [],
        'facts': [],
        'tests': {},
        'background_photo': country.get('photo')  # Добавляем фото фона
    }

    # Получаем все связанные данные
    queries = [
        ("SELECT official_name, description, population, official_language, religion, president, photo, area_km2, capital FROM Locations WHERE country_id = %s", 'locations'),
        ("SELECT name, photo FROM cities WHERE country_id = %s", 'cities'),
        ("SELECT information, photo FROM flags WHERE country_id = %s", 'flags'),
        ("SELECT description, photo FROM coatsofarms WHERE country_id = %s", 'coatsofarms'),
        ("SELECT event, description FROM history WHERE country_id = %s", 'history'),
        ("SELECT full_name, lifespan, information, photo FROM famouspeople WHERE country_id = %s AND type_id = 1", 'historicalFigures'),
        ("SELECT full_name, lifespan, information, photo FROM famouspeople WHERE country_id = %s AND type_id = 2", 'artists'),
        ("SELECT full_name, lifespan, information, photo FROM famouspeople WHERE country_id = %s AND type_id = 3", 'scientists'),
        ("SELECT full_name, lifespan, information, photo FROM famouspeople WHERE country_id = %s AND type_id = 4", 'celebrities'),
        ("SELECT name, description, photo FROM crafts WHERE country_id = %s", 'crafts'),
        ("SELECT name, photo, information FROM musicalinstruments WHERE country_id = %s", 'musicalinstruments'),
        ("SELECT name, description, photo FROM dances WHERE country_id = %s", 'dances'),
        ("SELECT name, description, photo FROM literature WHERE country_id = %s", 'literature'),
        ("SELECT cuisine_description, ingredients, dish_name, dish_description, dish_photo FROM cuisine WHERE country_id = %s", 'cuisine'),
        ("SELECT name, description, photo FROM landmarks WHERE country_id = %s", 'landmarks'),
        ("SELECT behavior, communication, dress_code, taboos, etiquette, phrases FROM travelersinfo WHERE country_id = %s", 'travelersinfo'),
        ("SELECT information FROM facts WHERE country_id = %s", 'facts'),
        ("SELECT test_link FROM Tests WHERE country_id = %s", 'tests')
    ]

    for query, key in queries:
        cursor.execute(query, (country['country_id'],))
        if key in ['flags', 'coatsofarms', 'tests']:
            data[key] = cursor.fetchone() or {}
        else:
            data[key] = cursor.fetchall()

    conn.close()
    return data

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/country/<country_name>')
def country_page(country_name):
    country_data = get_country_data(country_name)
    
    if not country_data:
        return redirect(url_for('index'))
    
    return render_template('country/layout.html', **country_data)

# Маршруты для конкретных стран
@app.route('/egypt')
def egypt():
    return country_page('Египет')

@app.route('/turkey')
def turkey():
    return country_page('Турция')

@app.route('/uk')
def uk():
    return country_page('Великобритания')

@app.route('/usa')
def usa():
    return country_page('США')

@app.route('/france')
def france():
    return country_page('Франция')

@app.route('/russia')
def russia():
    return country_page('Россия')

@app.route('/china')
def china():
    return country_page('Китай')

@app.route('/japan')
def japan():
    return country_page('Япония')

@app.route('/spain')
def spain():
    return country_page('Испания')

@app.route('/uae')
def uae():
    return country_page('ОАЭ')

@app.route('/india')
def india():
    return country_page('Индия')

@app.route('/mexico')
def mexico():
    return country_page('Мексика')

@app.route('/australia')
def australia():
    return country_page('Австралия')

@app.route('/brazil')
def brazil():
    return country_page('Бразилия')

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=8080)