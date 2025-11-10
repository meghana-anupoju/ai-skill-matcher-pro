
// Copied application logic from frontend/app.js to backend static so Flask-served app can run

// Global application state
let currentSection = 'landing';
let currentTheme = 'light';
let currentFontSize = 'medium';
let isVoiceEnabled = true;
let skillGapChart = null;
let salaryChart = null;
let voiceRecognition = null;
let currentRole = 'candidate';
let uploadProgress = 0;
let lastUploadedResumeId = null;
let realtimeEventSource = null;
let realtimeReconnectAttempts = 0;

function initApp() {
    console.log('AI Skill Matcher Pro - Initializing...');
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) loadingOverlay.classList.add('hidden');
    initializeNavigation();
    initializeAccessibility();
    initializeUpload();
    initializeDashboard();
    initializeRoadmap();
    initializeInterview();
    initializeCollaboration();
    initializeProfile();
    initializeNotifications();
    showSection('landing');
    connectToRealtimeStream();
    const savedTheme = localStorage.getItem('appTheme');
    const savedSize = localStorage.getItem('appFontSize');
    if (savedTheme) switchTheme(savedTheme);
    else switchTheme(currentTheme);
    if (savedSize) switchFontSize(savedSize);
    console.log('Application initialized successfully');
    showNotification('AI Skill Matcher Pro loaded successfully!', 'success');
}

function connectToRealtimeStream() {
    if (realtimeEventSource) return;
    function createSource() {
        try {
            realtimeEventSource = new EventSource('/stream');
        } catch (err) {
            console.error('EventSource creation failed', err);
            scheduleReconnect();
            return;
        }
        realtimeEventSource.onopen = function() { realtimeReconnectAttempts = 0; showNotification('Real-time connection established', 'success'); };
        realtimeEventSource.onmessage = function(event) {
            let msg = event.data;
            try { msg = JSON.parse(msg.replace(/'/g, '"')); } catch (e) {}
            try {
                if (msg && msg.type === 'resume_uploaded') {
                    showNotification('New resume uploaded: ' + (msg.filename || 'file'), 'info');
                    const info = document.getElementById('uploaded-file-info');
                    if (info && msg.filename) info.textContent = msg.filename;
                    loadRecentUploads();
                } else {
                    showNotification('Real-time update: ' + (msg.update || JSON.stringify(msg)), 'info');
                }
            } catch (err) { showNotification('Real-time update received', 'info'); }
        };
        realtimeEventSource.onerror = function(e) {
            console.warn('Real-time connection error', e);
            showNotification('Real-time connection lost — attempting to reconnect...', 'warning');
            try { realtimeEventSource.close(); } catch (err) {}
            realtimeEventSource = null;
            scheduleReconnect();
        };
    }
    function scheduleReconnect() {
        realtimeReconnectAttempts = Math.min(6, realtimeReconnectAttempts + 1);
        const backoff = Math.pow(2, realtimeReconnectAttempts) * 1000;
        setTimeout(() => { if (!realtimeEventSource) createSource(); }, backoff);
    }
    createSource();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Navigation System
function initializeNavigation() {
    // Delegated handler: attach to document so dynamic injection still works
    document.addEventListener('click', (e) => {
        const navBtn = e.target.closest && e.target.closest('.nav-link');
        if (navBtn) {
            e.preventDefault();
            const section = navBtn.dataset.section;
            if (section) showSection(section);
            return;
        }
        if (e.target.hasAttribute('data-section')) {
            e.preventDefault();
            const section = e.target.dataset.section;
            if (section) showSection(section);
        }
        if (e.target.id === 'learn-more') { e.preventDefault(); scrollToFeatures(); }
    });

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1': showSection('landing'); e.preventDefault(); break;
                case '2': showSection('upload'); e.preventDefault(); break;
                case '3': showSection('dashboard'); e.preventDefault(); break;
                case '4': showSection('roadmap'); e.preventDefault(); break;
                case '5': showSection('interview'); e.preventDefault(); break;
                case '6': showSection('collaboration'); e.preventDefault(); break;
                case '7': showSection('profile'); e.preventDefault(); break;
            }
        }
    });
}

function showSection(sectionId) {
    console.log('Switching to section:', sectionId);
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.style.display = 'block';
        targetSection.classList.add('active');
    }
    currentSection = sectionId;
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionId) link.classList.add('active');
    });
    window.location.hash = sectionId;
    window.scrollTo(0, 0);
    window.dispatchEvent(new CustomEvent('sectionChanged', { detail: { section: sectionId } }));
}

function scrollToFeatures() {
    const featuresSection = document.getElementById('features');
    if (featuresSection) featuresSection.scrollIntoView({ behavior: 'smooth' });
}

/*
  The rest of the functions (initializeAccessibility, initializeUpload, initializeDashboard, etc.)
  are intentionally kept minimal/stubbed here to keep this file focused on navigation and wiring.
  The full frontend/app.js contains many helper functions; add them here if you need the full behavior.
*/

