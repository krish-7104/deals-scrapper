const fs = require("fs");

const logStart = async (processName) => {
    const currentDate = new Date();
    const startTime = currentDate.toLocaleTimeString();
    const startDate = currentDate.toLocaleDateString();
    console.log(processName + " Started")
    fs.appendFileSync("log.txt", `\n${processName} - ${startDate} ${startTime} : `);
};

const logEnd = async (processName) => {
    const currentDate = new Date();
    const endTime = currentDate.toLocaleTimeString();
    const endDate = currentDate.toLocaleDateString();
    console.log(processName + " Ended")
    fs.appendFileSync("log.txt", `${endDate} ${endTime}`);
};

module.exports = { logStart, logEnd }