export const parseCSV = (csvContent) => {
  const lines = csvContent.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) {
    throw new Error('CSV must contain at least a header row and one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    // Split taking quotes into account
    const values = [];
    let insideQuotes = false;
    let currentValue = '';

    for (let charIndex = 0; charIndex < rawLine.length; charIndex++) {
      const char = rawLine[charIndex];
      if (char === '"' || char === "'") {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim().replace(/^["']|["']$/g, ''));
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim().replace(/^["']|["']$/g, ''));

    if (values.length === headers.length) {
      const rowObj = {};
      headers.forEach((header, idx) => {
        rowObj[header] = values[idx];
      });
      rows.push(rowObj);
    }
  }

  return rows;
};

export const exportToCSV = (headers, data, fieldMapping) => {
  const headerLine = headers.join(',');
  const rowLines = data.map(item => {
    return fieldMapping.map(field => {
      let val = item[field];
      if (val === undefined || val === null) val = '';
      const strVal = String(val).replace(/"/g, '""');
      return strVal.includes(',') ? `"${strVal}"` : strVal;
    }).join(',');
  });

  return [headerLine, ...rowLines].join('\n');
};
