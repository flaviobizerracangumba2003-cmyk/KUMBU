let currentSimulator = 'dado';
let currentResults = [];
let frequencyChart = null;
let cumulativeChart = null;

function loadSimulator(name) {
    currentSimulator = name;
    const sim = simulators[name];
    
    document.getElementById('sim-title').textContent = sim.title;
    document.getElementById('sim-description').textContent = sim.description;
    
    document.querySelectorAll('.simulator-selector .btn').forEach(btn => {
        btn.classList.remove('btn-active');
    });
    event.target.classList.add('btn-active');
    
    resetSimulation();
}

function runSimulation() {
    const simCount = parseInt(document.getElementById('simulations').value);
    const sim = simulators[currentSimulator];
    
    if (simCount < 10 || simCount > 100000) {
        alert('Digite um número entre 10 e 100.000');
        return;
    }
    
    currentResults = sim.simulate(simCount);
    updateStats();
    updateCharts();
}

function resetSimulation() {
    currentResults = [];
    document.getElementById('total-sims').textContent = '0';
    document.getElementById('avg').textContent = '0';
    document.getElementById('stddev').textContent = '0';
    document.getElementById('min').textContent = '0';
    document.getElementById('max').textContent = '0';
    document.getElementById('odds-comparison').textContent = simulators[currentSimulator].getOdds();
    
    if (frequencyChart) frequencyChart.destroy();
    if (cumulativeChart) cumulativeChart.destroy();
}

function updateStats() {
    const stats = calculateStats(currentResults);
    document.getElementById('total-sims').textContent = stats.total.toLocaleString();
    document.getElementById('avg').textContent = stats.mean;
    document.getElementById('stddev').textContent = stats.stddev;
    document.getElementById('min').textContent = stats.min;
    document.getElementById('max').textContent = stats.max;
    document.getElementById('odds-comparison').textContent = simulators[currentSimulator].getOdds();
}

function updateCharts() {
    const frequency = getFrequency(currentResults);
    const labels = Object.keys(frequency).sort((a, b) => {
        if (!isNaN(a) && !isNaN(b)) return a - b;
        return a.localeCompare(b);
    });
    const data = labels.map(k => frequency[k]);
    
    // Frequency Chart
    const ctxFreq = document.getElementById('frequencyChart').getContext('2d');
    if (frequencyChart) frequencyChart.destroy();
    frequencyChart = new Chart(ctxFreq, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Frequência',
                data: data,
                backgroundColor: 'rgba(99, 102, 241, 0.6)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 2,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#1f2937' },
                    grid: { color: 'rgba(0,0,0,0.1)' }
                },
                x: {
                    ticks: { color: '#1f2937' },
                    grid: { display: false }
                }
            }
        }
    });
    
    // Cumulative Chart
    let cumulative = 0;
    const cumulativeData = data.map(d => {
        cumulative += d;
        return (cumulative / currentResults.length * 100).toFixed(2);
    });
    
    const ctxCum = document.getElementById('cumulativeChart').getContext('2d');
    if (cumulativeChart) cumulativeChart.destroy();
    cumulativeChart = new Chart(ctxCum, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Distribuição Acumulada (%)',
                data: cumulativeData,
                borderColor: 'rgba(236, 72, 153, 1)',
                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: 'rgba(236, 72, 153, 1)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: '#1f2937', callback: v => v + '%' },
                    grid: { color: 'rgba(0,0,0,0.1)' }
                },
                x: {
                    ticks: { color: '#1f2937' },
                    grid: { display: false }
                }
            }
        }
    });
}

// Inicializar quando página carrega
window.addEventListener('load', () => {
    loadSimulator('dado');
});