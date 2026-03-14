// ========================================
// MY BUDGET - Personal Budget Tracker
// Comprehensive JavaScript Application
// ========================================

// Application State
const AppState = {
    user: null,
    transactions: [],
    budgets: [],
    notifications: [],
    currentFilter: 'day',
    customDateRange: { start: null, end: null },
    currency: 'INR',
    theme: 'dark',
    charts: {},
    firstVisit: true
};

// Categories Configuration
const Categories = {
    food: { name: 'Food & Dining', icon: '🍔', type: 'expense' },
    transportation: { name: 'Transportation', icon: '🚗', type: 'expense' },
    shopping: { name: 'Shopping', icon: '🛍️', type: 'expense' },
    bills: { name: 'Bills & Utilities', icon: '📄', type: 'expense' },
    entertainment: { name: 'Entertainment', icon: '🎬', type: 'expense' },
    health: { name: 'Health', icon: '🏥', type: 'expense' },
    savings: { name: 'Savings', icon: '💰', type: 'expense' },
    salary: { name: 'Salary', icon: '💼', type: 'income' },
    investments: { name: 'Investments', icon: '📈', type: 'income' },
    freelance: { name: 'Freelance', icon: '💻', type: 'income' },
    other_income: { name: 'Other Income', icon: '💵', type: 'income' }
};

// Currency Symbols
const CurrencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    JPY: '¥'
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadFromStorage();
    setupEventListeners();
    checkWelcomeState();
    initializeTheme();
    initializeCharts();
    updateDashboard();
    startAutoRefresh();
    registerServiceWorker();
    initAnimations();
    
    // Clear any existing sample data on first load after our changes
    clearExistingSampleDataIfNeeded();
}

// ========================================
// ANIMATION SYSTEM
// ========================================

function initAnimations() {
    // Welcome screen animations
    animateWelcomeScreen();
    
    // Setup button ripple effects
    setupRippleEffects();
    
    // Setup intersection observer for scroll animations
    setupScrollAnimations();
    
    // Animate FAB on load
    setTimeout(function() {
        var fab = document.getElementById('quickAddBtn');
        if (fab) fab.classList.add('animate-in');
    }, 500);
    
    // Animate dashboard when not first visit
    if (!AppState.firstVisit) {
        setTimeout(animateDashboard, 300);
    }
}

function animateWelcomeScreen() {
    var welcomeScreen = document.getElementById('welcomeScreen');
    if (welcomeScreen && !welcomeScreen.classList.contains('hidden')) {
        var features = document.querySelectorAll('.welcome-feature');
        features.forEach(function(feature, index) {
            setTimeout(function() {
                feature.classList.add('animate-in');
            }, 100 + (index * 100));
        });
    }
}

function setupRippleEffects() {
    document.addEventListener('click', function(e) {
        var btn = e.target.closest('.btn:not(:disabled)');
        if (!btn) return;
        if (btn.tagName === 'A') return;
        
        var ripple = document.createElement('span');
        var rect = btn.getBoundingClientRect();
        
        var size = Math.max(rect.width, rect.height);
        var x = e.clientX - rect.left - size / 2;
        var y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        var existingRipple = btn.querySelector('.ripple');
        if (existingRipple) existingRipple.remove();
        
        btn.appendChild(ripple);
        
        ripple.addEventListener('animationend', function() { ripple.remove(); });
    });
}

function setupScrollAnimations() {
    var observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.summary-card, .chart-card, .settings-card, .budget-card, .transaction-item').forEach(function(el) {
        observer.observe(el);
    });
}

function animateSectionTransition(fromSection, toSection) {
    var fromEl = document.getElementById(fromSection + 'Section');
    var toEl = document.getElementById(toSection + 'Section');
    
    if (!fromEl || !toEl) return;
    
    fromEl.classList.add('exit');
    fromEl.classList.remove('active');
    
    setTimeout(function() {
        fromEl.classList.remove('exit');
        toEl.classList.add('active');
        animateSectionElements(toSection);
    }, 200);
}

function animateSectionElements(section) {
    var sectionEl = document.getElementById(section + 'Section');
    if (!sectionEl) return;
    
    // Animate cards
    var cards = sectionEl.querySelectorAll('.summary-card, .chart-card, .settings-card');
    cards.forEach(function(card, index) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(function() {
            card.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 50 + (index * 80));
    });
    
    // Animate transactions
    var transactions = sectionEl.querySelectorAll('.transaction-item');
    transactions.forEach(function(item, index) {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-15px)';
        
        setTimeout(function() {
            item.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 100 + (index * 50));
    });
    
    // Animate charts
    var charts = sectionEl.querySelectorAll('.chart-container');
    charts.forEach(function(chart, index) {
        chart.style.opacity = '0';
        chart.style.transform = 'scale(0.95)';
        
        setTimeout(function() {
            chart.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            chart.style.opacity = '1';
            chart.style.transform = 'scale(1)';
        }, 200 + (index * 150));
    });
}

