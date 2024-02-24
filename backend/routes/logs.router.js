const express = require('express');
const router = express.Router();
const fs = require("fs");

router.get("/reset-log", async (req, res) => {
    try {
        fs.writeFileSync("log.txt", "")
        res.send("Log File Reset");
    } catch (error) {
        console.log(error)
        res.status(500).send(error);

    }
})

router.get('/log', async (req, res) => {
    try {
        const logContent = fs.readFileSync("./log.txt", "utf-8");
        const logEntries = logContent.split('\n').splice(1);
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
                    .success{
                        background-color:#22c55e;
                        color:white;
                        text-align:center;
                    }
                    .failure{
                        background-color:#f43f5e;
                        color:white;
                        text-align:center;
                    }
                </style>
            </head>
            <body>
                <h1>Log Viewer</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Activity</th>
                            <th>Started</th>
                            <th>Ended</th>
                            <th>Success</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        for (let i = 0; i < logEntries.length - 1; i++) {
            const parts = logEntries[i]?.split(" - ");
            const startTime = parts[1]?.split(" : ")[0];
            const endTime = parts[1]?.split(" : ")[1];

            if (!endTime) {
                html += `<tr>
                <td>${parts[0]}</td>
                <td>${startTime}</td>
                <td>${endTime}</td>
                <td class="failure">False</td>
                </tr>`;
            } else {
                html += `<tr>
                <td>${parts[0]}</td>
                <td>${startTime}</td>
                <td>${endTime}</td>
                <td class="success">True</td>
                </tr>`;
            }
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
