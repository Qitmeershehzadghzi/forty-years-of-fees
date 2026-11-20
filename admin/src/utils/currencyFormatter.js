export const formatPKR = (amount, options = {}) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'Rs. 0';
  }

  const num = Number(amount);
  if (options.compact) {
    if (num >= 10000000) {
      return `Rs. ${(num / 10000000).toFixed(2)} Crore`;
    }
    if (num >= 100000) {
      return `Rs. ${(num / 100000).toFixed(2)} Lakh`;
    }
    if (num >= 1000) {
      return `Rs. ${(num / 1000).toFixed(1)}k`;
    }
  }

  return `Rs. ${num.toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;
};

export const formatPercent = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '0.0%';
  const num = Number(val);
  const sign = num > 0 ? '+' : '';
  return `${sign}${num.toFixed(1)}%`;
};
