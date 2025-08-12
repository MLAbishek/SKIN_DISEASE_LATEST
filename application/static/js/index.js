// DOM elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const startCamera = document.getElementById('startCamera');
const captureBtn = document.getElementById('captureBtn');
const stopCamera = document.getElementById('stopCamera');
const previewSection = document.getElementById('previewSection');
const previewImage = document.getElementById('previewImage');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultsSection = document.getElementById('resultsSection');
const diagnosis = document.getElementById('diagnosis');
const confidence = document.getElementById('confidence');
const loading = document.getElementById('loading');

let stream = null;
let currentImageData = null;

// File upload functionality
uploadBtn.addEventListener('click', () => {
    fileInput.click();
});

uploadArea.addEventListener('click', () => {
    fileInput.click();
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    }
});

function handleFileSelect(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        showPreview(e.target.result);
        currentImageData = file;
    };
    reader.readAsDataURL(file);
}

// Camera functionality
startCamera.addEventListener('click', async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'environment' // Use back camera on mobile
            }
        });
        video.srcObject = stream;
        video.style.display = 'block';
        startCamera.disabled = true;
        captureBtn.disabled = false;
        stopCamera.disabled = false;
    } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Unable to access camera. Please make sure you have granted camera permissions.');
    }
});

captureBtn.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    showPreview(imageDataUrl);
    currentImageData = imageDataUrl;
});

stopCamera.addEventListener('click', () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    video.style.display = 'none';
    startCamera.disabled = false;
    captureBtn.disabled = true;
    stopCamera.disabled = true;
});

function showPreview(imageSrc) {
    previewImage.src = imageSrc;
    previewSection.style.display = 'block';
    resultsSection.style.display = 'none';
}

// Analysis functionality
analyzeBtn.addEventListener('click', async () => {
    if (!currentImageData) {
        alert('Please select or capture an image first.');
        return;
    }

    loading.style.display = 'block';
    resultsSection.style.display = 'none';

    try {
        let response;

        if (typeof currentImageData === 'string') {
            // Camera image (base64)
            response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image_data: currentImageData
                })
            });
        } else {
            // File upload
            const formData = new FormData();
            formData.append('file', currentImageData);

            response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
        }

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error);
        }

        displayResults(result);

    } catch (error) {
        console.error('Error:', error);
        alert('Error analyzing image: ' + error.message);
    } finally {
        loading.style.display = 'none';
    }
});

function displayResults(result) {
    diagnosis.textContent = result.diagnosis;
    confidence.textContent = `Confidence: ${result.confidence}`;

    // Color code based on result
    if (result.diagnosis.toLowerCase().includes('issue') ||
        result.diagnosis.toLowerCase().includes('cancer')) {
        diagnosis.style.color = '#dc3545';
    } else {
        diagnosis.style.color = '#28a745';
    }

    resultsSection.style.display = 'block';
}

// Clean up camera stream when page is closed
window.addEventListener('beforeunload', () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
});