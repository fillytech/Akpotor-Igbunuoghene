// Search functionality for BVS

let currentPage = 1;
let totalPages = 1;
let currentResults = [];
let currentRecordId = null;

// Initialize search functionality
document.addEventListener('DOMContentLoaded', () => {
    console.log('Search page loaded');
    
    // Set up form submission
    const searchForm = document.getElementById('search-criteria');
    searchForm.addEventListener('submit', handleSearchSubmit);
});

// Handle search form submission
async function handleSearchSubmit(event) {
    event.preventDefault();
    
    const searchParams = {
        name: document.getElementById('search-name').value,
        nationalId: document.getElementById('search-national-id').value,
        caseId: document.getElementById('search-case-id').value,
        modality: document.getElementById('search-modality').value,
        dateFrom: document.getElementById('search-date-from').value,
        dateTo: document.getElementById('search-date-to').value,
        page: currentPage
    };
    
    try {
        // Build query string
        const queryParams = new URLSearchParams();
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value) queryParams.append(key, value);
        });
        
        const response = await fetch(`/api/search?${queryParams}`);
        const data = await response.json();
        
        currentResults = data.results || [];
        totalPages = data.totalPages || 1;
        
        displayResults(currentResults);
        updatePagination();
        
    } catch (error) {
        console.error('Error performing search:', error);
        alert('Error performing search');
    }
}

// Display search results
function displayResults(results) {
    const tableBody = document.getElementById('results-table-body');
    const resultsInfo = document.getElementById('results-info');
    
    tableBody.innerHTML = '';
    resultsInfo.textContent = `Found ${results.length} results`;
    
    if (results.length === 0) {
        resultsInfo.textContent = 'No results found';
        return;
    }
    
    results.forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${result.id}</td>
            <td>${result.first_name} ${result.last_name}</td>
            <td>${result.national_id || 'N/A'}</td>
            <td>${result.modality || 'N/A'}</td>
            <td>${new Date(result.created_at).toLocaleDateString()}</td>
            <td>
                <button onclick="viewRecord(${result.id})">View</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Update pagination controls
function updatePagination() {
    const pageInfo = document.getElementById('page-info');
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    
    // Enable/disable buttons
    document.querySelector('button[onclick="previousPage()"]').disabled = currentPage <= 1;
    document.querySelector('button[onclick="nextPage()"]').disabled = currentPage >= totalPages;
}

// Navigate to previous page
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        document.getElementById('search-criteria').dispatchEvent(new Event('submit'));
    }
}

// Navigate to next page
function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        document.getElementById('search-criteria').dispatchEvent(new Event('submit'));
    }
}

// View record details
async function viewRecord(recordId) {
    currentRecordId = recordId;
    
    try {
        const response = await fetch(`/api/person/${recordId}`);
        const recordData = await response.json();
        
        // Show record details
        document.getElementById('search-results').style.display = 'none';
        document.getElementById('result-details').style.display = 'block';
        
        displayRecordDetails(recordData);
        loadBiometricData(recordId);
        loadAssociatedCases(recordId);
        loadAuditTrail(recordId);
        
    } catch (error) {
        console.error('Error loading record details:', error);
        alert('Error loading record details');
    }
}

// Display record details
function displayRecordDetails(record) {
    const recordInfo = document.getElementById('record-info');
    recordInfo.innerHTML = `
        <p><strong>Name:</strong> ${record.first_name} ${record.last_name}</p>
        <p><strong>National ID:</strong> ${record.national_id || 'N/A'}</p>
        <p><strong>Date of Birth:</strong> ${record.dob || 'N/A'}</p>
        <p><strong>Created:</strong> ${new Date(record.created_at).toLocaleString()}</p>
        <p><strong>Last Updated:</strong> ${new Date(record.updated_at).toLocaleString()}</p>
    `;
}

// Load biometric data
async function loadBiometricData(personId) {
    try {
        const response = await fetch(`/api/person/${personId}/biometrics`);
        const biometrics = await response.json();
        
        const biometricData = document.getElementById('biometric-data');
        biometricData.innerHTML = '';
        
        if (biometrics.length === 0) {
            biometricData.innerHTML = '<p>No biometric data found</p>';
            return;
        }
        
        biometrics.forEach(bio => {
            const bioElement = document.createElement('div');
            bioElement.className = 'biometric-item';
            bioElement.innerHTML = `
                <p><strong>Modality:</strong> ${bio.modality}</p>
                <p><strong>Enrolled:</strong> ${new Date(bio.created_at).toLocaleString()}</p>
                <p><strong>Template:</strong> ${bio.template ? 'Available' : 'Not available'}</p>
            `;
            biometricData.appendChild(bioElement);
        });
    } catch (error) {
        console.error('Error loading biometric data:', error);
    }
}

// Load associated cases
async function loadAssociatedCases(personId) {
    try {
        const response = await fetch(`/api/person/${personId}/cases`);
        const cases = await response.json();
        
        const associatedCases = document.getElementById('associated-cases');
        associatedCases.innerHTML = '';
        
        if (cases.length === 0) {
            associatedCases.innerHTML = '<p>No associated cases found</p>';
            return;
        }
        
        cases.forEach(caseItem => {
            const caseElement = document.createElement('div');
            caseElement.className = 'case-item';
            caseElement.innerHTML = `
                <p><strong>Case ID:</strong> ${caseItem.id}</p>
                <p><strong>Title:</strong> ${caseItem.title}</p>
                <p><strong>Status:</strong> ${caseItem.status}</p>
                <p><strong>Created:</strong> ${new Date(caseItem.created_at).toLocaleString()}</p>
            `;
            associatedCases.appendChild(caseElement);
        });
    } catch (error) {
        console.error('Error loading associated cases:', error);
    }
}

// Load audit trail
async function loadAuditTrail(personId) {
    try {
        const response = await fetch(`/api/person/${personId}/audit`);
        const auditLogs = await response.json();
        
        const auditTrail = document.getElementById('audit-trail');
        auditTrail.innerHTML = '';
        
        if (auditLogs.length === 0) {
            auditTrail.innerHTML = '<p>No audit trail found</p>';
            return;
        }
        
        auditLogs.forEach(log => {
            const logElement = document.createElement('div');
            logElement.className = 'audit-item';
            logElement.innerHTML = `
                <p><strong>Action:</strong> ${log.action}</p>
                <p><strong>Performed by:</strong> User ${log.actor_user_id}</p>
                <p><strong>Date:</strong> ${new Date(log.created_at).toLocaleString()}</p>
                <p><strong>Details:</strong> ${log.meta_json || 'No details'}</p>
            `;
            auditTrail.appendChild(logElement);
        });
    } catch (error) {
        console.error('Error loading audit trail:', error);
    }
}

// Back to search results
function backToResults() {
    document.getElementById('search-results').style.display = 'block';
    document.getElementById('result-details').style.display = 'none';
    currentRecordId = null;
}

// Clear search form
function clearSearch() {
    document.getElementById('search-criteria').reset();
    document.getElementById('results-table-body').innerHTML = '';
    document.getElementById('results-info').textContent = '';
    currentPage = 1;
    totalPages = 1;
}
