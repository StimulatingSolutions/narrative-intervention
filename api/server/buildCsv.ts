
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
      } else {
        lineParts.push(cell.toString().replaceAll(/[",]/g, ''));
      }
    }
    csv += lineParts.join(',')+'\r\n';
  }

  return csv;
};
