document.addEventListener('DOMContentLoaded', () => {
    // Navigation logic
    const screens = document.querySelectorAll('.screen');
    const bottomNav = document.getElementById('bottom-nav');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Setup Chart.js for the Dashboard once
    let chartsInitialized = false;

    // Show specific screen
    window.showScreen = function(screenId) {
        // Hide all screens
        screens.forEach(screen => {
            screen.classList.remove('active');
            screen.classList.add('hidden');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
            // Small timeout to allow display:block to apply before opacity transition
            setTimeout(() => {
                targetScreen.classList.add('active');
            }, 10);
            
            // Handle bottom nav visibility
            if (targetScreen.classList.contains('with-bottom-nav')) {
                bottomNav.classList.remove('hidden');
            } else {
                bottomNav.classList.add('hidden');
            }

            // Init charts if dashboard is selected
            if (screenId === 'dashboard' && !chartsInitialized) {
                initCharts();
                chartsInitialized = true;
            }

            // Update bottom nav active state
            updateBottomNavState(screenId);
        }
    };

    function updateBottomNavState(screenId) {
        navItems.forEach(item => item.classList.remove('active'));
        
        // Map screen to nav item
        let navMap = {
            'home': 'nav-home',
            'track-fir': 'nav-firs',
            'register-fir': 'nav-add',
            'notifications': 'nav-notifications',
            'dashboard': 'nav-profile' // Using dashboard instead of profile for the mockup
        };

        const activeNavId = navMap[screenId];
        if (activeNavId) {
            const navElem = document.getElementById(activeNavId);
            if (navElem) navElem.classList.add('active');
        }
    }

    // Role Selection Handling
    document.querySelectorAll('.role-card').forEach(card => {
        card.addEventListener('click', function() {
            const role = this.getAttribute('data-role');
            if (role === 'citizen') {
                showScreen('login');
            } else {
                alert(role.toUpperCase() + " flow is not implemented in this demo.");
            }
        });
    });

    // Login Form Submit
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Proceed to home
            showScreen('home');
        });
    }
    
    const regForm = document.getElementById('registration-form');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("FIR Registered Successfully! Your Tracking ID is #987654");
            showScreen('home');
        });
    }

    // Chart.js init for Dashboard
    function initCharts() {
        const lineCtx = document.getElementById('crimeStatsChart');
        if (lineCtx) {
            new Chart(lineCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                        {
                            label: 'Theft',
                            data: [12, 19, 15, 25, 22, 30],
                            borderColor: '#3b82f6',
                            tension: 0.4,
                            fill: false
                        },
                        {
                            label: 'Assault',
                            data: [8, 12, 10, 15, 12, 14],
                            borderColor: '#10b981',
                            tension: 0.4,
                            fill: false
                        },
                        {
                            label: 'Fraud',
                            data: [5, 8, 15, 10, 18, 12],
                            borderColor: '#f59e0b',
                            tension: 0.4,
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: { beginAtZero: true, display: false },
                        x: { display: false }
                    }
                }
            });
        }

        const pieCtx = document.getElementById('statusPieChart');
        if (pieCtx) {
            new Chart(pieCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Closed', 'Under Investigation', 'Pending'],
                    datasets: [{
                        data: [52, 28, 20],
                        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
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
    showScreen('role-selection');
});
