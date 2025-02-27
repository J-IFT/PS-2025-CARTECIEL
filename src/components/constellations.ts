import { Constellation } from "../types/celestial";

export const CONSTELLATIONS: Record<string, Constellation> = {
  'UMa': {
    id: 'uma',
    name: 'Ursa Major',
    stars: ['Dubhe', 'Merak', 'Phecda', 'Megrez', 'Alioth', 'Mizar', 'Alkaid'],
    lines: [
      ['Dubhe', 'Merak'],
      ['Merak', 'Phecda'],
      ['Phecda', 'Megrez'],
      ['Megrez', 'Alioth'],
      ['Alioth', 'Mizar'],
      ['Mizar', 'Alkaid']
    ]
  },
  'UMi': {
    id: 'umi',
    name: 'Ursa Minor',
    stars: ['Polaris', 'Kochab', 'Pherkad'],
    lines: [
      ['Polaris', 'Kochab'],
      ['Kochab', 'Pherkad']
    ]
  },
  'Ori': {
    id: 'ori',
    name: 'Orion',
    stars: ['Betelgeuse', 'Bellatrix', 'Alnilam', 'Mintaka', 'Rigel', 'Saiph'],
    lines: [
      ['Betelgeuse', 'Bellatrix'],
      ['Bellatrix', 'Alnilam'],
      ['Alnilam', 'Mintaka'],
      ['Mintaka', 'Rigel'],
      ['Rigel', 'Saiph']
    ]
  },
  'Cas': {
    id: 'cas',
    name: 'Cassiopeia',
    stars: ['Schedar', 'Caph', 'Gamma Cas', 'Ruchbah', 'Segin'],
    lines: [
      ['Schedar', 'Caph'],
      ['Caph', 'Gamma Cas'],
      ['Gamma Cas', 'Ruchbah'],
      ['Ruchbah', 'Segin']
    ]
  },
  'Cyg': {
    id: 'cyg',
    name: 'Cygnus',
    stars: ['Deneb', 'Albireo', 'Sadr', 'Gienah', 'Delta Cyg'],
    lines: [
      ['Deneb', 'Albireo'],
      ['Albireo', 'Sadr'],
      ['Sadr', 'Gienah'],
      ['Gienah', 'Delta Cyg']
    ]
  },
  'Leo': {
    id: 'leo',
    name: 'Leo',
    stars: ['Regulus', 'Denebola', 'Algieba', 'Zosma', 'Chort'],
    lines: [
      ['Regulus', 'Denebola'],
      ['Denebola', 'Algieba'],
      ['Algieba', 'Zosma'],
      ['Zosma', 'Chort']
    ]
  },
  'Sco': {
    id: 'sco',
    name: 'Scorpius',
    stars: ['Antares', 'Shaula', 'Dschubba', 'Sargas'],
    lines: [
      ['Antares', 'Shaula'],
      ['Shaula', 'Dschubba'],
      ['Dschubba', 'Sargas']
    ]
  },
  'Tau': {
    id: 'tau',
    name: 'Taurus',
    stars: ['Aldebaran', 'Elnath', 'Hyades', 'Pleiades'],
    lines: [
      ['Aldebaran', 'Elnath'],
      ['Elnath', 'Hyades'],
      ['Hyades', 'Pleiades']
    ]
  },
  'Peg': {
    id: 'peg',
    name: 'Pegasus',
    stars: ['Markab', 'Scheat', 'Algenib', 'Enif'],
    lines: [
      ['Markab', 'Scheat'],
      ['Scheat', 'Algenib'],
      ['Algenib', 'Enif']
    ]
  },
  'Aql': {
    id: 'aql',
    name: 'Aquila',
    stars: ['Altair', 'Tarazed', 'Alshain'],
    lines: [
      ['Altair', 'Tarazed'],
      ['Tarazed', 'Alshain']
    ]
  },
  'Ari': {
    id: 'ari',
    name: 'Aries',
    stars: ['Hamal', 'Sheratan', 'Mesarthim'],
    lines: [
      ['Hamal', 'Sheratan'],
      ['Sheratan', 'Mesarthim']
    ]
  },
  'Vir': {
    id: 'vir',
    name: 'Virgo',
    stars: ['Spica', 'Porrima', 'Vindemiatrix'],
    lines: [
      ['Spica', 'Porrima'],
      ['Porrima', 'Vindemiatrix']
    ]
  },
  'Lib': {
    id: 'lib',
    name: 'Libra',
    stars: ['Zubenelgenubi', 'Zubeneschamali'],
    lines: [
      ['Zubenelgenubi', 'Zubeneschamali']
    ]
  },
  'Cap': {
    id: 'cap',
    name: 'Capricornus',
    stars: ['Deneb Algedi', 'Dabih'],
    lines: [
      ['Deneb Algedi', 'Dabih']
    ]
  },
  'Sag': {
    id: 'sag',
    name: 'Sagittarius',
    stars: ['Kaus Australis', 'Nunki'],
    lines: [
      ['Kaus Australis', 'Nunki']
    ]
  },
  'Pis': {
    id: 'pis',
    name: 'Pisces',
    stars: ['Alrescha'],
    lines: []
  }
};