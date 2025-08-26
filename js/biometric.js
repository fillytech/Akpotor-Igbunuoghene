// Biometric capture functionality for BVS

let currentStream = null;
let biometricData = {
    fingerprint: null,
    face: null,
    iris: null
};

// Camera utility for face/iris
async function startCamera(type) {
    try {
        let videoElement = document.getElementById(`${type}-video`);
        if (!videoElement) {
            // Dynamically create video element for face/iris
            videoElement = document.createElement('video');
            videoElement.id = `${type}-video`;
            videoElement.autoplay = true;
            videoElement.style.width = '100%';
            videoElement.style.maxWidth = '350px';
            videoElement.style.marginTop = '1rem';
            document.querySelector('.biometric-preview').appendChild(videoElement);
        }
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 } }
        });
        videoElement.srcObject = stream;
        currentStream = stream;
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Could not access camera. Please check permissions.');
    }
}

function stopCamera(type) {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }
    const videoElement = document.getElementById(`${type}-video`);
    if (videoElement) videoElement.remove();
}

// Scan Animation
function showScanAnimation(type, duration = 2000) {
    // ... (copy the implementation from your existing biometric.js)
}

// Fingerprint capture (WebAuthn/fallback)
async function captureFingerprint() {
    showScanAnimation('fingerprint');
    setTimeout(async () => {
        biometricData.fingerprint = 'mock-fingerprint-data';
        updatePreview('fingerprint');
        alert('Fingerprint captured (mock)');
    }, 2000);
}

// Face capture
async function captureFace() {
    showScanAnimation('face');
    setTimeout(async () => {
        const video = document.getElementById('face-video');
        if (video) {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || 320;
            canvas.height = video.videoHeight || 240;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            biometricData.face = canvas.toDataURL('image/png');
            updatePreview('face');
            stopCamera('face');
            alert('Face captured');
        }
    }, 2000);
}

// Iris capture
async function captureIris() {
    showScanAnimation('iris');
    setTimeout(async () => {
        const video = document.getElementById('iris-video');
        if (video) {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || 320;
            canvas.height = video.videoHeight || 240;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            biometricData.iris = canvas.toDataURL('image/png');
            updatePreview('iris');
            stopCamera('iris');
            alert('Iris captured');
        }
    }, 2000);
}

// Update preview
function updatePreview(type) {
    const preview = document.querySelector('.biometric-preview');
    if (type === 'fingerprint' && biometricData.fingerprint) {
        preview.innerHTML = `<h3><i class="fas fa-image"></i> Preview</h3>
            <p>Fingerprint data captured.</p>`;
    }
    if (type === 'face' && biometricData.face) {
        preview.innerHTML = `<h3><i class="fas fa-image"></i> Preview</h3>
            <img src="${biometricData.face}" alt="Face Preview" style="max-width: 220px; border-radius:8px;">`;
    }
    if (type === 'iris' && biometricData.iris) {
        preview.innerHTML = `<h3><i class="fas fa-image"></i> Preview</h3>
            <img src="${biometricData.iris}" alt="Iris Preview" style="max-width: 220px; border-radius:8px;">`;
    }
}

// Handle biometric type change
function handleTypeChange() {
    const type = document.getElementById('biometric-type').value;
    stopCamera('face');
    stopCamera('iris');
    if (type === 'face' || type === 'iris') {
        startCamera(type);
    }
}

// Handle form submit
document.addEventListener('DOMContentLoaded', () => {
    // Button events
    document.querySelector('.biometric-actions button:nth-child(1)').addEventListener('click', captureFingerprint);
    document.querySelector('.biometric-actions button:nth-child(2)').addEventListener('click', captureFace);
    document.querySelector('.biometric-actions button:nth-child(3)').addEventListener('click', captureIris);

    // Type change event
    document.getElementById('biometric-type').addEventListener('change', handleTypeChange);

    // Form submit event
    document.getElementById('biometric-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const personId = document.getElementById('person-id').value;
        const type = document.getElementById('biometric-type').value;
        if (!biometricData[type]) {
            alert(`No ${type} data captured yet.`);
            return;
        }
        // Save logic (could send to server or localStorage)
        alert(`Biometric data for ${personId} (${type}) saved!`);
        // Optionally clear preview and biometricData[type]
        biometricData[type] = null;
        updatePreview(type);
    });

    // Initial camera if needed
    handleTypeChange();
});