function initializeAccessibility() { /* minimal stub kept to avoid runtime errors */ }
function initializeUpload() { /* minimal stub kept to avoid runtime errors */ }
function initializeDashboard() { /* minimal stub kept to avoid runtime errors */ }
function initializeRoadmap() { /* minimal stub kept to avoid runtime errors */ }
function initializeInterview() { /* minimal stub kept to avoid runtime errors */ }
function initializeCollaboration() { /* minimal stub kept to avoid runtime errors */ }
function initializeProfile() { /* minimal stub kept to avoid runtime errors */ }
function initializeNotifications() { }
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    const closeBtn = document.createElement('span');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '\u00d7';
    closeBtn.onclick = () => { notification.remove(); };
    notification.appendChild(closeBtn);
    const notificationsContainer = document.getElementById('notification-container');
    if (notificationsContainer) {
        notificationsContainer.appendChild(notification);
        setTimeout(() => { if (notification.parentNode) notification.remove(); }, 5000);
    }
}

// Expose a few helpers for tests or console use
window.initApp = initApp;
window.showSection = showSection;

function createSkillGapChart(ctx, dataValues = [22,35,15], labels = ['Technical Skills', 'Soft Skills', 'Inferred Skills']) {
    // Destroy existing chart if it exists
    if (skillGapChart) {
        skillGapChart.destroy();
    }

    // Create radar chart (spider) to show competency across axes
    skillGapChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Competency (%)',
                data: dataValues,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            elements: {
                line: {
                    borderWidth: 2
                }
            },
            scales: {
                r: {
                    angleLines: { display: true },
                    suggestedMin: 0,
                    suggestedMax: 100,
                    beginAtZero: true,
                    ticks: {
                        stepSize: 20,
                        showLabelBackdrop: false
                    },
                    pointLabels: {
                        font: {
                            size: 12
                        }
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
            }
        }
    });
}

function createSalaryChart(ctx) {
    // Destroy existing chart if it exists
    if (salaryChart) {
        salaryChart.destroy();
    }
    
    // Create new chart
    salaryChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Python', 'React', 'Machine Learning'],
            datasets: [{
                label: 'Average Salary',
                data: [95000, 85000, 120000],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Salary ($)'
                    }
                }
            }
        }
    });
}

function updateDashboardWithAnalysis() {
    // Use analysisData filled from server analysis (fallback to older extracted_skills)
    const skills = (analysisData.skills || analysisData.extracted_skills) || { technical_skills: [], soft_skills: [], certifications: [] };

    // Fill skill grids in the AI-Detected Skills section
    const skillCategories = document.querySelectorAll('.skills-categories .skill-category');
    if (skillCategories && skillCategories.length >= 2) {
        // Technical skills (first category)
        const techGrid = skillCategories[0].querySelector('.skills-grid');
        if (techGrid) {
            techGrid.innerHTML = (skills.technical_skills || []).map(s => `<span class="skill-tag expert">${s}</span>`).join('') || '<span class="muted">No technical skills detected</span>';
        }
        // Soft skills (second category)
        const softGrid = skillCategories[1].querySelector('.skills-grid');
        if (softGrid) {
            softGrid.innerHTML = (skills.soft_skills || []).map(s => `<span class="skill-tag soft">${s}</span>`).join('') || '<span class="muted">No soft skills detected</span>';
        }
    }

    // Update match/score visuals
    const scoreNumber = document.querySelector('.score-number');
    if (scoreNumber) {
        const score = analysisData.score || (Math.min(99, 40 + ((skills.technical_skills||[]).length) * 8 + ((skills.soft_skills||[]).length) * 4 + ((skills.certifications||[]).length) * 6));
        scoreNumber.textContent = `${score}%`;
    }

    // Recreate charts with live-derived values
    // Skill gap: use server-provided values if present
    const gapValues = (analysisData.skill_gap && analysisData.skill_gap.values) || [Math.max(0, 100 - ((skills.technical_skills||[]).length) * 8), Math.max(0, 100 - ((skills.soft_skills||[]).length) * 6), Math.max(0, 100 - ((skills.certifications||[]).length) * 10)];
    const skillCanvas = document.getElementById('skillGapChart');
    if (skillCanvas) createSkillGapChart(skillCanvas, gapValues);

    // Salary: prefer server salary block if available
    let salaryLabels = [];
    let salaryValues = [];
    if (analysisData.salary && analysisData.salary.labels) {
        salaryLabels = analysisData.salary.labels;
        salaryValues = analysisData.salary.values;
    } else {
        salaryLabels = (skills.technical_skills || []).slice(0,5);
        const salaryMap = (window.__salaryMap || { python: '$95,000', react: '$85,000', machine_learning: '$120,000' });
        salaryValues = salaryLabels.map(s => {
            const key = s.toLowerCase().replace(/\s+/g, '_');
            const val = salaryMap[key] || salaryMap[s.toLowerCase()] || 60000;
            return parseInt(String(val).replace(/[^0-9]/g, '')) || 60000;
        });
    }

    const salaryCanvas = document.getElementById('salaryChart');
    if (salaryCanvas) {
        if (!salaryLabels || salaryLabels.length === 0) {
            createSalaryChart(salaryCanvas);
        } else {
            if (salaryChart) salaryChart.destroy();
            salaryChart = new Chart(salaryCanvas, {
                type: 'line',
                data: {
                    labels: salaryLabels,
                    datasets: [{
                        label: 'Estimated Market Salary',
                        data: salaryValues,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: { display: true, text: 'Salary ($)' }
                        }
                    }
                }
            });
        }
    }
}

