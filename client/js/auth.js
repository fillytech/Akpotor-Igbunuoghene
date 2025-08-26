// Authentication functionality for BVS

// Initialize authentication
document.addEventListener('DOMContentLoaded', () => {
    console.log('Authentication module loaded');
    
    // Set up form submissions based on current page
    if (document.getElementById('login-form')) {
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (document.getElementById('register-form')) {
        const registerForm = document.getElementById('register-form');
        registerForm.addEventListener('submit', handleRegister);
        
        // Add password confirmation validation
        const confirmPassword = document.getElementById('register-confirm-password');
        const password = document.getElementById('register-password');
        
        confirmPassword.addEventListener('input', () => {
            validatePasswordConfirmation();
        });
        
        password.addEventListener('input', () => {
            validatePasswordConfirmation();
        });
    }
    
    // Check if user is already logged in
    checkAuthStatus();
});

// Handle login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const messageDiv = document.getElementById('login-message');
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            messageDiv.textContent = 'Login successful!';
            messageDiv.style.color = 'green';
            
            // Store user info (simplified - in real app, use secure storage)
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect to dashboard after successful login
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            
        } else {
            const error = await response.json();
            messageDiv.textContent = error.error || 'Login failed';
            messageDiv.style.color = 'red';
        }
    } catch (error) {
        console.error('Login error:', error);
        messageDiv.textContent = 'Network error. Please try again.';
        messageDiv.style.color = 'red';
    }
}

// Handle registration
async function handleRegister(event) {
    event.preventDefault();
    
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const messageDiv = document.getElementById('register-message');
    
    // Validate password confirmation
    if (password !== confirmPassword) {
        messageDiv.textContent = 'Passwords do not match';
        messageDiv.style.color = 'red';
        return;
    }
    
    // Validate password strength
    if (!validatePasswordStrength(password)) {
        messageDiv.textContent = 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character';
        messageDiv.style.color = 'red';
        return;
    }
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            messageDiv.textContent = 'Registration successful! Redirecting to login...';
            messageDiv.style.color = 'green';
            
            // Redirect to login page after successful registration
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } else {
            const error = await response.json();
            messageDiv.textContent = error.error || 'Registration failed';
            messageDiv.style.color = 'red';
        }
    } catch (error) {
        console.error('Registration error:', error);
        messageDiv.textContent = 'Network error. Please try again.';
        messageDiv.style.color = 'red';
    }
}

// Validate password strength
function validatePasswordStrength(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

// Validate password confirmation
function validatePasswordConfirmation() {
    const password = document.getElementById('register-password');
    const confirmPassword = document.getElementById('register-confirm-password');
    const messageDiv = document.getElementById('register-message');
    
    if (password.value && confirmPassword.value && password.value !== confirmPassword.value) {
        messageDiv.textContent = 'Passwords do not match';
        messageDiv.style.color = 'red';
    } else {
        messageDiv.textContent = '';
    }
}

// Check authentication status
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
            const user = await response.json();
            localStorage.setItem('user', JSON.stringify(user));
            updateNavigation(user);
        }
    } catch (error) {
        console.error('Auth status check failed:', error);
        localStorage.removeItem('user');
    }
}

// Update navigation based on authentication status
function updateNavigation(user) {
    const nav = document.querySelector('nav ul');
    if (!nav) return;
    
    // Remove existing login/register links
    const loginLink = nav.querySelector('a[href="login.html"]');
    const registerLink = nav.querySelector('a[href="register.html"]');
    
    if (loginLink) loginLink.parentElement.remove();
    if (registerLink) registerLink.parentElement.remove();
    
    // Add logout link
    if (user) {
        const logoutItem = document.createElement('li');
        logoutItem.innerHTML = `<a href="#" onclick="logout()">Logout (${user.email})</a>`;
        nav.appendChild(logoutItem);
    }
}

// Logout function
async function logout() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST'
        });
        
        if (response.ok) {
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Check if user is authenticated (for protected pages)
function requireAuth() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
}

// Check if user has specific role
function hasRole(role) {
    const user = getCurrentUser();
    return user && user.role === role;
}

// Check if user is admin
function isAdmin() {
    return hasRole('admin');
}

// Check if user is analyst
function isAnalyst() {
    return hasRole('analyst');
}

// Check if user is officer
function isOfficer() {
    return hasRole('officer');
}

// Export functions for use in other modules
window.auth = {
    requireAuth,
    getCurrentUser,
    hasRole,
    isAdmin,
    isAnalyst,
    isOfficer,
    logout
};
