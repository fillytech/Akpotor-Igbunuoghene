// Main application logic for BVS
document.addEventListener('DOMContentLoaded', () => {
    console.log('Biological Verification System is ready!');
    // Additional logic will be added here
});

// Responsive Navigation Toggle (for mobile)
document.addEventListener('DOMContentLoaded', function () {
    // Mobile nav toggle (if you add a hamburger icon in nav)
    const nav = document.querySelector('nav ul');
    const hamburger = document.createElement('span');
    hamburger.innerHTML = '&#9776;';
    hamburger.style.fontSize = '2rem';
    hamburger.style.color = '#ffd700';
    hamburger.style.cursor = 'pointer';
    hamburger.style.display = 'none';
    hamburger.style.marginRight = '16px';
    hamburger.id = 'nav-toggle';
    nav.parentElement.insertBefore(hamburger, nav);

    function checkWidth() {
        if (window.innerWidth < 700) {
            nav.style.display = 'none';
            hamburger.style.display = 'inline-block';
        } else {
            nav.style.display = 'flex';
            hamburger.style.display = 'none';
        }
    }
    checkWidth();
    window.addEventListener('resize', checkWidth);

    hamburger.addEventListener('click', function () {
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    });

    // Dynamic KPI Cards
    const kpiData = [
        { label: 'Total Cases', value: 128 },
        { label: 'Biometric Captures', value: 87 },
        { label: 'Active Investigations', value: 14 },
        { label: 'Matches Found', value: 23 }
    ];
    const kpiContainer = document.getElementById('kpi-cards');
    if (kpiContainer) {
        kpiContainer.style.display = 'flex';
        kpiContainer.style.gap = '24px';
        kpiContainer.style.marginBottom = '32px';
        kpiData.forEach(kpi => {
            const card = document.createElement('div');
            card.className = 'kpi-card';
            card.style.background = 'linear-gradient(120deg, #002147 80%, #008751 100%)';
            card.style.color = '#ffd700';
            card.style.flex = '1';
            card.style.padding = '24px';
            card.style.borderRadius = '12px';
            card.style.boxShadow = '0 2px 12px rgba(0,33,71,0.10)';
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.alignItems = 'center';
            card.style.justifyContent = 'center';
            card.innerHTML = `<div style="font-size:2.2rem;font-weight:bold;">${kpi.value}</div>
                              <div style="margin-top:8px;font-size:1.1rem;">${kpi.label}</div>`;
            kpiContainer.appendChild(card);
        });
    }

    // Table row hover effect
    const table = document.querySelector('#recent-matches table');
    if (table) {
        table.querySelectorAll('tbody tr').forEach(row => {
            row.addEventListener('mouseenter', () => {
                row.style.background = '#f0f4f8';
            });
            row.addEventListener('mouseleave', () => {
                row.style.background = '';
            });
        });
    }
});
