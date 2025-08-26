// Admin panel functionality for BVS

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
    console.log('Admin panel loaded');
    
    // Set up form submissions
    const userForm = document.getElementById('user-form');
    userForm.addEventListener('submit', handleUserCreate);
    
    const systemForm = document.getElementById('system-form');
    systemForm.addEventListener('submit', handleSystemSave);
    
    // Load initial data
    loadUsers();
    loadSystemStatus();
    loadAuditLogs();
});

// Tab navigation
function showAdminTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.admin-tab-content');
    tabs.forEach(tab => tab.style.display = 'none');
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).style.display = 'block';
    
    // Load tab-specific data
    switch(tabName) {
        case 'users':
            loadUsers();
            break;
        case 'system':
            loadSystemStatus();
            break;
        case 'audit':
            loadAuditLogs();
            break;
    }
}

// Handle user creation
async function handleUserCreate(event) {
    event.preventDefault();
    
    const email = document.getElementById('user-email').value;
    const password = document.getElementById('user-password').value;
    const role = document.getElementById('user-role').value;
    
    try {
        const response = await fetch('/api/admin/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, role })
        });
        
        if (response.ok) {
            alert('User created successfully');
            document.getElementById('user-form').reset();
            loadUsers();
        } else {
            alert('Failed to create user');
        }
    } catch (error) {
        console.error('Error creating user:', error);
        alert('Error creating user');
    }
}

// Load all users
async function loadUsers() {
    try {
        const response = await fetch('/api/admin/users');
        const users = await response.json();
        
        const tableBody = document.getElementById('users-table-body');
        tableBody.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                    <button onclick="editUser(${user.id})">Edit</button>
                    <button onclick="deleteUser(${user.id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Edit user
async function editUser(userId) {
    try {
        const response = await fetch(`/api/admin/user/${userId}`);
        const user = await response.json();
        
        // Show edit form (simplified)
        const newRole = prompt('Enter new role (officer, analyst, admin):', user.role);
        if (newRole && ['officer', 'analyst', 'admin'].includes(newRole)) {
            const updateResponse = await fetch(`/api/admin/user/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role: newRole })
            });
            
            if (updateResponse.ok) {
                alert('User updated successfully');
                loadUsers();
            } else {
                alert('Failed to update user');
            }
        }
    } catch (error) {
        console.error('Error editing user:', error);
        alert('Error editing user');
    }
}

// Delete user
async function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            const response = await fetch(`/api/admin/user/${userId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('User deleted successfully');
                loadUsers();
            } else {
                alert('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user');
        }
    }
}

// Handle system settings save
async function handleSystemSave(event) {
    event.preventDefault();
    
    const sdkMode = document.getElementById('sdk-mode').checked;
    const retentionDays = document.getElementById('retention-days').value;
    const maxFileSize = document.getElementById('max-file-size').value;
    
    try {
        const response = await fetch('/api/admin/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sdkMode, retentionDays, maxFileSize })
        });
        
        if (response.ok) {
            alert('Settings saved successfully');
        } else {
            alert('Failed to save settings');
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        alert('Error saving settings');
    }
}

// Load system status
async function loadSystemStatus() {
    try {
        const response = await fetch('/api/admin/status');
        const status = await response.json();
        
        document.getElementById('db-status').textContent = status.database ? 'Connected' : 'Disconnected';
        document.getElementById('storage-status').textContent = status.storage || 'N/A';
        document.getElementById('active-users').textContent = status.activeUsers || 0;
        document.getElementById('uptime').textContent = status.uptime || 'N/A';
    } catch (error) {
        console.error('Error loading system status:', error);
        document.getElementById('db-status').textContent = 'Error';
    }
}

// Generate export
async function generateExport() {
    const format = document.getElementById('export-format').value;
    const dateFrom = document.getElementById('export-date-from').value;
    const dateTo = document.getElementById('export-date-to').value;
    
    const selectedTypes = [];
    document.querySelectorAll('input[name="export-type"]:checked').forEach(checkbox => {
        selectedTypes.push(checkbox.value);
    });
    
    if (selectedTypes.length === 0) {
        alert('Please select at least one data type to export');
        return;
    }
    
    const exportProgress = document.getElementById('export-progress');
    exportProgress.style.display = 'block';
    
    try {
        const response = await fetch('/api/admin/export', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                format,
                dateFrom,
                dateTo,
                types: selectedTypes
            })
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bvs-export-${new Date().toISOString().split('T')[0]}.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            alert('Export generated successfully');
        } else {
            alert('Failed to generate export');
        }
    } catch (error) {
        console.error('Error generating export:', error);
        alert('Error generating export');
    } finally {
        exportProgress.style.display = 'none';
    }
}

// Load audit logs
async function loadAuditLogs() {
    const search = document.getElementById('audit-search').value;
    const userId = document.getElementById('audit-user').value;
    const date = document.getElementById('audit-date').value;
    
    try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (userId) queryParams.append('userId', userId);
        if (date) queryParams.append('date', date);
        
        const response = await fetch(`/api/admin/audit?${queryParams}`);
        const logs = await response.json();
        
        const tableBody = document.getElementById('audit-table-body');
        tableBody.innerHTML = '';
        
        logs.forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(log.created_at).toLocaleString()}</td>
                <td>User ${log.actor_user_id}</td>
                <td>${log.action}</td>
                <td>${log.entity}</td>
                <td>${log.meta_json || 'No details'}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading audit logs:', error);
    }
}

// Load user options for audit filter
async function loadUserOptions() {
    try {
        const response = await fetch('/api/admin/users');
        const users = await response.json();
        
        const userSelect = document.getElementById('audit-user');
        userSelect.innerHTML = '<option value="">All Users</option>';
        
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = `${user.email} (${user.role})`;
            userSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading user options:', error);
    }
}

// Initialize user options when audit tab is shown
document.getElementById('audit-tab').addEventListener('click', loadUserOptions);
