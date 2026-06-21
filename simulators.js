// KUMBU Simulators

const simulators = {
    dado: {
        title: "🎲 Simulador de Dado",
        description: "Simule rolagens de um dado de 6 faces e veja como os resultados se distribuem.",
        faces: 6,
        simulate: function(n) {
            let results = [];
            for (let i = 0; i < n; i++) {
                results.push(Math.floor(Math.random() * this.faces) + 1);
            }
            return results;
        },
        getOdds: function() {
            const theoretical = (1 / this.faces * 100).toFixed(2);
            return `Cada número tem ${theoretical}% de chance (1 em ${this.faces})`;
        }
    },
    
    moeda: {
        title: "🪙 Simulador de Moeda",
        description: "Simule lançamentos de moeda (Cara/Coroa). Veja a convergência para 50%.",
        faces: 2,
        labels: ['Cara', 'Coroa'],
        simulate: function(n) {
            let results = [];
            for (let i = 0; i < n; i++) {
                results.push(Math.floor(Math.random() * 2) + 1);
            }
            return results;
        },
        getOdds: function() {
            return "Cara: 50% | Coroa: 50% (1 em 2)";
        }
    },
    
    crash: {
        title: "📈 Simulador Crash/Aviator",
        description: "Simule um jogo com multiplicador aleatório contínuo.",
        simulate: function(n) {
            let results = [];
            for (let i = 0; i < n; i++) {
                const multiplier = 1 + Math.pow(Math.random(), 0.3) * 99;
                results.push(Math.round(multiplier * 100) / 100);
            }
            return results;
        },
        getOdds: function() {
            return "Multiplicador médio esperado: ~2-3x | Risco aumenta com multiplicador";
        }
    },
    
    roleta: {
        title: "🔴 Simulador de Roleta",
        description: "Simule rolagem de roleta com 37 números (0-36). Entenda por que a casa vence.",
        faces: 37,
        simulate: function(n) {
            let results = [];
            for (let i = 0; i < n; i++) {
                results.push(Math.floor(Math.random() * this.faces));
            }
            return results;
        },
        getOdds: function() {
            const theoretical = (1 / this.faces * 100).toFixed(2);
            return `Cada número: ${theoretical}% | Vantagem da casa: 2.7%`;
        }
    },
    
    loteria: {
        title: "🎰 Simulador de Loteria",
        description: "Escolha números e veja as chances reais de ganhar na loteria.",
        totalNumbers: 60,
        chosenNumbers: 6,
        simulate: function(n) {
            let results = [];
            for (let i = 0; i < n; i++) {
                let drawn = new Set();
                while (drawn.size < this.chosenNumbers) {
                    drawn.add(Math.floor(Math.random() * this.totalNumbers) + 1);
                }
                results.push(Array.from(drawn).sort((a, b) => a - b).join(','));
            }
            return results;
        },
        getOdds: function() {
            const combinations = 50063860;
            const odds = (1 / combinations * 100000000).toFixed(2);
            return `Chance de ganhar: 1 em ${combinations.toLocaleString()} (${odds}%)!`;
        }
    }
};

function calculateStats(data) {
    const sorted = [...data].sort((a, b) => a - b);
    const n = data.length;
    const mean = data.reduce((a, b) => a + b, 0) / n;
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
    const stddev = Math.sqrt(variance);
    
    return {
        total: n,
        mean: mean.toFixed(2),
        stddev: stddev.toFixed(2),
        min: Math.min(...data),
        max: Math.max(...data)
    };
}

function getFrequency(data) {
    const freq = {};
    data.forEach(val => {
        if (typeof val === 'string') {
            freq[val] = (freq[val] || 0) + 1;
        } else {
            const bucket = Math.round(val * 10) / 10;
            freq[bucket] = (freq[bucket] || 0) + 1;
        }
    });
    return freq;
}