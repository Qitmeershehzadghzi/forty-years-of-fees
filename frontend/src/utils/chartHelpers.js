export const PROGRAMME_COLORS = {
  BBA: '#101C2C', // Deep Navy
  BSCS: '#D6AD60', // Academic Gold
  BSSE: '#426B70', // Teal
  BSIT: '#23865B', // Forest Green
  MBA: '#8C3A3A', // Burgundy
  BSAF: '#4E5D6C', // Slate
  BSMS: '#B87333', // Copper
  BSPSY: '#6B4E71', // Plum
  BSIR: '#2B547E', // Dark Blue
  BSENG: '#788391', // Muted Grey
};

export const COLOR_PALETTE = [
  '#101C2C',
  '#D6AD60',
  '#426B70',
  '#23865B',
  '#8C3A3A',
  '#4E5D6C',
  '#B87333',
  '#6B4E71',
  '#2B547E',
  '#788391',
];

export const getProgrammeColor = (code, index = 0) => {
  return PROGRAMME_COLORS[code] || COLOR_PALETTE[index % COLOR_PALETTE.length];
};
