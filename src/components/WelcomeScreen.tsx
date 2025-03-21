import React from 'react';

interface WelcomeScreenProps {
  onDismiss: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onDismiss }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-20">
      <div className="bg-white p-8 rounded-lg text-center w-206 shadow-xl">
        <h2 className="text-2xl font-semibold mb-6">Bienvenue sur la carte du ciel 🌌</h2>
        <p className="mb-6 text-lg">Voici comment utiliser cette application pour explorer les étoiles et les planètes :</p>

        <ul className="text-left mb-6 space-y-5 text-lg">
          <li><strong>🔍 Recherche :</strong> Utilisez la barre de recherche pour trouver des étoiles ou des constellations spécifiques.</li>
          <li><strong>🌟 Filtres :</strong> Appliquez des filtres pour voir les étoiles les plus proches, les plus brillantes, les plus grosses, les plus chaudes ou toutes les étoiles visibles.</li>
          <li><strong>🌍 Localisation :</strong> Sélectionnez une ville, mais cette option nécessite également de renseigner la <strong>date</strong> et <strong>heure</strong> pour afficher les étoiles visibles à ce moment-là.</li>
          <li><strong>🌌 Constellations :</strong> Lors du survol d'une étoile, toutes les étoiles de la même constellation seront affichées en rouge.</li>
          <li><strong>🔄 Zoom :</strong> Utilisez les boutons de zoom ou la molette de la souris pour ajuster l'échelle de la carte du ciel.</li>
        </ul>

        <p className="mb-6 text-lg">Cliquez sur "Explorer" pour fermer ce guide et commencer votre exploration ! 🌠</p>

        <button
          onClick={onDismiss}
          className="bg-blue-500 text-white py-3 px-6 rounded-full hover:bg-blue-700 transition duration-300"
        >
          <b>Explorer !</b>
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
