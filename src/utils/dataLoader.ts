import Papa from 'papaparse';
import { Star } from '../types/celestial';

interface StarDataRow {
  id: string;
  hip?: string;
  hd?: string;
  hr?: string;
  gl?: string;
  bf?: string;
  ra: number;
  dec: number;
  dist: number;
  pmra?: number;
  pmdec?: number;
  rv?: number;
  mag: number;
  absmag?: number;
  spect?: string;
  ci?: number;
  x: number;
  y: number;
  z: number;
  proper?: string;
  con?: string;
}

export async function loadStarData(): Promise<Star[]> {
  try {
    const response = await fetch('/hygdata_v3_trie.csv');
    const text = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse<StarDataRow>(text, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          const stars = results.data
            .filter((row) => row.id && row.ra && row.dec) // Filtrer les lignes invalides
            .map((row) => ({
              id: String(row.id),
              hip: row.hip ? String(row.hip) : undefined,
              hd: row.hd ? String(row.hd) : undefined,
              hr: row.hr ? String(row.hr) : undefined,
              gl: row.gl ? String(row.gl) : undefined,
              bf: row.bf ? String(row.bf) : undefined,
              ra: row.ra,
              dec: row.dec,
              dist: row.dist || 0,
              pmra: row.pmra,
              pmdec: row.pmdec,
              rv: row.rv,
              mag: row.mag || 0,
              absmag: row.absmag,
              spect: row.spect,
              ci: row.ci,
              x: row.x || 0,
              y: row.y || 0,
              z: row.z || 0,
              name: row.proper ? String(row.proper) : undefined,
              constellation: row.con ? String(row.con) : undefined,
            }));
          resolve(stars);
        },
        error: (error: Error) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error('Error loading star data:', error);
    return [];
  }
}