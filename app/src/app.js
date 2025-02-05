const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const pm2 = require('pm2');
const fs = require('fs');
const yaml = require('js-yaml');
const { cwd } = require('process');
const app = express(express.json());

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

// Function to recursively search for `run.config.yaml` in directories
const findConfigFiles = (dir) => {
    let configFiles = [];

    // Read the contents of the current directory
    const files = fs.readdirSync(dir);

    // Check each item in the directory
    files.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Recursively search in subdirectories
            configFiles = configFiles.concat(findConfigFiles(fullPath));
        } else if (file === 'run.config.yaml') {
            // Found a run.config.yaml file
            configFiles.push(fullPath);
        }
    });

    return configFiles;
};

// Function to parse the `run.config.yaml` file
const parseConfig = (filePath) => {
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const config = yaml.load(fileContents);
        return config;
    } catch (e) {
        console.error('Error reading or parsing YAML file:', e);
        return null;
    }
};

// Endpoint to get all available configs
app.get('/api/configs', (req, res) => {
    const rootDir = path.join(__dirname, '../'); // Start searching from the root directory
    const configFiles = findConfigFiles(rootDir); // Find all `run.config.yaml` files

    const configs = configFiles.map((filePath) => {
        const config = parseConfig(filePath);
        return config ? {
            path: filePath,
            script: config.script,
            args: config.args || [],
        } : null;
    }).filter(Boolean); // Filter out any null values if there were parsing errors

    res.json(configs);
});

// PM2 process management API routes for starting, stopping, restarting processes
app.post('/api/start', express.json(), (req, res) => {
    const { name, script, args = [], env = {}, stop_exit_codes = [0] } = req.body;
    
    // Log the provided script and parameters
    console.log('Starting script:', script);
    console.log('Process name:', name);
    console.log('Arguments:', args);
    console.log('Environment Variables:', env);

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
    console.log('Restarting process:', name);

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
