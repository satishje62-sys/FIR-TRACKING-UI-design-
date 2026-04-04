document.addEventListener('DOMContentLoaded', () => {
    // Navigation logic for Admin App
    const screens = document.querySelectorAll('.screen');
    const bottomNav = document.getElementById('admin-bottom-nav');
    
    const topBarDefault = document.getElementById('admin-top-bar');
    const profileBar = document.getElementById('admin-profile-bar');
    const backBar = document.getElementById('admin-back-bar');
    
    const backBarTitle = document.getElementById('back-bar-title');
    const navItems = document.querySelectorAll('.nav-item');

    let historyStack = [];
    let currentScreenInfo = null;
    let chartInitialized = false;

    window.showScreen = function(screenId, title = "", topBarStyle = "top", isBack = false) {
        // Record history if not explicitly going back
        if (!isBack && currentScreenInfo && currentScreenInfo.id !== screenId) {
            historyStack.push(currentScreenInfo);
        }
        
        // Hide all screens
        screens.forEach(screen => {
            screen.classList.remove('active');
            screen.classList.add('hidden');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
            setTimeout(() => {
                targetScreen.classList.add('active');
            }, 10);
            
            // Handle bottom nav visibility
            if (targetScreen.classList.contains('with-bottom-nav')) {
                bottomNav.classList.remove('hidden');
            } else {
                bottomNav.classList.add('hidden');
            }

            // Handle Top Bars
            topBarDefault.classList.add('hidden');
            profileBar.classList.add('hidden');
            backBar.classList.add('hidden');

            if (topBarStyle === 'top') {
                topBarDefault.classList.remove('hidden');
            } else if (topBarStyle === 'profile') {
                profileBar.classList.remove('hidden');
            } else if (topBarStyle === 'back') {
                backBar.classList.remove('hidden');
                if (title) backBarTitle.textContent = title;
            }

            // Init charts if reports is selected
            if (screenId === 'admin-reports' && !chartInitialized) {
                initAdminCharts();
                chartInitialized = true;
            }

            currentScreenInfo = { id: screenId, title: title, topBarStyle: topBarStyle };
            updateBottomNavState(screenId);
        }
    };

    window.goBack = function() {
        if (historyStack.length > 0) {
            const prev = historyStack.pop();
            showScreen(prev.id, prev.title, prev.topBarStyle, true);
        } else {
            // Default back behavior
            window.location.href = 'index.html';
        }
    };

    function updateBottomNavState(screenId) {
        navItems.forEach(item => item.classList.remove('active'));
        
        let idx = 0;
        if (screenId === 'admin-dashboard') idx = 0;
        else if (screenId === 'admin-available-dsps') idx = 1;
        else if (screenId === 'admin-assign-fir') idx = 2; // Center fab is +
        else if (screenId === 'admin-reports') idx = 3;

        if (navItems[idx]) {
            navItems[idx].classList.add('active');
        }
    }

    // Chart.js init for Reports
    function initAdminCharts() {
        const pieCtx = document.getElementById('crimeDoughnutChart');
        if (pieCtx) {
            new Chart(pieCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Theft', 'Fraud', 'Assault', 'Cyber Crime'],
                    datasets: [{
                        data: [42, 12, 5, 6],
                        backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#1e3a8a'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }
    }

    // Initialization
    showScreen('admin-dashboard', 'Dashboard', 'top');
});
