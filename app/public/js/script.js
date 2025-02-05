// Function to start a process
function openTab(event, tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));

    // Remove active class from all tabs
    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(link => link.classList.remove('active'));

    // Show the clicked tab content
    document.getElementById(tabName).classList.add('active');

    // Add active class to the clicked tab link
    event.currentTarget.classList.add('active');
}

function startProcess() {
    const name = document.getElementById('start-script-name').value;
    const script = document.getElementById('start-script-location').value;
    const args = document.getElementById('args').value.split(','); // Split arguments by commas
    const envVars = document.getElementById('env-vars').value.split(',').reduce((env, pair) => {
        const [key, value] = pair.split('=');
        if (key && value) {
            env[key.trim()] = value.trim();
        }
        return env;
    }, {});

    // Log values for debugging
    console.log('Name:', name);
    console.log('Script:', script);
    console.log('Arguments:', args);
    console.log('Environment Variables:', envVars);

    // Sending a POST request to the /api/start endpoint
    fetch('/api/start', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, script, args, env: envVars }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response:', data);
        alert(data.message || 'Process started successfully');
    })
    .then(() => listProcesses())  // Refresh the list of processes  
    .catch(err => {
        console.error('Error:', err);
        alert('Error starting process');
    });
}

// Function to display the result (success or error)
function displayResult(message) {
    alert(message);  // You can customize this to display in a modal or a dedicated div
}

// Function to stop a process
function stopProcess() {
    const selectedProcess = document.getElementById('stop-process-select').value;
    console.log(selectedProcess);
    
    if (!selectedProcess) {
        displayResult('Please select a process to stop.');
        return;
    }

    fetch(`${API_URL}/api/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: selectedProcess }),  // Sending the selected process
    })
    .then(response => response.json())
    .then(data => displayResult(data.message || data.error))  // Display success or error message
    .then(() => listProcesses())  // Refresh the list of processes  
    .catch(error => displayResult('Error stopping process: ' + error));  // Display error if the fetch fails
}

// Function to restart a process
function restartProcess() {
    const selectedProcess = document.getElementById('restart-process-select').value;
    console.log(selectedProcess);

    if (!selectedProcess) {
        displayResult('Please select a process to restart.');
        return;
    }


    fetch(`${API_URL}/api/restart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: selectedProcess }),  // Sending the selected process
    })
    .then(response => response.json())
    .then(data => displayResult(data.message || data.error))  // Display success or error message
    .then(() => listProcesses())  // Refresh the list of processes  
    .catch(error => displayResult('Error restarting process: ' + error));  // Display error if the fetch fails
    
}


// Function to list running processes
function listProcesses() {
    fetch(`${API_URL}/api/list`)
    .then(response => response.json())
    .then(data => {
        let resultHTML = '<h3>Running Processes:</h3><ul>';
        const stopSelect = document.getElementById('stop-process-select');
        const restartSelect = document.getElementById('restart-process-select');
        stopSelect.innerHTML = '<option value="">Select a process...</option>';
        restartSelect.innerHTML = '<option value="">Select a process...</option>';
        
        data.forEach(process => {
            const option = document.createElement('option');
            option.value = process.name;  // assuming the process has a 'name' field
            option.textContent = process.name;
            stopSelect.appendChild(option);
            restartSelect.appendChild(option.cloneNode(true));  // Same options for both selects
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


window.onload = () => {
    listProcesses();
};