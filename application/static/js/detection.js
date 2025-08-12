// Detection Page JavaScript for SkinCare AI

document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const startCameraBtn = document.getElementById('startCamera');
    const captureBtn = document.getElementById('captureBtn');
    const stopCameraBtn = document.getElementById('stopCamera');
    const retakeBtn = document.getElementById('retakeBtn');
    const retryCameraBtn = document.getElementById('retryCameraBtn');
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const cameraOverlay = document.getElementById('cameraOverlay');
    const cameraPlaceholder = document.getElementById('cameraPlaceholder');
    const cameraStatusIndicator = document.getElementById('cameraStatusIndicator');
    const cameraStatusText = document.getElementById('cameraStatusText');
    const previewSection = document.getElementById('previewSection');
    const previewImage = document.getElementById('previewImage');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resultsSection = document.getElementById('resultsSection');
    const diagnosis = document.getElementById('diagnosis');
    const confidence = document.getElementById('confidence');
    const loading = document.getElementById('loading');
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');

    let stream = null;
    let currentImage = null;

    // Check model status on page load
    checkModelStatus();

    // Test camera support
    testCameraSupport();

    // Test camera support
    function testCameraSupport() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            updateCameraStatus('Camera not supported in this browser', 'error');
            startCameraBtn.disabled = true;
            startCameraBtn.textContent = 'Camera Not Supported';
            return;
        }
        updateCameraStatus('Camera ready - Click to start', 'ready');
    }

    // Model status check function
    async function checkModelStatus() {
        try {
            const response = await fetch('/test-model');
            const result = await response.json();

            if (result.status === 'success') {
                statusIndicator.className = 'status-indicator ready';
                statusText.textContent = result.message;
            } else {
                statusIndicator.className = 'status-indicator error';
                statusText.textContent = 'Model not available';
            }
        } catch (error) {
            statusIndicator.className = 'status-indicator error';
            statusText.textContent = 'Cannot connect to server';
        }
    }

    // File Upload Functionality
    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            fileInput.click();
        });
    }

    if (uploadArea) {
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        // Drag and drop functionality
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
                handleFile(files[0]);
            }
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFile(e.target.files[0]);
            }
        });
    }

    // Camera Functionality
    if (startCameraBtn) {
        startCameraBtn.addEventListener('click', startCamera);
    }

    if (captureBtn) {
        captureBtn.addEventListener('click', capturePhoto);
    }

    if (stopCameraBtn) {
        stopCameraBtn.addEventListener('click', stopCamera);
    }

    if (retakeBtn) {
        retakeBtn.addEventListener('click', retakePhoto);
    }

    if (retryCameraBtn) {
        retryCameraBtn.addEventListener('click', startCamera);
    }

    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeImage);
    }

    // File handling function
    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            showNotification('Please select a valid image file.', 'error');
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            showNotification('File size must be less than 10MB.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            currentImage = e.target.result;
            showPreview(currentImage);
        };
        reader.readAsDataURL(file);
    }

    // Simple Camera functions
    async function startCamera() {
        try {
            updateCameraStatus('Starting camera...', 'loading');

            // Simple constraints that work on most devices
            const constraints = {
                video: {
                    width: { ideal: 640, min: 320 },
                    height: { ideal: 480, min: 240 },
                    facingMode: 'environment' // Use back camera on mobile
                }
            };

            stream = await navigator.mediaDevices.getUserMedia(constraints);

            video.srcObject = stream;
            video.style.display = 'block';
            cameraPlaceholder.style.display = 'none';
            cameraOverlay.style.display = 'block';

            // Wait for video to be ready
            video.onloadedmetadata = () => {
                startCameraBtn.disabled = true;
                captureBtn.disabled = false;
                stopCameraBtn.disabled = false;
                retakeBtn.style.display = 'none';
                retryCameraBtn.style.display = 'none';
                updateCameraStatus('Camera ready - Click capture', 'ready');
                showNotification('Camera started!', 'success');
            };

        } catch (error) {
            console.error('Camera error:', error);
            updateCameraStatus('Camera failed to start', 'error');

            let message = 'Camera access denied. Please allow camera permissions.';
            if (error.name === 'NotFoundError') {
                message = 'No camera found on this device.';
            } else if (error.name === 'NotReadableError') {
                message = 'Camera is in use by another application.';
            } else if (error.name === 'NotAllowedError') {
                message = 'Camera permission denied. Please allow camera access in your browser settings.';
            }

            showNotification(message, 'error');
            retryCameraBtn.style.display = 'inline-flex';
            startCameraBtn.disabled = false;

            // Try simpler constraints as fallback
            try {
                console.log('Trying fallback camera constraints...');
                const fallbackConstraints = { video: true };
                stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);

                video.srcObject = stream;
                video.style.display = 'block';
                cameraPlaceholder.style.display = 'none';
                cameraOverlay.style.display = 'block';

                video.onloadedmetadata = () => {
                    startCameraBtn.disabled = true;
                    captureBtn.disabled = false;
                    stopCameraBtn.disabled = false;
                    retakeBtn.style.display = 'none';
                    retryCameraBtn.style.display = 'none';
                    updateCameraStatus('Camera ready - Click capture', 'ready');
                    showNotification('Camera started with fallback settings!', 'success');
                };

            } catch (fallbackError) {
                console.error('Fallback camera also failed:', fallbackError);
                showNotification('Camera cannot be accessed. Please use file upload instead.', 'error');
            }
        }
    }

    function capturePhoto() {
        if (!stream) {
            showNotification('Camera not active', 'error');
            return;
        }

        try {
            updateCameraStatus('Capturing...', 'loading');

            // Set canvas size
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw video frame to canvas
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);

            // Get image data
            currentImage = canvas.toDataURL('image/jpeg', 0.8);

            // Update UI
            cameraOverlay.style.display = 'none';
            retakeBtn.style.display = 'inline-flex';
            captureBtn.disabled = true;

            updateCameraStatus('Photo captured!', 'ready');
            showPreview(currentImage);
            showNotification('Photo captured successfully!', 'success');

        } catch (error) {
            console.error('Capture error:', error);
            updateCameraStatus('Capture failed', 'error');
            showNotification('Failed to capture photo', 'error');
        }
    }

    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
            video.srcObject = null;
        }

        // Reset UI
        video.style.display = 'none';
        cameraPlaceholder.style.display = 'flex';
        cameraOverlay.style.display = 'none';
        retakeBtn.style.display = 'none';
        retryCameraBtn.style.display = 'none';

        startCameraBtn.disabled = false;
        captureBtn.disabled = true;
        stopCameraBtn.disabled = true;

        updateCameraStatus('Camera stopped', 'ready');
        showNotification('Camera stopped', 'info');
    }

    // Camera status update function
    function updateCameraStatus(message, status) {
        if (cameraStatusText) {
            cameraStatusText.textContent = message;
        }
        if (cameraStatusIndicator) {
            cameraStatusIndicator.className = `status-indicator ${status}`;
        }
    }

    // Retake photo function
    function retakePhoto() {
        if (stream) {
            cameraOverlay.style.display = 'block';
            retakeBtn.style.display = 'none';
            captureBtn.disabled = false;
            previewSection.style.display = 'none';
            currentImage = null;
            updateCameraStatus('Camera ready - Click capture', 'ready');
        } else {
            startCamera();
        }
    }

    // Show preview
    function showPreview(imageData) {
        previewImage.src = imageData;
        previewSection.style.display = 'block';
        previewSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Analyze image
    async function analyzeImage() {
        if (!currentImage) {
            showNotification('Please select or capture an image first.', 'error');
            return;
        }

        loading.style.display = 'flex';
        resultsSection.style.display = 'none';

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image_data: currentImage
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            if (result.error) {
                throw new Error(result.error);
            }

            displayResults(result);

        } catch (error) {
            console.error('Analysis error:', error);
            showNotification('Analysis failed. Please try again.', 'error');
        } finally {
            loading.style.display = 'none';
        }
    }

    // Display results
    function displayResults(result) {
        diagnosis.innerHTML = '';
        confidence.innerHTML = '';

        const diagnosisText = result.diagnosis || 'Analysis complete';
        diagnosis.textContent = diagnosisText;

        if (diagnosisText.toLowerCase().includes('normal')) {
            diagnosis.className = 'diagnosis normal';
        } else if (diagnosisText.toLowerCase().includes('issue') || diagnosisText.toLowerCase().includes('potential')) {
            diagnosis.className = 'diagnosis issue';
        } else {
            diagnosis.className = 'diagnosis';
        }

        confidence.innerHTML = '';
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        showNotification('Analysis completed successfully!', 'success');
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && document.activeElement === analyzeBtn) {
            analyzeImage();
        }
        if (e.key === ' ' && document.activeElement === captureBtn) {
            e.preventDefault();
            capturePhoto();
        }
        if (e.key === 'c' && !e.ctrlKey && !e.metaKey) {
            if (captureBtn && !captureBtn.disabled) {
                e.preventDefault();
                capturePhoto();
            }
        }
        if (e.key === 'Escape') {
            if (stream) {
                stopCamera();
            }
        }
    });

    // Accessibility improvements
    if (uploadArea) {
        uploadArea.setAttribute('role', 'button');
        uploadArea.setAttribute('tabindex', '0');
        uploadArea.setAttribute('aria-label', 'Upload image for analysis');

        uploadArea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInput.click();
            }
        });
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    });

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    function getNotificationIcon(type) {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            default: return 'ℹ️';
        }
    }

    console.log('SkinCare AI - Detection JavaScript loaded successfully');
});
