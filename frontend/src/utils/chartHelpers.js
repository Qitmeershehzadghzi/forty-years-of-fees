export const PROGRAMME_COLORS = {
  BBA: '#0F5C4E',
  BSCS: '#2F7F6F',
  BSSE: '#6AA393',
  BSIT: '#B7791F',
  MBA: '#8C5A2B',
  BSAF: '#3B5D7A',
  BSMS: '#A15C4A',
  BSPSY: '#6B4E71',
  BSIR: '#4E6B57',
  BSENG: '#64748B',
};

export const COLOR_PALETTE = [
  '#0F5C4E',
  '#2F7F6F',
  '#6AA393',
  '#B7791F',
  '#8C5A2B',
  '#3B5D7A',
  '#A15C4A',
  '#6B4E71',
  '#4E6B57',
  '#64748B',
];

export const getProgrammeColor = (code, index = 0) => {
  return PROGRAMME_COLORS[code] || COLOR_PALETTE[index % COLOR_PALETTE.length];
};
