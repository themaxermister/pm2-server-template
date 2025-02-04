// app.js
const express = require('express')
const path = require('path');
const pm2 = require('pm2');
const app = express();

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')));

// Serve the HTML file when visiting the root of the app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// PM2 process management API routes
pm2.connect((err) => {
    if (err) {
        console.error('Error connecting to PM2:', err);
        process.exit(2);
    }

    console.log('Connected to PM2');
});

app.post('/api/start', express.json(), (req, res) => {
    const script = req.body.script;
    console.log(script);
    pm2.start({
        script: script,
        name: 'api',
    }, (err, apps) => {
        if (err) {
            console.error('Error starting process:', err);
            return res.status(500).json({ error: err.message });
        }

        res.json({ message: `Process ${script} started` });
    });
});

app.post('/api/stop', (req, res) => {
    pm2.stop('api', (err) => {
        if (err) {
            console.error('Error stopping process:', err);
            return res.status(500).json({ error: err.message });
        }

        res.json({ message: 'Process api stopped' });
    });
});

app.post('/api/restart', (req, res) => {
    pm2.restart('api', (err) => {
        if (err) {
            console.error('Error restarting process:', err);
            return res.status(500).json({ error: err.message });
        }

        res.json({ message: 'Process api restarted' });
    });
});

app.get('/api/list', (req, res) => {
    pm2.list((err, list) => {
        if (err) {
            console.error('Error fetching process list:', err);
            return res.status(500).json({ error: err.message });
        }

        res.json(list);
    });
});

module.exports = app; // Export app for use in server.js