function animateCounter(element, target, duration) {
    duration = duration || 1000;
    var startTime = performance.now();
    var textContent = element.textContent;
    var isCurrency = textContent.indexOf('$') > -1 || textContent.indexOf('€') > -1 || 
                     textContent.indexOf('£') > -1 || textContent.indexOf('₹') > -1;
    
    function update(currentTime) {
        var elapsed = currentTime - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var easeOut = 1 - Math.pow(1 - progress, 3);
        var current = target * easeOut;
        
        if (isCurrency) {
            element.textContent = formatCurrency(current);
        } else if (textContent.indexOf('%') > -1) {
            element.textContent = current.toFixed(1) + '%';
        } else {
            element.textContent = current.toFixed(0);
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function animateProgressBar(element, targetWidth, duration) {
    duration = duration || 1000;
    var startTime = performance.now();
    
    function update(currentTime) {
        var elapsed = currentTime - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var easeOut = 1 - Math.pow(1 - progress, 3);
        var current = targetWidth * easeOut;
        element.style.width = Math.min(current, 100) + '%';
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function animateHealthScore(score) {
    var circle = document.getElementById('scoreCircle');
    if (!circle) return;
    
    var radius = circle.r.baseVal.value;
    var circumference = radius * 2 * Math.PI;
    
    circle.style.strokeDasharray = circumference + ' ' + circumference;
    circle.style.strokeDashoffset = circumference;
    
    setTimeout(function() {
        var offset = circumference - (score / 100) * circumference;
        circle.style.transition = 'stroke-dashoffset 1.5s ease-out';
        circle.style.strokeDashoffset = offset;
    }, 100);
    
    var scoreEl = document.getElementById('healthScore');
    if (scoreEl) {
        animateCounter(scoreEl, score, 1500);
    }
}

function addTransactionItem(transaction, container) {
    var category = Categories[transaction.category] || { name: transaction.category, icon: '📊' };
    var isIncome = transaction.type === 'income';
    
    var div = document.createElement('div');
    div.className = 'transaction-item';
    // Instant animation start
    div.style.opacity = '0';
    div.style.transform = 'translateX(-10px)';
    
    div.innerHTML = '<div class="transaction-icon ' + transaction.type + '">' +
        category.icon + '</div>' +
        '<div class="transaction-details">' +
            '<div class="transaction-title">' + (transaction.description || category.name) + '</div>' +
            '<div class="transaction-meta">' +
                '<span>' + category.name + '</span>' +
                '<span>•</span>' +
                '<span>' + formatDate(transaction.date) + '</span>' +
            '</div>' +
        '</div>' +
        '<div class="transaction-amount ' + transaction.type + '">' +
            (isIncome ? '+' : '-') + formatCurrency(transaction.amount) + '</div>' +
        '<div class="transaction-actions">' +
            '<button onclick="editTransaction(\'' + transaction.id + '\')"><i class="fas fa-edit"></i></button>' +
            '<button onclick="deleteTransaction(\'' + transaction.id + '\')"><i class="fas fa-trash"></i></button>' +
        '</div>';
    
    container.insertBefore(div, container.firstChild);
    
    // Smooth fast animation - no delay
    requestAnimationFrame(function() {
        div.style.transition = 'opacity 0.15s ease-out, transform 0.15s ease-out';
        div.style.opacity = '1';
        div.style.transform = 'translateX(0)';
    });
}

function removeTransactionItem(element) {
    element.style.transition = 'opacity 0.15s ease-out, transform 0.15s ease-out';
    element.style.opacity = '0';
    element.style.transform = 'translateX(20px)';
    
    setTimeout(function() {
        element.remove();
    }, 300);
}

function showSuccessAnimation(element) {
    element.classList.add('success-checkmark');
    setTimeout(function() {
        element.classList.remove('success-checkmark');
    }, 400);
}

function showErrorAnimation(element) {
    element.style.animation = 'warningShake 0.5s ease-in-out';
    setTimeout(function() {
        element.style.animation = '';
    }, 500);
}

function showLoadingSkeleton(element, lines) {
    lines = lines || 3;
    var html = '';
    for (var i = 0; i < lines; i++) {
        html += '<div class="skeleton" style="height: 20px; margin-bottom: 10px; width: ' + (70 + Math.random() * 30) + '%"></div>';
    }
    element.innerHTML = html;
}

function showToast(message, type, duration) {
    type = type || 'info';
    duration = duration || 3000;
    
    var container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999;';
        document.body.appendChild(container);
    }
    
    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.style.cssText = 'background: var(--bg-card); padding: 16px 20px; border-radius: 8px; box-shadow: var(--shadow-lg); margin-bottom: 10px; max-width: 300px; display: flex; align-items: center; gap: 12px;';
    
    var iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    var colorVar = 'var(--info)';
    if (type === 'success') colorVar = 'var(--success)';
    else if (type === 'error') colorVar = 'var(--danger)';
    else if (type === 'warning') colorVar = 'var(--warning)';
    
    toast.innerHTML = '<i class="fas ' + iconMap[type] + '" style="color: ' + colorVar + '; font-size: 1.2rem;"></i>' +
        '<span style="color: var(--text-primary);">' + message + '</span>';
    
    container.appendChild(toast);
    
    requestAnimationFrame(function() {
        toast.classList.add('show');
    });
    
    setTimeout(function() {
        toast.classList.remove('show');
        setTimeout(function() { toast.remove(); }, 300);
    }, duration);
}

function animateDashboard() {
    // Animate summary cards
    var summaryCards = document.querySelectorAll('.summary-card');
    summaryCards.forEach(function(card, index) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(function() {
            card.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
    
    // Animate budget progress
    var budgetProgress = document.getElementById('budgetProgress');
    if (budgetProgress) {
        var targetWidth = parseFloat(budgetProgress.style.width) || 0;
        budgetProgress.style.width = '0%';
        setTimeout(function() {
            animateProgressBar(budgetProgress, targetWidth, 1000);
        }, 500);
    }
    
    // Animate chart containers
    var chartContainers = document.querySelectorAll('.charts-row .chart-container');
    chartContainers.forEach(function(chart, index) {
        chart.style.opacity = '0';
        chart.style.transform = 'scale(0.95)';
        
        setTimeout(function() {
            chart.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            chart.style.opacity = '1';
            chart.style.transform = 'scale(1)';
        }, 400 + (index * 150));
    });
    
    // Animate counter values
    setTimeout(function() {
        var incomeEl = document.getElementById('dailyIncome');
        var expenseEl = document.getElementById('dailyExpenses');
        var balanceEl = document.getElementById('netBalance');
        var budgetEl = document.getElementById('budgetUsed');
        
        var filteredTransactions = getFilteredTransactions();
        var income = filteredTransactions.filter(function(t) { return t.type === 'income'; }).reduce(function(sum, t) { return sum + t.amount; }, 0);
        var expenses = filteredTransactions.filter(function(t) { return t.type === 'expense'; }).reduce(function(sum, t) { return sum + t.amount; }, 0);
        var balance = income - expenses;
        
        var totalBudget = AppState.budgets.reduce(function(sum, b) { return sum + b.amount; }, 0);
        var budgetUsed = totalBudget > 0 ? (expenses / totalBudget) * 100 : 0;
        
        if (incomeEl) animateCounter(incomeEl, income, 800);
        if (expenseEl) animateCounter(expenseEl, expenses, 800);
        if (balanceEl) animateCounter(balanceEl, Math.abs(balance), 800);
        if (budgetEl) animateCounter(budgetEl, Math.min(budgetUsed, 100), 800);
    }, 600);
}

// ========================================
// STORAGE FUNCTIONS
// ========================================

function loadFromStorage() {
    // Check if this is first visit
    var firstVisit = localStorage.getItem('budgetwise_first_visit');
    
    if (firstVisit === 'false') {
        // Not first visit - load existing data from localStorage
        AppState.firstVisit = false;
        
        var savedTransactions = localStorage.getItem('budgetwise_transactions');
        var savedBudgets = localStorage.getItem('budgetwise_budgets');
        var savedCurrency = localStorage.getItem('budgetwise_currency');
        var savedTheme = localStorage.getItem('budgetwise_theme');
        var savedSettings = localStorage.getItem('budgetwise_settings');
        
        AppState.transactions = savedTransactions ? JSON.parse(savedTransactions) : [];
        AppState.budgets = savedBudgets ? JSON.parse(savedBudgets) : [];
        AppState.currency = savedCurrency || 'INR';
        AppState.theme = savedTheme || 'dark';
        AppState.settings = savedSettings ? JSON.parse(savedSettings) : {};
    } else {
        // First visit - initialize empty (no sample data)
        AppState.firstVisit = true;
        AppState.transactions = [];
        AppState.budgets = [];
        AppState.notifications = [];
    }
}

function saveToStorage() {
    localStorage.setItem('budgetwise_first_visit', 'false');
    localStorage.setItem('budgetwise_transactions', JSON.stringify(AppState.transactions));
    localStorage.setItem('budgetwise_budgets', JSON.stringify(AppState.budgets));
    localStorage.setItem('budgetwise_notifications', JSON.stringify(AppState.notifications));
    localStorage.setItem('budgetwise_currency', AppState.currency);
    localStorage.setItem('budgetwise_theme', AppState.theme);
    localStorage.setItem('budgetwise_settings', JSON.stringify(AppState.settings || {}));
}

// ========================================
// SAMPLE DATA
// ========================================

function generateSampleData() {
    var today = new Date();
    var sampleTransactions = [];
    
    for (var i = 0; i < 30; i++) {
        var date = new Date(today);
        date.setDate(date.getDate() - i);
        
        var numTransactions = Math.floor(Math.random() * 4) + 2;
        
        for (var j = 0; j < numTransactions; j++) {
            var isIncome = Math.random() > 0.7;
            var categories = isIncome ? 
                ['salary', 'investments', 'freelance', 'other_income'] :
                ['food', 'transportation', 'shopping', 'bills', 'entertainment', 'health'];
            
            var category = categories[Math.floor(Math.random() * categories.length)];
            var amount = isIncome ? 
                Math.floor(Math.random() * 3000) + 500 :
                Math.floor(Math.random() * 200) + 10;
            
            sampleTransactions.push({
                id: generateId(),
                type: isIncome ? 'income' : 'expense',
                amount: amount,
                category: category,
                description: (Categories[category].name || category) + ' - ' + (isIncome ? 'Received' : 'Spent'),
                date: date.toISOString().split('T')[0],
                time: String(Math.floor(Math.random() * 24)).padStart(2, '0') + ':' + String(Math.floor(Math.random() * 60)).padStart(2, '0'),
                tags: [],
                receipt: null,
                createdAt: date.toISOString()
            });
        }
    }
    
    AppState.transactions = sampleTransactions;
    
    AppState.budgets = [
        {
            id: generateId(),
            category: 'food',
            amount: 500,
            period: 'monthly',
            alertThreshold: 80,
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            category: 'transportation',
            amount: 200,
            period: 'monthly',
            alertThreshold: 80,
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            category: 'entertainment',
            amount: 150,
            period: 'monthly',
            alertThreshold: 80,
            createdAt: new Date().toISOString()
        }
    ];
    
    saveToStorage();
}

// ========================================
// EVENT LISTENERS
// ========================================

function setupEventListeners() {
    // Welcome screen
    document.getElementById('getStartedBtn').addEventListener('click', handleGetStarted);
    
    // Navigation
    document.querySelectorAll('.nav-item, .bottom-nav-item').forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToSection(item.dataset.section);
        });
    });
    
    document.querySelectorAll('.view-all').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToSection(link.dataset.section);
        });
    });
    
    // Mobile menu
    document.getElementById('mobileMenuBtn').addEventListener('click', toggleMobileMenu);
    document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
    
    // Date filters
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            setDateFilter(btn.dataset.filter);
        });
    });
    
    document.getElementById('applyCustomRange').addEventListener('click', applyCustomDateRange);
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('themeSelect').addEventListener('change', function(e) {
        setTheme(e.target.value);
    });
    
    // Quick add button
    document.getElementById('quickAddBtn').addEventListener('click', function() {
        openTransactionModal();
    });
    document.getElementById('addTransactionBtn').addEventListener('click', function() {
        openTransactionModal();
    });
    
    // Transaction modal
    var closeTxModal = document.getElementById('closeTransactionModal');
    if (closeTxModal) closeTxModal.addEventListener('click', closeTransactionModal);
    var cancelTx = document.getElementById('cancelTransaction');
    if (cancelTx) cancelTx.addEventListener('click', closeTransactionModal);
    var txForm = document.getElementById('transactionForm');
    if (txForm) txForm.addEventListener('submit', handleTransactionSubmit);
    var txType = document.getElementById('transactionType');
    if (txType) txType.addEventListener('change', updateCategoryOptions);
    
    // Budget modal
    var addBudgetBtn = document.getElementById('addBudgetBtn');
    if (addBudgetBtn) addBudgetBtn.addEventListener('click', function() { openBudgetModal(); });
    var closeBdgtModal = document.getElementById('closeBudgetModal');
    if (closeBdgtModal) closeBdgtModal.addEventListener('click', closeBudgetModal);
    var cancelBdgt = document.getElementById('cancelBudget');
    if (cancelBdgt) cancelBdgt.addEventListener('click', closeBudgetModal);
    var bdgtForm = document.getElementById('budgetForm');
    if (bdgtForm) bdgtForm.addEventListener('submit', handleBudgetSubmit);
    
    // Transaction filters
    document.getElementById('filterType').addEventListener('change', filterTransactions);
    document.getElementById('filterCategory').addEventListener('change', filterTransactions);
    document.getElementById('filterSearch').addEventListener('input', filterTransactions);
    document.getElementById('clearFilters').addEventListener('click', clearFilters);
    
    // Notifications
    document.getElementById('notificationBtn').addEventListener('click', toggleNotificationPanel);
    
    // Settings
    document.getElementById('currencySelect').addEventListener('change', function(e) {
        setCurrency(e.target.value);
    });
    
    // Export/Import buttons
    document.getElementById('exportJSON').addEventListener('click', exportToJSON);
    document.getElementById('importJSON').addEventListener('change', importFromJSON);
    document.getElementById('deleteAllData').addEventListener('click', deleteAllData);
    
    // Chart period selectors
    document.getElementById('expenseChartPeriod').addEventListener('change', updateExpenseChart);
    document.getElementById('trendChartPeriod').addEventListener('change', updateTrendChart);
    
    // Close modals on outside click
    document.querySelectorAll('.modal').forEach(function(modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// ========================================
// NAVIGATION
// ========================================

function navigateToSection(section) {
    var currentSection = document.querySelector('.section.active');
    var targetSection = section;
    
    document.querySelectorAll('.nav-item, .bottom-nav-item').forEach(function(item) {
        item.classList.remove('active');
        if (item.dataset.section === section) {
            item.classList.add('active');
        }
    });
    
    document.querySelectorAll('.section').forEach(function(s) {
        s.classList.remove('active');
    });
    document.getElementById(section + 'Section').classList.add('active');
    
    // Animate section elements
    animateSectionElements(section);
    
    if (section === 'transactions') {
        renderAllTransactions();
    } else if (section === 'budgets') {
        renderBudgets();
    } else if (section === 'analytics') {
        updateAnalyticsCharts();
    } else if (section === 'dashboard') {
        animateDashboard();
    }
    
    document.getElementById('sidebar').classList.remove('active');
}

function toggleMobileMenu() {
    document.getElementById('sidebar').classList.toggle('active');
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

// ========================================
// WELCOME SCREEN
// ========================================

function checkWelcomeState() {
    var welcomeScreen = document.getElementById('welcomeScreen');
    var appContainer = document.getElementById('appContainer');
    
    if (AppState.firstVisit) {
        welcomeScreen.classList.remove('hidden');
        appContainer.classList.add('hidden');
    } else {
        welcomeScreen.classList.add('hidden');
        appContainer.classList.remove('hidden');
    }
}

function handleGetStarted() {
    localStorage.setItem('budgetwise_first_visit', 'false');
    AppState.firstVisit = false;
    
    // Start with empty transactions - no sample data
    AppState.transactions = [];
    AppState.budgets = [];
    
    saveToStorage();
    
    document.getElementById('welcomeScreen').classList.add('hidden');
    document.getElementById('appContainer').classList.remove('hidden');
    
    updateDashboard();
    showToast('Welcome to MY BUDGET! Start tracking your finances.', 'success');
    
    // Animate dashboard after showing app
    setTimeout(animateDashboard, 300);
}

// ========================================
// DATE FILTERS
// ========================================

function setDateFilter(filter) {
    AppState.currentFilter = filter;
    
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    if (filter === 'custom') {
        document.getElementById('customDateRange').classList.remove('hidden');
    } else {
        document.getElementById('customDateRange').classList.add('hidden');
        updateDashboard();
    }
}

function applyCustomDateRange() {
    var startDate = document.getElementById('startDate').value;
    var endDate = document.getElementById('endDate').value;
    
    if (!startDate || !endDate) {
        showToast('Please select both dates', 'error');
        return;
    }
    
    AppState.customDateRange = { start: startDate, end: endDate };
    updateDashboard();
}

function getFilteredTransactions() {
    var now = new Date();
    var startDate, endDate;
    
    switch (AppState.currentFilter) {
        case 'day':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            break;
        case 'week':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            break;
        case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            break;
        case 'year':
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear() + 1, 0, 1);
            break;
        case 'custom':
            if (AppState.customDateRange.start && AppState.customDateRange.end) {
                startDate = new Date(AppState.customDateRange.start);
                endDate = new Date(AppState.customDateRange.end);
                endDate.setDate(endDate.getDate() + 1);
            } else {
                startDate = new Date(0);
                endDate = new Date();
            }
            break;
        default:
            startDate = new Date(0);
            endDate = new Date();
    }
    
    return AppState.transactions.filter(function(t) {
        var transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate < endDate;
    });
}

// ========================================
// THEME
// ========================================

function initializeTheme() {
    setTheme(AppState.theme);
    document.getElementById('themeSelect').value = AppState.theme;
}

function setTheme(theme) {
    AppState.theme = theme;
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('budgetwise_theme', theme);
    
    var icon = document.querySelector('#themeToggle i');
    if (theme === 'dark' || theme === 'neon') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
    
    updateChartsTheme();
}

function toggleTheme() {
    var themes = ['dark', 'light', 'neon', 'minimal'];
    var currentIndex = themes.indexOf(AppState.theme);
    var nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
    document.getElementById('themeSelect').value = themes[nextIndex];
}

function updateChartsTheme() {
    var textColor = getComputedStyle(document.body).getPropertyValue('--text-primary').trim();
    var gridColor = getComputedStyle(document.body).getPropertyValue('--border-color').trim();
    
    Object.values(AppState.charts).forEach(function(chart) {
        if (chart && chart.options) {
            if (chart.options.scales) {
                Object.values(chart.options.scales).forEach(function(scale) {
                    if (scale.ticks) scale.ticks.color = textColor;
                    if (scale.grid) scale.grid.color = gridColor;
                });
            }
            if (chart.options.plugins && chart.options.plugins.legend) {
                chart.options.plugins.legend.labels.color = textColor;
            }
            chart.update();
        }
    });
}

// ========================================
// CURRENCY
// ========================================

function setCurrency(currency) {
    AppState.currency = currency;
    localStorage.setItem('budgetwise_currency', currency);
    updateDashboard();
}

function formatCurrency(amount) {
    var symbol = CurrencySymbols[AppState.currency] || '$';
    return symbol + Math.abs(amount).toFixed(2);
}

// ========================================
// DASHBOARD
// ========================================

function updateDashboard() {
    updateSummaryCards();
    updateBudgetProgress();
    updateRecentTransactions();
    updateInsights();
    updateCharts();
}

function updateSummaryCards() {
    var filteredTransactions = getFilteredTransactions();
    
    var income = filteredTransactions
        .filter(function(t) { return t.type === 'income'; })
        .reduce(function(sum, t) { return sum + t.amount; }, 0);
    
    var expenses = filteredTransactions
        .filter(function(t) { return t.type === 'expense'; })
        .reduce(function(sum, t) { return sum + t.amount; }, 0);
    
    var balance = income - expenses;
    
    var totalBudget = AppState.budgets.reduce(function(sum, b) { return sum + b.amount; }, 0);
    var budgetUsed = totalBudget > 0 ? (expenses / totalBudget) * 100 : 0;
    
    document.getElementById('dailyIncome').textContent = formatCurrency(income);
    document.getElementById('dailyExpenses').textContent = formatCurrency(expenses);
    document.getElementById('netBalance').textContent = formatCurrency(balance);
    document.getElementById('budgetUsed').textContent = Math.min(budgetUsed, 100).toFixed(1) + '%';
    
    var progressFill = document.getElementById('budgetProgress');
    progressFill.style.width = Math.min(budgetUsed, 100) + '%';
    
    updateChangeIndicators(income, expenses, balance);
}

function updateChangeIndicators(income, expenses, balance) {
    var previousTransactions = getPreviousPeriodTransactions();
    var prevIncome = previousTransactions.filter(function(t) { return t.type === 'income'; }).reduce(function(sum, t) { return sum + t.amount; }, 0);
    var prevExpenses = previousTransactions.filter(function(t) { return t.type === 'expense'; }).reduce(function(sum, t) { return sum + t.amount; }, 0);
    var prevBalance = prevIncome - prevExpenses;
    
    var incomeChange = prevIncome > 0 ? ((income - prevIncome) / prevIncome) * 100 : 0;
    var expenseChange = prevExpenses > 0 ? ((expenses - prevExpenses) / prevExpenses) * 100 : 0;
    var balanceChange = prevBalance !== 0 ? ((balance - prevBalance) / Math.abs(prevBalance)) * 100 : 0;
    
    updateChangeDisplay('incomeChange', incomeChange);
    updateChangeDisplay('expenseChange', -expenseChange);
    updateChangeDisplay('balanceChange', balanceChange);
}

function updateChangeDisplay(elementId, change) {
    var element = document.getElementById(elementId);
    var isPositive = change >= 0;
    element.textContent = (isPositive ? '+' : '') + change.toFixed(1) + '%';
    element.className = 'card-change ' + (isPositive ? 'positive' : 'negative');
}

function getPreviousPeriodTransactions() {
    var now = new Date();
    var startDate, endDate;
    
    switch (AppState.currentFilter) {
        case 'day':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case 'week':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 7);
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
            break;
        case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            endDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case 'year':
            startDate = new Date(now.getFullYear() - 1, 0, 1);
            endDate = new Date(now.getFullYear(), 0, 1);
            break;
        default:
            return [];
    }
    
    return AppState.transactions.filter(function(t) {
        var transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate < endDate;
    });
}

// ========================================
// BUDGET PROGRESS
// ========================================

function updateBudgetProgress() {
    var budgetCardsContainer = document.getElementById('budgetCards');
    var filteredTransactions = getFilteredTransactions();
    
    if (AppState.budgets.length === 0) {
        budgetCardsContainer.innerHTML = '<div class="empty-state"><i class="fas fa-piggy-bank"></i><p>No budgets set yet. Create your first budget!</p></div>';
        return;
    }
    
    budgetCardsContainer.innerHTML = AppState.budgets.map(function(budget) {
        var spent = filteredTransactions
            .filter(function(t) { return t.type === 'expense' && t.category === budget.category; })
            .reduce(function(sum, t) { return sum + t.amount; }, 0);
        
        var percentage = (spent / budget.amount) * 100;
        var remaining = budget.amount - spent;
        
        var statusClass = 'safe';
        if (percentage >= 100) statusClass = 'danger';
        else if (percentage >= budget.alertThreshold) statusClass = 'warning';
        
        var category = Categories[budget.category] || { name: budget.category, icon: '📊' };
        
        return '<div class="budget-card animate-in">' +
            '<div class="budget-card-header">' +
                '<div class="budget-category">' +
                    '<div class="budget-category-icon">' + category.icon + '</div>' +
                    '<span class="budget-category-name">' + category.name + '</span>' +
                '</div>' +
            '</div>' +
            '<div class="budget-amounts">' +
                '<span class="budget-spent">' + formatCurrency(spent) + ' spent</span>' +
                '<span class="budget-limit">of ' + formatCurrency(budget.amount) + '</span>' +
            '</div>' +
            '<div class="budget-progress">' +
                '<div class="budget-progress-fill ' + statusClass + '" style="width: ' + Math.min(percentage, 100) + '%"></div>' +
            '</div>' +
            '<div class="budget-status">' +
                (remaining > 0 ? formatCurrency(remaining) + ' remaining' : formatCurrency(Math.abs(remaining)) + ' over budget') +
            '</div>' +
        '</div>';
    }).join('');
}

// ========================================
// RECENT TRANSACTIONS
// ========================================

function updateRecentTransactions() {
    var container = document.getElementById('recentTransactions');
    var recentTransactions = AppState.transactions
        .sort(function(a, b) { return new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time); })
        .slice(0, 5);
    
    if (recentTransactions.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-receipt"></i><p>No transactions yet. Add your first transaction!</p></div>';
        return;
    }
    
    container.innerHTML = recentTransactions.map(function(transaction, index) {
        var category = Categories[transaction.category] || { name: transaction.category, icon: '📊' };
        var isIncome = transaction.type === 'income';
        
        return '<div class="transaction-item" style="animation-delay: ' + (index * 0.02) + 's">' +
            '<div class="transaction-icon ' + transaction.type + '">' + category.icon + '</div>' +
            '<div class="transaction-details">' +
                '<div class="transaction-title">' + (transaction.description || category.name) + '</div>' +
                '<div class="transaction-meta">' +
                    '<span>' + category.name + '</span>' +
                    '<span>•</span>' +
                    '<span>' + formatDate(transaction.date) + '</span>' +
                '</div>' +
            '</div>' +
            '<div class="transaction-amount ' + transaction.type + '">' +
                (isIncome ? '+' : '-') + formatCurrency(transaction.amount) +
            '</div>' +
            '<div class="transaction-actions">' +
                '<button onclick="editTransaction(\'' + transaction.id + '\')"><i class="fas fa-edit"></i></button>' +
                '<button onclick="deleteTransaction(\'' + transaction.id + '\')"><i class="fas fa-trash"></i></button>' +
            '</div>' +
        '</div>';
    }).join('');
    
    // Trigger animation - instant, no delay
    requestAnimationFrame(function() {
        container.querySelectorAll('.transaction-item').forEach(function(item) {
            item.classList.add('animate-in');
        });
    });
}

