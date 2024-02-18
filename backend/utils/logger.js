const fs = require("fs");

const logStart = async (processName) => {
    const currentDate = new Date();
    const startTime = currentDate.toLocaleTimeString();
    const startDate = currentDate.toLocaleDateString();
    console.log(processName + " Started")
    fs.appendFileSync("log.txt", `${startDate} ${startTime} : ${processName} Started\n`);
};

const logEnd = async (processName) => {
    const currentDate = new Date();
    const endTime = currentDate.toLocaleTimeString();
    const endDate = currentDate.toLocaleDateString();
    console.log(processName + " Ended")
    fs.appendFileSync("log.txt", `${endDate} ${endTime} : ${processName} Ended\n`);
};

module.exports = { logStart, logEnd }