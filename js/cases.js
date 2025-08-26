// Case management functionality for BVS

let currentCaseId = null;

// Initialize case management
document.addEventListener('DOMContentLoaded', () => {
    console.log('Case management page loaded');
    loadCases();
    
    // Set up form submission
    const caseForm = document.getElementById('case-form');
    caseForm.addEventListener('submit', handleCaseSubmit);
});

// Handle case form submission
async function handleCaseSubmit(event) {
    event.preventDefault();
    
    const title = document.getElementById('case-title').value;
    const description = document.getElementById('case-description').value;
    const status = document.getElementById('case-status').value;
    
    try {
        const response = await fetch('/api/case', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, status })
        });
        
        if (response.ok) {
            alert('Case created successfully');
            document.getElementById('case-form').reset();
            loadCases();
        } else {
            alert('Failed to create case');
        }
    } catch (error) {
        console.error('Error creating case:', error);
        alert('Error creating case');
    }
}

// Load all cases
async function loadCases() {
    try {
        const response = await fetch('/api/cases');
        const cases = await response.json();
        
        const tableBody = document.getElementById('cases-table-body');
        tableBody.innerHTML = '';
        
        cases.forEach(caseItem => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${caseItem.id}</td>
                <td>${caseItem.title}</td>
                <td>${caseItem.status}</td>
                <td>${new Date(caseItem.created_at).toLocaleDateString()}</td>
                <td>
                    <button onclick="viewCase(${caseItem.id})">View</button>
                    <button onclick="editCase(${caseItem.id})">Edit</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading cases:', error);
    }
}

// View case details
async function viewCase(caseId) {
    try {
        const response = await fetch(`/api/case/${caseId}`);
        const caseData = await response.json();
        
        currentCaseId = caseId;
        
        // Show case details
        document.getElementById('cases-list').style.display = 'none';
        document.getElementById('case-details').style.display = 'block';
        
        const caseInfo = document.getElementById('case-info');
        caseInfo.innerHTML = `
            <p><strong>Title:</strong> ${caseData.title}</p>
            <p><strong>Status:</strong> ${caseData.status}</p>
            <p><strong>Description:</strong> ${caseData.description || 'No description'}</p>
            <p><strong>Created:</strong> ${new Date(caseData.created_at).toLocaleString()}</p>
            <p><strong>Updated:</strong> ${new Date(caseData.updated_at).toLocaleString()}</p>
        `;
        
        loadCaseTimeline(caseId);
    } catch (error) {
        console.error('Error loading case details:', error);
    }
}

// Load case timeline
async function loadCaseTimeline(caseId) {
    try {
        const response = await fetch(`/api/case/${caseId}/timeline`);
        const timeline = await response.json();
        
        const timelineElement = document.getElementById('case-timeline');
        timelineElement.innerHTML = '';
        
        timeline.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'timeline-event';
            eventElement.innerHTML = `
                <p><strong>${event.action}</strong> - ${new Date(event.created_at).toLocaleString()}</p>
                <p>${event.meta_json || ''}</p>
            `;
            timelineElement.appendChild(eventElement);
        });
    } catch (error) {
        console.error('Error loading timeline:', error);
    }
}

// Add case note
async function addCaseNote() {
    if (!currentCaseId) return;
    
    const note = document.getElementById('case-note').value;
    if (!note.trim()) {
        alert('Please enter a note');
        return;
    }
    
    try {
        const response = await fetch(`/api/case/${currentCaseId}/note`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ note })
        });
        
        if (response.ok) {
            alert('Note added successfully');
            document.getElementById('case-note').value = '';
            loadCaseTimeline(currentCaseId);
        } else {
            alert('Failed to add note');
        }
    } catch (error) {
        console.error('Error adding note:', error);
        alert('Error adding note');
    }
}

// Add case attachment
async function addCaseAttachment() {
    if (!currentCaseId) return;
    
    const fileInput = document.getElementById('case-attachment');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a file');
        return;
    }
    
    const formData = new FormData();
    formData.append('attachment', file);
    
    try {
        const response = await fetch(`/api/case/${currentCaseId}/attach`, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            alert('Attachment added successfully');
            fileInput.value = '';
            loadCaseTimeline(currentCaseId);
        } else {
            alert('Failed to add attachment');
        }
    } catch (error) {
        console.error('Error adding attachment:', error);
        alert('Error adding attachment');
    }
}

// Edit case
async function editCase(caseId) {
    // Implementation for editing case details
    alert('Edit case functionality will be implemented');
}

// Back to cases list
function backToCasesList() {
    document.getElementById('cases-list').style.display = 'block';
    document.getElementById('case-details').style.display = 'none';
    currentCaseId = null;
}
