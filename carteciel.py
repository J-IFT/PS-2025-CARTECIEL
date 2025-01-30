from flask import Flask, render_template
import pandas as pd
import plotly.graph_objects as go
import numpy as np

app = Flask(__name__)

# Chargement des données des étoiles depuis le fichier CSV
data = pd.read_excel('hygdata_v3_trie.xlsx')

# Conversion des distances de parsecs en années-lumière
data['distance_ly'] = data['dist'] * 3.262

# Filtrer les étoiles visibles à l’œil nu (magnitude < 6)
stars_visible = data[data['mag'] < 6]

# Sélectionner les 50 étoiles les plus proches de la Terre
stars_nearest = stars_visible.nsmallest(50, 'distance_ly')

# Sélectionner les 50 étoiles les plus brillantes (magnitude la plus faible)
stars_brightest = stars_visible.nsmallest(50, 'mag')

# Simuler les planètes du système solaire avec leurs positions fictives
planets = {
    'Mercure': {'x': 0.4, 'y': 0.2},
    'Vénus': {'x': 0.7, 'y': 0.3},
    'Terre': {'x': 1.0, 'y': 0.5},
    'Mars': {'x': 1.5, 'y': 0.7},
}

@app.route('/')
def index():
    # Création de la carte du ciel avec Plotly
    fig = go.Figure()

    # Fonction pour créer un espacement circulaire autour du centre (x=0, y=0)
    def polar_to_cartesian(radius, angle):
        return radius * np.cos(angle), radius * np.sin(angle)

    # Ajouter les étoiles les plus proches
    for _, star in stars_nearest.iterrows():
        angle = np.random.uniform(0, 2 * np.pi)
        radius = star['distance_ly'] / 100  # La distance est réduite pour un meilleur affichage
        x, y = polar_to_cartesian(radius, angle)
        fig.add_trace(go.Scatter(
            x=[x], 
            y=[y], 
            mode='markers', 
            name=star['hip'], 
            marker=dict(color='white', size=6, symbol='circle'),
            text=f"Nom: {star['hip']}<br>Distance: {star['distance_ly']} ly<br>Magnitude: {star['mag']}",
            hoverinfo='text'
        ))

    # Ajouter les étoiles les plus brillantes
    for _, star in stars_brightest.iterrows():
        angle = np.random.uniform(0, 2 * np.pi)
        radius = star['distance_ly'] / 100  # La distance est réduite pour un meilleur affichage
        x, y = polar_to_cartesian(radius, angle)
        fig.add_trace(go.Scatter(
            x=[x], 
            y=[y], 
            mode='markers', 
            name=star['hip'], 
            marker=dict(color='white', size=6, symbol='circle'),
            text=f"Nom: {star['hip']}<br>Magnitude: {star['mag']}",
            hoverinfo='text'
        ))

    # Ajouter les planètes du système solaire
    for planet, position in planets.items():
        fig.add_trace(go.Scatter(
            x=[position['x']], 
            y=[position['y']], 
            mode='markers', 
            name=planet,
            marker=dict(color='yellow', size=10, symbol='circle'),
            text=f"{planet}",
            hoverinfo='text'
        ))

    # Configuration de la carte
    fig.update_layout(
        title="Carte du Ciel",
        xaxis_title="Position X",
        yaxis_title="Position Y",
        showlegend=True,
        plot_bgcolor='darkblue',  # Fond bleu foncé pour simuler le ciel
        xaxis=dict(showgrid=False, zeroline=False, scaleanchor="y", range=[-2, 2]),  # Limiter l'affichage pour un cercle
        yaxis=dict(showgrid=False, zeroline=False, range=[-2, 2]),  # Limiter l'affichage pour un cercle
        autosize=False,
        width=800,  # Taille de l'affichage pour une bonne forme circulaire
        height=800,  # Taille de l'affichage pour une bonne forme circulaire
        margin=dict(l=10, r=10, t=40, b=40),  # Ajuster les marges pour un affichage plus serré
        shapes=[
            # Ajouter une forme circulaire
            dict(
                type='circle',
                x0=-2, x1=2, y0=-2, y1=2,
                line=dict(color='white', width=2)
            ),
        ]
    )

    # Convertir la figure Plotly en HTML
    graph_html = fig.to_html(full_html=False)

    return render_template('index.html', graph_html=graph_html)

if __name__ == "__main__":
    app.run(debug=True)