// ========================================
// INSIGHTS
// ========================================

function updateInsights() {
    var container = document.getElementById('insightsGrid');
    var insights = generateInsights();
    
    container.innerHTML = insights.map(function(insight, index) {
        return '<div class="insight-card animate-in" style="animation-delay: ' + (index * 0.1) + 's">' +
            '<div class="insight-icon">' +
                '<i class="' + insight.icon + '"></i>' +
            '</div>' +
            '<div class="insight-content">' +
                '<div class="insight-title">' + insight.title + '</div>' +
                '<p class="insight-description">' + insight.description + '</p>' +
            '</div>' +
        '</div>';
    }).join('');
}

function generateInsights() {
    var insights = [];
    var filteredTransactions = getFilteredTransactions();
    
    var expenses = filteredTransactions.filter(function(t) { return t.type === 'expense'; });
    var income = filteredTransactions.filter(function(t) { return t.type === 'income'; });
    
    var totalExpenses = expenses.reduce(function(sum, t) { return sum + t.amount; }, 0);
    var totalIncome = income.reduce(function(sum, t) { return sum + t.amount; }, 0);
    
    var categoryTotals = {};
    expenses.forEach(function(t) {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    
    var topCategory = Object.entries(categoryTotals).sort(function(a, b) { return b[1] - a[1]; })[0];
    
    if (topCategory) {
        var category = Categories[topCategory[0]];
        insights.push({
            icon: 'fas fa-chart-pie',
            title: 'Top Spending Category',
            description: 'You spent the most on ' + (category ? category.name : topCategory[0]) + ' (' + formatCurrency(topCategory[1]) + ')'
        });
    }
    
    if (totalIncome > 0) {
        var savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
        insights.push({
            icon: 'fas fa-piggy-bank',
            title: 'Savings Rate',
            description: "You're saving " + savingsRate.toFixed(1) + '% of your income this period'
        });
    }
    
    if (expenses.length > 0) {
        var avgExpense = totalExpenses / expenses.length;
        insights.push({
            icon: 'fas fa-calculator',
            title: 'Average Expense',
            description: 'Your average expense is ' + formatCurrency(avgExpense)
        });
    }
    
    return insights;
}

// ========================================
// TRANSACTION MODAL
// ========================================

function openTransactionModal(transactionId) {
    var modal = document.getElementById('transactionModal');
    modal.classList.add('active');
    
    if (transactionId) {
        var transaction = AppState.transactions.find(function(t) { return t.id === transactionId; });
        if (transaction) {
            document.getElementById('transactionId').value = transaction.id;
            document.getElementById('transactionType').value = transaction.type;
            document.getElementById('transactionAmount').value = transaction.amount;
            document.getElementById('transactionCategory').value = transaction.category;
            document.getElementById('transactionDescription').value = transaction.description || '';
            document.getElementById('transactionDate').value = transaction.date;
            updateCategoryOptions();
        }
    } else {
        document.getElementById('transactionForm').reset();
        document.getElementById('transactionId').value = '';
        document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
        updateCategoryOptions();
    }
}

function closeTransactionModal() {
    document.getElementById('transactionModal').classList.remove('active');
}

function updateCategoryOptions() {
    var type = document.getElementById('transactionType').value;
    var categorySelect = document.getElementById('transactionCategory');
    
    var filteredCategories = Object.entries(Categories)
        .filter(function(c) { return c[1].type === type; });
    
    categorySelect.innerHTML = filteredCategories.map(function(c) {
        return '<option value="' + c[0] + '">' + c[1].icon + ' ' + c[1].name + '</option>';
    }).join('');
}

function handleTransactionSubmit(e) {
    e.preventDefault();
    
    var id = document.getElementById('transactionId').value;
    var type = document.getElementById('transactionType').value;
    var amount = parseFloat(document.getElementById('transactionAmount').value);
    var category = document.getElementById('transactionCategory').value;
    var description = document.getElementById('transactionDescription').value;
    var date = document.getElementById('transactionDate').value;
    
    if (!amount || amount <= 0) {
        showToast('Please enter a valid amount', 'error');
        return;
    }
    
    if (id) {
        var index = AppState.transactions.findIndex(function(t) { return t.id === id; });
        if (index !== -1) {
            AppState.transactions[index] = Object.assign({}, AppState.transactions[index], {
                type, amount, category, description, date
            });
        }
    } else {
        AppState.transactions.push({
            id: generateId(),
            type,
            amount,
            category,
            description,
            date,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            tags: [],
            receipt: null,
            createdAt: new Date().toISOString()
        });
    }
    
    saveToStorage();
    updateDashboard();
    
    // Also update the all transactions view if it exists
    var allTransactionsContainer = document.getElementById('allTransactions');
    if (allTransactionsContainer && allTransactionsContainer.children.length > 0) {
        renderAllTransactions();
    }
    
    closeTransactionModal();
    
    if (id) {
        showToast('Transaction updated successfully!', 'success');
    } else {
        showToast('Transaction added successfully!', 'success');
    }
}

function editTransaction(id) {
    openTransactionModal(id);
}

function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        AppState.transactions = AppState.transactions.filter(function(t) { return t.id !== id; });
        saveToStorage();
        updateDashboard();
        
        // Also update the all transactions view if it exists
        var allTransactionsContainer = document.getElementById('allTransactions');
        if (allTransactionsContainer && allTransactionsContainer.children.length > 0) {
            renderAllTransactions();
        }
        
        showToast('Transaction deleted', 'success');
    }
}

