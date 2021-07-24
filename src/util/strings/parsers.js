export const parseTextToRows = (text) => {
  const rows = text.split('\n');
  
  return rows.map(row => row.trim());
};
