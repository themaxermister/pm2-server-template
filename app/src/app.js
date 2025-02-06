const express = require('express');
const cors = require('cors')
const path = require('path');
const pm2 = require('pm2');
const app = express(express.json());

app.use(express.json());

// TODO: Add CORS options if necessary
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}

app.use(cors());

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

// PM2 process management API routes for starting, stopping, restarting processes
app.post('/api/start', express.json(), (req, res) => {
    const { name, script, args = [], env = {}, stop_exit_codes = [0] } = req.body;
    console.log('Starting process:', name);
    console.log('Script:', script);
    console.log('Args:', args);
    console.log('Env:', env);

    pm2.start({
        script: script,
        name: name,
        args: args,
        env: env,
        stop_exit_codes: stop_exit_codes
    }, (err, apps) => {
        pm2.disconnect();
        if (err) {
            console.error('Error starting process:', err);
            return res.status(500).json({ error: err.message });
        }

        res.json({ message: `Process ${script} started with args: ${args.join(', ')}` });
    })
});

app.post('/api/stop', (req, res) => {
    const { name } = req.body;
    console.log('Stopping process:', name);

    pm2.stop( name, (err) => {
        if (err) {
            console.error('Error stopping process:', err);
            return res.status(500).json({ error: err.message });
        }

        res.json({ message: `Process ${name} stopped` });
    });
});

app.post('/api/restart', (req, res) => {
    const { name } = req.body;

    pm2.restart(name, (err) => {
        pm2.disconnect();
        if (err) {
            console.error('Error restarting process:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: `Process ${name} restarted` });
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