// ========================================
// ALL TRANSACTIONS
// ========================================

function renderAllTransactions() {
    var container = document.getElementById('allTransactions');
    var transactions = getFilteredTransactions()
        .sort(function(a, b) { return new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time); });
    
    if (transactions.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-receipt"></i><p>No transactions found</p></div>';
        return;
    }
    
    container.innerHTML = transactions.map(function(transaction, index) {
        var category = Categories[transaction.category] || { name: transaction.category, icon: '📊' };
        var isIncome = transaction.type === 'income';
        
        return '<div class="transaction-item">' +
            '<div class="transaction-icon ' + transaction.type + '">' + category.icon + '</div>' +
            '<div class="transaction-details">' +
                '<div class="transaction-title">' + (transaction.description || category.name) + '</div>' +
                '<div class="transaction-meta">' +
                    '<span>' + category.name + '</span>' +
                    '<span>•</span>' +
                    '<span>' + formatDate(transaction.date) + '</span>' +
                '</div>' +
            '</div>' +
            '<div class="transaction-amount ' + transaction.type + '">' +
                (isIncome ? '+' : '-') + formatCurrency(transaction.amount) +
            '</div>' +
            '<div class="transaction-actions">' +
                '<button onclick="editTransaction(\'' + transaction.id + '\')"><i class="fas fa-edit"></i></button>' +
                '<button onclick="deleteTransaction(\'' + transaction.id + '\')"><i class="fas fa-trash"></i></button>' +
            '</div>' +
        '</div>';
    }).join('');
    
    // Animate in
    requestAnimationFrame(function() {
        container.querySelectorAll('.transaction-item').forEach(function(item) {
            item.classList.add('animate-in');
        });
    });
}

