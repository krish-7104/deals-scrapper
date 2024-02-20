const express = require('express');
const router = express.Router();
const fs = require("fs");


router.get('/log', async (req, res) => {
    try {
        const logContent = fs.readFileSync("./log.txt", "utf-8");
        const logEntries = logContent.split('\n');
        let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Log Viewer</title>
                <style>
                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }
                    th, td {
                        border: 1px solid #dddddd;
                        text-align: left;
                        padding: 8px;
                    }
                    tr:nth-child(even) {
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <h1>Log Viewer</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Active</th>
                            <th>Started</th>
                            <th>Ended</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        for (let i = 0; i < logEntries.length - 1; i++) {
            const parts = logEntries[i].split(" - ");
            const startTime = parts[1].split(" : ")[0];
            const endTime = parts[1].split(" : ")[1];

            html += `<tr>
                        <td>${parts[0]}</td>
                        <td>${startTime}</td>
                        <td>${endTime}</td>
                    </tr>`;
        }
        html += `
       </tbody>
   </table>
</body>
</html>
`;

        res.send(html);
    } catch (error) {
        res.status(500).send('Error retrieving log data');
    }
});

module.exports = router;
