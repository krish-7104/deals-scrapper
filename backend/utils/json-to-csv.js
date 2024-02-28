const fs = require('fs');
const { parse } = require('json2csv');
const csvFilePath = 'output.csv';

const convertDataToCSV = async (req, res) => {
    try {
        const amazonData = JSON.parse(fs.readFileSync("./amazon.json"));
        const flipkartData = JSON.parse(fs.readFileSync("./flipkart.json"));
        const myntraData = JSON.parse(fs.readFileSync("./myntra.json"));
        const ajioData = JSON.parse(fs.readFileSync("./ajio.json"));
        const meeshoData = JSON.parse(fs.readFileSync("./meesho.json"));

        let dealsData = [...amazonData, ...flipkartData, ...myntraData, ...ajioData, ...meeshoData];

        const uniqueDealsSet = new Set();
        dealsData.forEach(deal => uniqueDealsSet.add(deal.link));
        dealsData = Array.from(uniqueDealsSet).map(link => dealsData.find(deal => deal.link === link));

        const csvData = parse(dealsData);

        fs.writeFile(csvFilePath, csvData, (err) => {
            if (err) {
                console.error('Error writing CSV file:', err);
                return;
            }
            res.download(csvFilePath);
            console.log('CSV file saved successfully:', csvFilePath);

        });
    } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        res.send("Error")
    }
}

module.exports = convertDataToCSV