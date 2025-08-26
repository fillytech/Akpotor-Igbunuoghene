// Biometric capture functionality for BVS

let currentStream = null;

// Tab navigation
function showTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none');
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).style.display = 'block';
    
    // Stop any existing stream
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }
    
    // Start appropriate stream
    if (tabName === 'face' || tabName === 'iris') {
        startCamera(tabName);
    }
}

// Camera setup
async function startCamera(type) {
    try {
        const videoElement = document.getElementById(`${type}-video`);
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 640 },
                height: { ideal: 480 }
            } 
        });
        
        videoElement.srcObject = stream;
        currentStream = stream;
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Could not access camera. Please check permissions.');
    }
}

// Utility: Show scan animation overlay with smooth fade-in/out and responsive scaling
function showScanAnimation(type, duration = 2000) {
    let oldOverlay = document.getElementById('scan-overlay');
    if (oldOverlay) oldOverlay.remove();

    const overlay = document.createElement('div');
    overlay.id = 'scan-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,33,71,0.45)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 9999;
    overlay.style.opacity = 0;
    overlay.style.transition = 'opacity 0.4s';

    // Animation container
    const animBox = document.createElement('div');
    animBox.style.background = '#fff';
    animBox.style.borderRadius = '16px';
    animBox.style.padding = '6vw 8vw';
    animBox.style.boxShadow = '0 4px 32px rgba(0,33,71,0.18)';
    animBox.style.display = 'flex';
    animBox.style.flexDirection = 'column';
    animBox.style.alignItems = 'center';
    animBox.style.maxWidth = '90vw';
    animBox.style.maxHeight = '80vh';

    // Modern circular loader
    const loader = document.createElement('div');
    loader.style.width = '18vw';
    loader.style.maxWidth = '120px';
    loader.style.height = '18vw';
    loader.style.maxHeight = '120px';
    loader.style.borderRadius = '50%';
    loader.style.border = '6px solid #008751';
    loader.style.borderTop = '6px solid #ffd700';
    loader.style.animation = 'spin-loader 1s linear infinite';
    loader.style.position = 'relative';
    loader.style.display = 'flex';
    loader.style.alignItems = 'center';
    loader.style.justifyContent = 'center';
    loader.style.marginBottom = '18px';

    // Face icon with pulse for facial recognition
    if (type === 'face') {
        const faceIcon = document.createElement('div');
        faceIcon.innerHTML = `
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <circle cx="28" cy="28" r="24" stroke="#002147" stroke-width="2" fill="#ffd700"/>
                <ellipse cx="20" cy="26" rx="3" ry="4" fill="#002147"/>
                <ellipse cx="36" cy="26" rx="3" ry="4" fill="#002147"/>
                <path d="M20 38c2 2 8 2 10 0" stroke="#008751" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `;
        faceIcon.style.position = 'absolute';
        faceIcon.style.left = '50%';
        faceIcon.style.top = '50%';
        faceIcon.style.transform = 'translate(-50%, -50%)';
        faceIcon.style.animation = 'pulse-face 1.2s infinite';
        loader.appendChild(faceIcon);
    }

    animBox.appendChild(loader);

    // Scan text
    const scanText = document.createElement('div');
    scanText.style.fontSize = '1.2rem';
    scanText.style.fontWeight = 'bold';
    scanText.style.color = '#002147';
    scanText.style.marginTop = '8px';
    scanText.innerText = `Scanning ${type.charAt(0).toUpperCase() + type.slice(1)}...`;

    animBox.appendChild(scanText);
    overlay.appendChild(animBox);
    document.body.appendChild(overlay);

    // Add keyframes for animation
    const style = document.createElement('style');
    style.innerHTML = `
    @keyframes spin-loader {
        0% { transform: rotate(0deg);}
        100% { transform: rotate(360deg);}
    }
    @keyframes pulse-face {
        0% { opacity: 1; transform: translate(-50%, -50%) scale(1);}
        50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.08);}
        100% { opacity: 1; transform: translate(-50%, -50%) scale(1);}
    }
    @media (max-width: 600px) {
        #scan-overlay div {
            padding: 8vw 4vw !important;
        }
        #scan-overlay svg {
            width: 36px !important;
            height: 36px !important;
        }
    }
    `;
    document.head.appendChild(style);

    // Fade in
    setTimeout(() => { overlay.style.opacity = 1; }, 10);

    // Remove overlay after duration with fade out
    setTimeout(() => {
        overlay.style.opacity = 0;
        setTimeout(() => {
            overlay.remove();
            style.remove();
        }, 400);
    }, duration);
}

// Fingerprint capture
async function captureFingerprint() {
    showScanAnimation('fingerprint');
    setTimeout(async () => {
        if (navigator.credentials && navigator.credentials.create) {
            try {
                // WebAuthn implementation
                const publicKey = {
                    challenge: new Uint8Array([/* challenge bytes */]),
                    rp: { name: "BVS" },
                    user: {
                        id: new Uint8Array([/* user id */]),
                        name: "user@example.com",
                        displayName: "User"
                    },
                    pubKeyCredParams: [{ type: "public-key", alg: -7 }]
                };

                const credential = await navigator.credentials.create({ publicKey });
                console.log('WebAuthn credential created:', credential);
                alert('Fingerprint captured via WebAuthn');
            } catch (error) {
                console.error('WebAuthn error:', error);
                alert('WebAuthn not available. Please use image upload fallback.');
            }
        } else {
            alert('WebAuthn not supported. Please use image upload fallback.');
        }
    }, 2000);
}

function enrollFingerprint() {
    alert('Fingerprint enrollment functionality will be implemented');
}

function verifyFingerprint() {
    alert('Fingerprint verification functionality will be implemented');
}

// Face capture
async function captureFace() {
    showScanAnimation('face');
    setTimeout(async () => {
        const video = document.getElementById('face-video');
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/png');
        console.log('Face captured:', imageData.substring(0, 50) + '...');
        alert('Face captured successfully');
    }, 2000);
}

function enrollFace() {
    alert('Face enrollment functionality will be implemented');
}

function verifyFace() {
    alert('Face verification functionality will be implemented');
}

// Iris capture
async function captureIris() {
    showScanAnimation('iris');
    setTimeout(async () => {
        const video = document.getElementById('iris-video');
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        // Simple eye region cropping (mock)
        const irisData = canvas.toDataURL('image/png');
        console.log('Iris captured:', irisData.substring(0, 50) + '...');
        alert('Iris region captured successfully');
    }, 2000);
}

function enrollIris() {
    alert('Iris enrollment functionality will be implemented');
}

function verifyIris() {
    alert('Iris verification functionality will be implemented');
}

// DNA processing
function processDNA() {
    const fileInput = document.getElementById('dna-file');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a DNA file');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        console.log('DNA file content:', content.substring(0, 100) + '...');
        alert('DNA file processed successfully');
    };
    reader.readAsText(file);
}

function enrollDNA() {
    alert('DNA enrollment functionality will be implemented');
}

function verifyDNA() {
    alert('DNA verification functionality will be implemented');
}

// Initialize camera when page loads for face/iris tabs
document.addEventListener('DOMContentLoaded', () => {
    console.log('Biometric capture page loaded');
    addRippleEffectToButtons();
    makeVideosResponsive();

    // Set up event listeners for file input
    const dnaFileInput = document.getElementById('dna-file');
    if (dnaFileInput) {
        dnaFileInput.addEventListener('change', processDNA);
    }
});
