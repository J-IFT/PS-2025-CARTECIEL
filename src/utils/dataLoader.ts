import Papa from 'papaparse';
import { Star } from '../types/celestial';

export async function loadStarData(): Promise<Star[]> {
  try {
    const response = await fetch('/hygdata_v3_trie.csv');
    const text = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          const stars = results.data
            .filter((row: any) => row.id && row.ra && row.dec) // Filtrer les lignes invalides
            .map((row: any) => ({
              id: String(row.id),
              hip: row.hip ? String(row.hip) : undefined,
              hd: row.hd ? String(row.hd) : undefined,
              hr: row.hr ? String(row.hr) : undefined,
              gl: row.gl ? String(row.gl) : undefined,
              bf: row.bf ? String(row.bf) : undefined,
              ra: Number(row.ra),
              dec: Number(row.dec),
              dist: Number(row.dist || 0),
              pmra: row.pmra ? Number(row.pmra) : undefined,
              pmdec: row.pmdec ? Number(row.pmdec) : undefined,
              rv: row.rv ? Number(row.rv) : undefined,
              mag: Number(row.mag || 0),
              absmag: row.absmag ? Number(row.absmag) : undefined,
              spect: row.spect ? String(row.spect) : undefined,
              ci: row.ci ? Number(row.ci) : undefined,
              x: Number(row.x || 0),
              y: Number(row.y || 0),
              z: Number(row.z || 0),
              name: row.proper ? String(row.proper) : undefined,
              constellation: row.con ? String(row.con) : undefined
            }));
          resolve(stars);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error loading star data:', error);
    return [];
  }
}