function filterTransactions() {
    renderAllTransactions();
}

function clearFilters() {
    document.getElementById('filterType').value = 'all';
    document.getElementById('filterCategory').value = 'all';
    document.getElementById('filterSearch').value = '';
    renderAllTransactions();
}

// ========================================
// BUDGET MODAL
// ========================================

function openBudgetModal(budgetId) {
    var modal = document.getElementById('budgetModal');
    modal.classList.add('active');
    
    if (budgetId) {
        var budget = AppState.budgets.find(function(b) { return b.id === budgetId; });
        if (budget) {
            document.getElementById('budgetId').value = budget.id;
            document.getElementById('budgetCategory').value = budget.category;
            document.getElementById('budgetAmount').value = budget.amount;
            document.getElementById('budgetAlertThreshold').value = budget.alertThreshold;
        }
    } else {
        document.getElementById('budgetForm').reset();
        document.getElementById('budgetId').value = '';
    }
}

function closeBudgetModal() {
    document.getElementById('budgetModal').classList.remove('active');
}

function handleBudgetSubmit(e) {
    e.preventDefault();
    
    var id = document.getElementById('budgetId').value;
    var category = document.getElementById('budgetCategory').value;
    var amount = parseFloat(document.getElementById('budgetAmount').value);
    var alertThreshold = parseInt(document.getElementById('budgetAlertThreshold').value) || 80;
    
    if (!amount || amount <= 0) {
        showToast('Please enter a valid amount', 'error');
        return;
    }
    
    if (id) {
        var index = AppState.budgets.findIndex(function(b) { return b.id === id; });
        if (index !== -1) {
            AppState.budgets[index] = Object.assign({}, AppState.budgets[index], {
                category, amount, alertThreshold
            });
        }
    } else {
        AppState.budgets.push({
            id: generateId(),
            category,
            amount,
            period: 'monthly',
            alertThreshold,
            createdAt: new Date().toISOString()
        });
    }
    
    saveToStorage();
    updateBudgetProgress();
    closeBudgetModal();
    showToast('Budget saved successfully!', 'success');
}

