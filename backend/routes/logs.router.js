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
                            <th>Time Taken</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        for (let log of logEntries) {
            html += `<tr>
                        <td>${log.split(" : ")[0]}</td>
                        <td>${log.split(" : ")[1]}</td>`
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
