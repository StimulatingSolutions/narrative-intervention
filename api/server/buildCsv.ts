
export const buildCsv = function (dataset: any[], columns?: string[]) {
  if (!columns) {
    columns = Object.keys(dataset[0]);
  }
  let csv: string = columns.join(',')+'\r\n';

  for (let row of dataset) {
    let lineParts: string[] = [];
    for (let column of columns) {
      let cell = row[column];
      if (typeof cell === 'boolean') {
        lineParts.push(cell ? '1' : '0');
      } else if (cell == null) {
        lineParts.push('');
      } else {
        lineParts.push(cell.toString().replace(/[",]/g, ''));
      }
    }
    csv += lineParts.join(',')+'\r\n';
  }

  return csv;
};