function editBudget(id) {
    openBudgetModal(id);
}

function deleteBudget(id) {
    if (confirm('Are you sure you want to delete this budget?')) {
        AppState.budgets = AppState.budgets.filter(function(b) { return b.id !== id; });
        saveToStorage();
        updateBudgetProgress();
        showToast('Budget deleted', 'success');
    }
}

function renderBudgets() {
    var container = document.getElementById('budgetsGrid');
    
    if (AppState.budgets.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-piggy-bank"></i><p>No budgets set. Create your first budget!</p></div>';
        return;
    }
    
    var filteredTransactions = getFilteredTransactions();
    
    container.innerHTML = AppState.budgets.map(function(budget, index) {
        var spent = filteredTransactions
            .filter(function(t) { return t.type === 'expense' && t.category === budget.category; })
            .reduce(function(sum, t) { return sum + t.amount; }, 0);
        
        var percentage = (spent / budget.amount) * 100;
        var remaining = budget.amount - spent;
        
        var statusClass = 'safe';
        if (percentage >= 100) statusClass = 'danger';
        else if (percentage >= budget.alertThreshold) statusClass = 'warning';
        
        var category = Categories[budget.category] || { name: budget.category, icon: '📊' };
        
        return '<div class="budget-card animate-in" style="animation-delay: ' + (index * 0.1) + 's">' +
            '<div class="budget-card-header">' +
                '<div class="budget-category">' +
                    '<div class="budget-category-icon">' + category.icon + '</div>' +
                    '<span class="budget-category-name">' + category.name + '</span>' +
                '</div>' +
                '<div class="budget-actions">' +
                    '<button onclick="editBudget(\'' + budget.id + '\')"><i class="fas fa-edit"></i></button>' +
                    '<button onclick="deleteBudget(\'' + budget.id + '\')"><i class="fas fa-trash"></i></button>' +
                '</div>' +
            '</div>' +
            '<div class="budget-amounts">' +
                '<span class="budget-spent">' + formatCurrency(spent) + ' spent</span>' +
                '<span class="budget-limit">of ' + formatCurrency(budget.amount) + '</span>' +
            '</div>' +
            '<div class="budget-progress">' +
                '<div class="budget-progress-fill ' + statusClass + '" style="width: ' + Math.min(percentage, 100) + '%"></div>' +
            '</div>' +
            '<div class="budget-status">' +
                (remaining > 0 ? formatCurrency(remaining) + ' remaining' : formatCurrency(Math.abs(remaining)) + ' over budget') +
            '</div>' +
        '</div>';
    }).join('');
}

