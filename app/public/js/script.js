// Function to start a process
function startProcess() {
    const scriptName = document.getElementById('start-script').value
    fetch(`${API_URL}/api/start`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ script: scriptName }),
    })
    .then(response => response.json())
    .then(data => displayResult(data.message || data.error))
    .catch(error => displayResult('Error starting process: ' + error));
}

// Function to stop a process
function stopProcess() {
    fetch(`${API_URL}/api/stop`, {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => displayResult(data.message || data.error))
    .catch(error => displayResult('Error stopping process: ' + error));
}

// Function to restart a process
function restartProcess() {
    fetch(`${API_URL}/api/restart`, {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => displayResult(data.message || data.error))
    .catch(error => displayResult('Error restarting process: ' + error));
}

// Function to list running processes
function listProcesses() {
    fetch(`${API_URL}/api/list`)
    .then(response => response.json())
    .then(data => {
        let resultHTML = '<h3>Running Processes:</h3><ul>';
        data.forEach(process => {
            resultHTML += `<li>${process.name} - ${process.pm2_env.status}</li>`;
        });
        resultHTML += '</ul>';
        displayResult(resultHTML);
    })
    .catch(error => displayResult('Error fetching processes: ' + error));
}

// Function to display result
function displayResult(message) {
    document.getElementById('result').innerHTML = `<p>${message}</p>`;
}
