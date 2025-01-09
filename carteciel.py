from flask import Flask, render_template
import folium
from folium.plugins import MarkerCluster
import pandas as pd

app = Flask(__name__)

@app.route('/')
def home():
    # Charger le fichier Excel avec les données des étoiles
    df = pd.read_excel('hygdata_v3_trie.xlsx')

    # Filtrer les étoiles visibles à l’œil nu (par exemple, magnitude < 6)
    df_visible = df[df['mag'] <= 6]

    # Trier par distance (en années-lumière) et sélectionner les 50 étoiles les plus proches
    df_nearest_50 = df_visible.nsmallest(50, 'dist')

    # Créer une carte avec Folium centrée sur la Terre
    m = folium.Map(location=[0, 0], zoom_start=2)

    # Ajouter un marker cluster pour regrouper les étoiles proches
    marker_cluster = MarkerCluster().add_to(m)

    # Ajouter les étoiles visibles sur la carte
    for idx, row in df_nearest_50.iterrows():
        folium.Marker(
            location=[row['dec'], row['ra']],  # Déclinaison et ascension droite
            popup=f"{row['proper']} - Distance: {row['dist']} LY",
        ).add_to(marker_cluster)

    # Sauvegarder la carte dans un fichier HTML temporaire
    map_path = "templates/sky_map.html"
    m.save(map_path)

    # Rendre le fichier HTML dans la page web
    return render_template('sky_map.html')

if __name__ == '__main__':
    app.run(debug=True)