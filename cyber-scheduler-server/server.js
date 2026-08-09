const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Render-safe in-memory database storage (No disk-write crashes!)
let serverDatabase = { 
    points: 160, 
    history: [] 
};

app.get('/api/profile', (req, res) => {
    res.json(serverDatabase);
});

app.post('/api/complete-session', (req, res) => {
    serverDatabase.points += 20;
    serverDatabase.history.push({ action: "Completed Study Session", timestamp: new Date() });
    res.json({ success: true, newPoints: serverDatabase.points });
});

app.post('/api/claim-reward', (req, res) => {
    const { cost, rewardName } = req.body;
    if (serverDatabase.points >= cost) {
        serverDatabase.points -= cost;
        serverDatabase.history.push({ action: `Claimed: ${rewardName}`, timestamp: new Date() });
        res.json({ success: true, newPoints: serverDatabase.points });
    } else {
        res.status(400).json({ success: false, error: "Insufficient tactical points." });
    }
});

app.listen(PORT, () => console.log(`[SYSTEM RUNTIME] Production Engine online on port ${PORT}`));
