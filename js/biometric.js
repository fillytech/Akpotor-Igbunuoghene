let currentStream = null;
let biometricData = {
    fingerprint: null,
    face: null,
    iris: null
};

// Button triggers
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('capture-fingerprint').onclick = captureFingerprint;
    document.getElementById('capture-face').onclick = () => startCamera('face');
    document.getElementById('capture-iris').onclick = () => startCamera('iris');
});

// Scan Animation
function showScanAnimation(type, duration = 2000) {
    const preview = document.querySelector('.biometric-preview');
    preview.innerHTML = `
      <div style="text-align:center;">
        <i class="${type === 'fingerprint' ? 'fas fa-fingerprint' : type === 'face' ? 'fas fa-user' : 'fas fa-eye'} fa-4x scan-animate"></i>
        <p>Processing <span class="dot-animate"></span></p>
      </div>
    `;
    let dots = 0;
    const dotElem = preview.querySelector('.dot-animate');
    const interval = setInterval(() => {
        dots = (dots + 1) % 4;
        dotElem.textContent = '.'.repeat(dots);
    }, 400);
    setTimeout(() => clearInterval(interval), duration);
}

// Fingerprint capture
async function captureFingerprint() {
    showScanAnimation('fingerprint');
    setTimeout(() => {
        biometricData.fingerprint = 'fingerprint-data';
        updatePreview('fingerprint');
        alert('Fingerprint captured');
    }, 2000);
}

// Start camera for face/iris
async function startCamera(type) {
    showScanAnimation(type);
    setTimeout(async () => {
        let videoElement = document.getElementById(`${type}-video`);
        if (!videoElement) {
            videoElement = document.createElement('video');
            videoElement.id = `${type}-video`;
            videoElement.autoplay = true;
            videoElement.style.width = '100%';
            videoElement.style.maxWidth = '350px';
            videoElement.style.marginTop = '1rem';
            document.querySelector('.biometric-preview').appendChild(videoElement);
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 640 }, height: { ideal: 480 } }
            });
            videoElement.srcObject = stream;
            currentStream = stream;
            // Add capture button
            let captureBtn = document.createElement('button');
            captureBtn.textContent = `Confirm ${type.charAt(0).toUpperCase() + type.slice(1)} Capture`;
            captureBtn.onclick = () => {
                if (type === 'face') captureFace();
                if (type === 'iris') captureIris();
            };
            videoElement.parentElement.appendChild(captureBtn);
        } catch (error) {
            alert('Could not access camera. Please check permissions.');
            if (videoElement) videoElement.remove();
        }
    }, 2000);
}

function stopCamera(type) {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }
    const videoElement = document.getElementById(`${type}-video`);
    if (videoElement) videoElement.remove();
    // Remove capture button
    const btn = document.querySelector('.biometric-preview button');
    if (btn) btn.remove();
}

// Face capture
async function captureFace() {
    showScanAnimation('face');
    setTimeout(() => {
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
    setTimeout(() => {
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
        preview.innerHTML = `<h3><i class="fas fa-fingerprint"></i> Fingerprint Preview</h3>
            <p>Fingerprint data captured.</p>`;
    }
    if (type === 'face' && biometricData.face) {
        preview.innerHTML = `<h3><i class="fas fa-user"></i> Face Preview</h3>
            <img src="${biometricData.face}" alt="Face" style="max-width:220px;border-radius:8px;"/>`;
    }
    if (type === 'iris' && biometricData.iris) {
        preview.innerHTML = `<h3><i class="fas fa-eye"></i> Iris Preview</h3>
            <img src="${biometricData.iris}" alt="Iris" style="max-width:220px;border-radius:8px;"/>`;
    }
}
