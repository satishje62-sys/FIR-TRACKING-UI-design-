document.addEventListener('DOMContentLoaded', () => {
    // Navigation logic for Inspector App
    const screens = document.querySelectorAll('.screen');
    const bottomNav = document.getElementById('inspector-bottom-nav');
    const topBar = document.getElementById('inspector-top-bar');
    const backBar = document.getElementById('inspector-back-bar');
    const backBarTitle = document.getElementById('back-bar-title');
    const navItems = document.querySelectorAll('.nav-item');

    let historyStack = [];
    let currentScreenInfo = null;

    window.showScreen = function(screenId, title = "", showMainTopBar = false, isBack = false) {
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
            if (showMainTopBar) {
                topBar.classList.remove('hidden');
                backBar.classList.add('hidden');
            } else {
                topBar.classList.add('hidden');
                backBar.classList.remove('hidden');
                if (title) {
                    backBarTitle.textContent = title;
                }
            }

            currentScreenInfo = { id: screenId, title: title, showMainTopBar: showMainTopBar };
            updateBottomNavState(screenId);
        }
    };

    window.goBack = function() {
        if (historyStack.length > 0) {
            const prev = historyStack.pop();
            showScreen(prev.id, prev.title, prev.showMainTopBar, true); // true = isBack
        } else {
            // Default back behavior if no local history
            window.location.href = 'index.html';
        }
    };

    function updateBottomNavState(screenId) {
        navItems.forEach(item => item.classList.remove('active'));
        
        // Match nav items generically
        let idx = 0;
        if (screenId === 'inspector-dashboard') idx = 0;
        else if (screenId === 'inspector-update-status') idx = 1;
        else if (screenId === 'inspector-upload-evidence') idx = 3; // Center fab is +
        else if (screenId === 'inspector-case-tabs') idx = 1;

        if (navItems[idx]) {
            navItems[idx].classList.add('active');
        }
    }

    // Toggle logic for status select in Update Status screen
    window.toggleStatusSelect = function(element) {
        const statuses = document.querySelectorAll('.v-timeline-item:not(.completed)');
        statuses.forEach(s => {
            s.classList.remove('active-status-box');
            
            // Reset markers
            const marker = s.querySelector('.v-marker');
            if (marker) {
                marker.className = 'v-marker outline text-gray';
                const i = marker.querySelector('i');
                if (i) i.style.opacity = '1';
                
                // Keep icon from html but reset background
                if (s.querySelector('h4').textContent === 'Evidence Collection') {
                    marker.innerHTML = '<i class="fa-solid fa-microscope text-xs"></i>';
                } else if (s.querySelector('h4').textContent === 'Mark as Completed') {
                    marker.innerHTML = '<i class="fa-solid fa-check text-xs" style="opacity:0"></i>';
                }
            }
        });

        element.classList.add('active-status-box');
        const marker = element.querySelector('.v-marker');
        if (marker) {
            marker.className = 'v-marker yellow-check';
            marker.innerHTML = '<i class="fa-solid fa-check"></i>';
        }
    };

    // Initialize display logic
    showScreen('inspector-dashboard', 'Dashboard', true);
});
