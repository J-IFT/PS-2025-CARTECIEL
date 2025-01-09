import pandas as pd

# Charger ton fichier Excel
df = pd.read_excel('hygdata_v3_trie.xlsx')

# Afficher les premières lignes pour vérifier
print(df.head())
