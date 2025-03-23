from flask import Flask, render_template
import mysql.connector
from config1 import db_config

app = Flask(__name__)

def get_country_data():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM Countries WHERE name = %s", ("Египет",))
    country = cursor.fetchone()

    locations = []
    # Если страна найдена, получаем связанные данные из Locations
    if country:
        cursor.execute("""
                SELECT official_name, description, population, official_language, 
                       religion, president, photo, area_km2, capital
                FROM Locations WHERE country_id = %s
            """, (country['country_id'],))
        locations = cursor.fetchall()

    conn.close()
    return country, locations

@app.route('/')
def index():
    country, locations = get_country_data()
    return render_template('шаблон1.html', country=country, locations=locations)

if __name__ == '__main__':
    app.run(debug=True)