// ========================================
// NOTIFICATIONS
// ========================================

function toggleNotificationPanel() {
    var panel = document.getElementById('notificationPanel');
    panel.classList.toggle('active');
}

function checkBudgetAlerts() {
    var filteredTransactions = getFilteredTransactions();
    var expenses = filteredTransactions.filter(function(t) { return t.type === 'expense'; });
    
    AppState.budgets.forEach(function(budget) {
        var spent = expenses
            .filter(function(t) { return t.category === budget.category; })
            .reduce(function(sum, t) { return sum + t.amount; }, 0);
        
        var percentage = (spent / budget.amount) * 100;
        
        if (percentage >= budget.alertThreshold && !budget.alertShown) {
            var category = Categories[budget.category] || { name: budget.category };
            showToast('Warning: ' + category.name + ' budget is at ' + percentage.toFixed(0) + '%', 'warning');
            budget.alertShown = true;
        }
    });
}

// ========================================
// CHARTS
// ========================================

function initializeCharts() {
    createExpensePieChart();
    createTrendLineChart();
}

function createExpensePieChart() {
    var ctx = document.getElementById('expensePieChart');
    if (!ctx) return;
    
    var filteredTransactions = getFilteredTransactions();
    var expenses = filteredTransactions.filter(function(t) { return t.type === 'expense'; });
    
    var categoryTotals = {};
    expenses.forEach(function(t) {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    
    var labels = Object.keys(categoryTotals).map(function(c) {
        return (Categories[c] ? Categories[c].name : c);
    });
    var data = Object.values(categoryTotals);
    
    var colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6'];
    
    if (AppState.charts.expensePie) {
        AppState.charts.expensePie.destroy();
    }
    
    AppState.charts.expensePie = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, data.length),
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-primary').trim(),
                        padding: 15
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
}

function createTrendLineChart() {
    var ctx = document.getElementById('trendLineChart');
    if (!ctx) return;
    
    var filteredTransactions = getFilteredTransactions();
    
    var incomeByDate = {};
    var expenseByDate = {};
    
    filteredTransactions.forEach(function(t) {
        if (t.type === 'income') {
            incomeByDate[t.date] = (incomeByDate[t.date] || 0) + t.amount;
        } else {
            expenseByDate[t.date] = (expenseByDate[t.date] || 0) + t.amount;
        }
    });
    
    var allDates = Object.keys(Object.assign({}, incomeByDate, expenseByDate)).sort();
    var incomeData = allDates.map(function(d) { return incomeByDate[d] || 0; });
    var expenseData = allDates.map(function(d) { return expenseByDate[d] || 0; });
    
    if (AppState.charts.trendLine) {
        AppState.charts.trendLine.destroy();
    }
    
    AppState.charts.trendLine = new Chart(ctx, {
        type: 'line',
        data: {
            labels: allDates.map(function(d) { return formatDate(d); }),
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Expenses',
                    data: expenseData,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: getComputedStyle(document.body).getPropertyValue('--border-color').trim()
                    },
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-secondary').trim()
                    }
                },
                x: {
                    grid: {
                        color: getComputedStyle(document.body).getPropertyValue('--border-color').trim()
                    },
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-secondary').trim()
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-primary').trim()
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
}

function updateCharts() {
    createExpensePieChart();
    createTrendLineChart();
}

function updateExpenseChart() {
    createExpensePieChart();
}

function updateTrendChart() {
    createTrendLineChart();
}

function updateAnalyticsCharts() {
    // Similar to update charts for analytics section
    updateCharts();
}

// ========================================
// UTILITIES
// ========================================

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(dateStr) {
    var date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function startAutoRefresh() {
    setInterval(function() {
        updateDashboard();
    }, 60000);
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(function(reg) { console.log('Service Worker registered'); })
            .catch(function(err) { console.log('Service Worker registration failed:', err); });
    }
}

// ========================================
// DATA EXPORT/IMPORT
// ========================================

function exportToJSON() {
    var backupData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        transactions: AppState.transactions,
        budgets: AppState.budgets,
        settings: {
            currency: AppState.currency,
            theme: AppState.theme,
            notifications: document.getElementById('notificationsToggle') ? document.getElementById('notificationsToggle').checked : true,
            budgetAlertThreshold: parseInt(document.getElementById('budgetAlertThreshold') ? document.getElementById('budgetAlertThreshold').value : 80),
            autoResetBudgets: document.getElementById('autoResetBudgets') ? document.getElementById('autoResetBudgets').checked : true
        }
    };
    
    var json = JSON.stringify(backupData, null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'budgetwise-backup-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('Data exported successfully!', 'success');
}

function importFromJSON(event) {
    var file = event.target.files[0];
    if (!file) return;
    
    var reader = new FileReader();
    reader.onload = function(e) {
        try {
            var data = JSON.parse(e.target.result);
            
            if (!data.transactions || !data.budgets) {
                showToast('Invalid backup file format', 'error');
                return;
            }
            
            if (confirm('This will replace all your current data. Are you sure?')) {
                AppState.transactions = data.transactions || [];
                AppState.budgets = data.budgets || [];
                
                if (data.settings) {
                    AppState.currency = data.settings.currency || 'USD';
                    AppState.theme = data.settings.theme || 'dark';
                    
                    if (document.getElementById('currencySelect')) document.getElementById('currencySelect').value = AppState.currency;
                    if (document.getElementById('themeSelect')) document.getElementById('themeSelect').value = AppState.theme;
                    if (document.getElementById('notificationsToggle')) document.getElementById('notificationsToggle').checked = data.settings.notifications !== false;
                    if (document.getElementById('budgetAlertThreshold')) document.getElementById('budgetAlertThreshold').value = data.settings.budgetAlertThreshold || 80;
                    if (document.getElementById('autoResetBudgets')) document.getElementById('autoResetBudgets').checked = data.settings.autoResetBudgets !== false;
                }
                
                saveToStorage();
                updateDashboard();
                renderBudgets();
                renderAllTransactions();
                
                showToast('Data imported successfully!', 'success');
            }
        } catch (error) {
            console.error('Import error:', error);
            showToast('Error importing data. Invalid file format.', 'error');
        }
    };
    reader.readAsText(file);
    
    event.target.value = '';
}

function deleteAllData() {
    if (confirm('Are you sure you want to delete ALL data? This action cannot be undone!')) {
        if (confirm('This will permanently delete all your transactions, budgets, and settings. Continue?')) {
            localStorage.clear();
            AppState.transactions = [];
            AppState.budgets = [];
            AppState.notifications = [];
            AppState.firstVisit = true;
            
            checkWelcomeState();
            showToast('All data has been deleted', 'success');
        }
    }
}

// Function to clear existing sample data on app load
function clearExistingSampleDataIfNeeded() {
    // Check if we have data that looks like sample data (30+ transactions)
    var hasSampleData = AppState.transactions.length >= 30;
    
    if (hasSampleData) {
        // Clear the sample data and start fresh
        AppState.transactions = [];
        AppState.budgets = [];
        saveToStorage();
        
        // Show a toast to inform the user
        showToast('Sample data cleared. App is now fresh and ready to use!', 'info');
        
        // Update the dashboard to reflect the fresh state
        updateDashboard();
    }
}

// Make functions globally available
window.editTransaction = editTransaction;
window.deleteTransaction = deleteTransaction;
window.editBudget = editBudget;
window.deleteBudget = deleteBudget;
