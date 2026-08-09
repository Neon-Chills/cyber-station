const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DB_FILE = path.join(__dirname, 'database.json');

// Initialize permanent database file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ points: 160, history: [] }, null, 2));
}

function readDB() {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/profile', (req, res) => {
    res.json(readDB());
});

app.post('/api/complete-session', (req, res) => {
    let db = readDB();
    db.points += 20;
    db.history.push({ action: "Completed Study Session", timestamp: new Date() });
    writeDB(db);
    res.json({ success: true, newPoints: db.points });
});

app.post('/api/claim-reward', (req, res) => {
    const { cost, rewardName } = req.body;
    let db = readDB();
    if (db.points >= cost) {
        db.points -= cost;
        db.history.push({ action: `Claimed: ${rewardName}`, timestamp: new Date() });
        writeDB(db);
        res.json({ success: true, newPoints: db.points });
    } else {
        res.status(400).json({ success: false, error: "Insufficient tactical points." });
    }
});

app.listen(PORT, () => console.log(`[SYSTEM RUNTIME] Production Engine online on port ${PORT}`));