// Career Roadmap
function initializeRoadmap() {
    const roadmapContainer = document.getElementById('roadmap-container');
    if (roadmapContainer) {
        // Try to fetch dynamic roadmap from backend; fallback to embedded variable
        fetch('/api/roadmap')
            .then(r => r.json())
            .then(data => {
                const phases = (data && data.phases) || (window.__careerRoadmap && window.__careerRoadmap.phases) || [];
                if (!phases.length) {
                    roadmapContainer.innerHTML = '<div class="muted">No roadmap data available.</div>';
                    return;
                }
                roadmapContainer.innerHTML = phases.map(phase => `
                    <div class="roadmap-phase">
                        <h3>${phase.phase}</h3>
                        <div class="skills-list">
                            <h4>Skills to Develop:</h4>
                            <ul>${(phase.skills||[]).map(skill => `<li>${skill}</li>`).join('')}</ul>
                        </div>
                        <div class="projects-list">
                            <h4>Projects to Complete:</h4>
                            <ul>${(phase.projects||[]).map(project => `<li>${project}</li>`).join('')}</ul>
                        </div>
                    </div>
                `).join('');
            })
            .catch(err => {
                console.warn('Failed to load roadmap', err);
                roadmapContainer.innerHTML = '<div class="muted">No roadmap data available.</div>';
            });
    }
}

// Interview Preparation
function initializeInterview() {
    const questionsContainer = document.getElementById('interview-questions-container');
    if (questionsContainer) {
        // Fetch dynamic questions from backend
        fetch('/api/interview-questions')
            .then(r => r.json())
            .then(data => {
                const questions = (data && data.questions) || window.__interviewQuestions || [];
                if (!questions.length) {
                    questionsContainer.innerHTML = '<div class="muted">No interview questions available.</div>';
                    return;
                }
                questionsContainer.innerHTML = questions.map(question => `
                    <div class="question-card">
                        <div class="question-category">${question.category}</div>
                        <div class="question-difficulty">${question.difficulty}</div>
                        <div class="question-text">${question.question}</div>
                    </div>
                `).join('');
            })
            .catch(err => {
                console.warn('Failed to load interview questions', err);
                questionsContainer.innerHTML = '<div class="muted">No interview questions available.</div>';
            });
    }
}

// Collaboration Features
function initializeCollaboration() {
    // Initialize collaboration tools here
    console.log('Collaboration system initialized');
}

// Profile Management
function initializeProfile() {
    // Wire profile settings tabs (Integrations, Privacy, Accessibility, Quick Actions, API & Export)
    const tabButtons = document.querySelectorAll('.settings-tabs .tab-btn');
    if (tabButtons.length) {
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = btn.dataset.tab;
                if (!tab) return;
                // Toggle active on buttons
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                // Show corresponding tab content
                document.querySelectorAll('.profile-main .tab-content').forEach(tc => {
                    tc.classList.remove('active');
                    tc.style.display = 'none';
                });
                const target = document.getElementById(`${tab}-tab`);
                if (target) {
                    target.classList.add('active');
                    target.style.display = 'block';
                }
            });
        });
        // Ensure first tab is visible
        const first = tabButtons[0];
        if (first) first.click();
    }
    console.log('Profile system initialized');
}

// Notifications System
function initializeNotifications() {
    // Initialize notification system
    console.log('Notifications system initialized');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add close button
    const closeBtn = document.createElement('span');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => {
        notification.remove();
    };
    
    notification.appendChild(closeBtn);
    
    // Add to notifications container
    const notificationsContainer = document.getElementById('notification-container');
    if (notificationsContainer) {
        notificationsContainer.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    // Scroll to notifications
    if (notificationsContainer) {
        notificationsContainer.scrollTop = notificationsContainer.scrollHeight;
    }
}

// Live Updates Simulation
function startLiveUpdates() {
    // Simulate periodic updates
    setInterval(() => {
        // Update skill trends
        updateSkillTrends();
        
        // Update salary data
        updateSalaryData();
    }, 30000); // Every 30 seconds
}

function updateSkillTrends() {
    // In a real app, this would fetch new data from the server
    console.log('Updating skill trends...');
}

function updateSalaryData() {
    // In a real app, this would fetch new salary data
    console.log('Updating salary data...');
}

// Utility Functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Export functions for use in other modules
window.initApp = initApp;
window.showSection = showSection;
window.switchTheme = switchTheme;
window.switchFontSize = switchFontSize;
window.handleVoiceCommand = handleVoiceCommand;
window.startVoiceRecognition = startVoiceRecognition;
window.stopVoiceRecognition = stopVoiceRecognition;
window.showNotification = showNotification;
