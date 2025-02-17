export interface Star {
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
  name?: string;
  constellation?: string;
}

export interface Planet {
  id: string;
  name: string;
  ra: number;
  dec: number;
  magnitude: number;
  distance: number;
  color: string;
  description?: string;
}

export interface Constellation {
  id: string;
  name: string;
  stars: string[];
  lines: [string, string][];
}