const fs = require('fs');
const readline = require('readline');

const readStream = fs.createReadStream('./Crimes_-_2001_to_present.csv');

const rl = readline.createInterface({
  input: readStream
});

const primaryType = 'Primary Type',
    year = 'Year',
    description = 'Description',
    under500 = '$500 AND UNDER',
    above500 = 'OVER $500',
    crimeTheft = 'THEFT',
    taskLabel = 'data munging';

let headerList = [],
    rowCount = false,
    resultJSON = {},
    crimeTypeIndex,
    yearIndex,
    descriptionIndex,
    rowData = [];

rl.on('line', (input) => {
    if (!rowCount) {
        console.time(taskLabel);
        headerList = input.split(',');
        crimeTypeIndex = headerList.indexOf(primaryType);
        yearIndex = headerList.indexOf(year);
        descriptionIndex = headerList.indexOf(description);
        rowCount = true;
    } else {
        rowData = input.split(',');

        if (rowData[crimeTypeIndex] === crimeTheft &&
            rowData[yearIndex] && !isNaN(rowData[yearIndex]) &&
            rowData[yearIndex] >= 2001 && rowData[yearIndex] <= 2018) {

            if (!resultJSON[rowData[yearIndex]]) {
                resultJSON[rowData[yearIndex]] = {
                    "theftBelow500": 0,
                    "theftAbove500": 0
                };
            }

            if (rowData[descriptionIndex] === under500) {
                resultJSON[rowData[yearIndex]].theftBelow500 += 1;
            } else if (rowData[descriptionIndex] === above500) {
                resultJSON[rowData[yearIndex]].theftAbove500 += 1;
            }
        }
    }
}).on('close', () => {
    console.timeEnd(taskLabel);
    fs.writeFile('./crimes.json', JSON.stringify(resultJSON), (err) => {
        if (err) {
            console.log('Error in writing the file:', err);
        } else {
            console.log('File written');
        }
    });
});
