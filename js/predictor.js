// Motivational Standards (Approximate LCM 'A' times for Age Groups)
// Source: Heuristic approximation of USA Swimming Motional Standards
const MOTIVATIONAL_TIMES = {
    male: {
        '10': { '50_free': 38.0, '100_free': 109.0, '200_free': 230.0, '100_fly': 119.0, '100_bk': 120.0, '100_br': 130.0 },
        '12': { '50_free': 32.0, '100_free': 61.0, '200_free': 136.0, '100_fly': 70.0, '100_bk': 71.0, '100_br': 79.0 },
        '14': { '50_free': 29.5, '100_free': 56.5, '200_free': 124.0, '100_fly': 62.0, '100_bk': 64.0, '100_br': 70.0 },
        '16': { '50_free': 27.5, '100_free': 53.5, '200_free': 117.0, '100_fly': 58.0, '100_bk': 60.0, '100_br': 66.0 },
        '18': { '50_free': 25.5, '100_free': 51.5, '200_free': 113.0, '100_fly': 55.0, '100_bk': 57.0, '100_br': 63.0 },
        'open': { '50_free': 23.5, '100_free': 50.5, '200_free': 110.0, '100_fly': 55.0, '100_bk': 55.0, '100_br': 55.0 }
    },
    female: {
        '10': { '50_free': 38.5, '100_free': 110.0, '200_free': 235.0, '100_fly': 120.0, '100_bk': 122.0, '100_br': 132.0 },
        '12': { '50_free': 33.0, '100_free': 62.0, '200_free': 138.0, '100_fly': 71.0, '100_bk': 72.0, '100_br': 80.0 },
        '14': { '50_free': 30.0, '100_free': 59.5, '200_free': 129.0, '100_fly': 66.0, '100_bk': 67.0, '100_br': 75.0 },
        '16': { '50_free': 27.0, '100_free': 57.5, '200_free': 125.0, '100_fly': 64.0, '100_bk': 65.0, '100_br': 73.0 },
        '18': { '50_free': 26.0, '100_free': 56.5, '200_free': 123.0, '100_fly': 62.0, '100_bk': 63.0, '100_br': 71.0 },
        'open': { '50_free': 24.0, '100_free': 54.0, '200_free': 118.0, '100_fly': 58.0, '100_bk': 60.0, '100_br': 68.0 }
    }
};

const MAIN_TIPS = {
    '50_free': "Explosiveness is key. Work on your vertical jump and reaction time.",
    '100_free': "The second 50 defines the great swimmers. Train your backend speed.",
    '200_free': "Controlled speed. The first 100 should feel easy, the third 50 is where you win.",
    '100_fly': "Rhythm over muscle. Keep your hips high and chin low.",
    '100_bk': "Underwaters are the 'fifth stroke'. Master your dolphin kicks off every wall.",
    '100_br': "Streamline is everything. Reduce drag during your recovery phase."
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('predictorForm');
    const resultBox = document.getElementById('resultBox');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const event = document.getElementById('event').value;
            const age = parseInt(document.getElementById('age').value);
            const gender = document.getElementById('gender').value;
            const timeStr = document.getElementById('time').value;

            try {
                const timeInSeconds = parseTime(timeStr);
                const prediction = calculatePrediction(timeInSeconds, event, gender, age);
                displayResult(prediction);
            } catch (error) {
                alert("Please enter a valid time format like 24.50 or 1:02.30");
            }
        });
    }
});

function parseTime(timeStr) {
    if (timeStr.includes(':')) {
        const parts = timeStr.split(':');
        const min = parseFloat(parts[0]);
        const sec = parseFloat(parts[1]);
        if (isNaN(min) || isNaN(sec)) throw new Error("Invalid format");
        return (min * 60) + sec;
    } else {
        const sec = parseFloat(timeStr);
        if (isNaN(sec)) throw new Error("Invalid format");
        return sec;
    }
}

function getAgeGroup(age) {
    if (age <= 10) return '10';
    if (age <= 12) return '12';
    if (age <= 14) return '14';
    if (age <= 16) return '16';
    if (age <= 18) return '18';
    return 'open';
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = (seconds % 60).toFixed(2);
    return m > 0 ? `${m}:${s.padStart(5, '0')}` : s;
}

function calculatePrediction(userTime, event, gender, age) {
    const ageGroup = getAgeGroup(age);
    const standardTime = MOTIVATIONAL_TIMES[gender][ageGroup][event];
    const ratio = userTime / standardTime;

    let title, description, color;
    let projectedTime = userTime;
    let projectionMsg = "";

    // Realistic Projection Logic
    // Assumption: ~2% improvement per year until 19
    const yearsToPeak = Math.max(0, 19 - age);
    if (yearsToPeak > 0) {
        // Compound improvement
        // Top simmers improve less (diminishing returns), developed swimmers improve less
        // Simplified: 1.5% to 3% based on current speed
        let improvementRate = 0.975; // 2.5% drop
        if (ratio < 0.90) improvementRate = 0.99; // Already fast
        
        projectedTime = userTime * Math.pow(improvementRate, yearsToPeak);
        projectionMsg = `Based on your current trajectory, your projected potential at age 19 is <strong>${formatTime(projectedTime)}</strong>.`;
    }

    if (ratio < 0.85) {
        title = "Future Olympian (National Team Pace)";
        description = `ASTONISHING! You are faster than the elite 'AAAA' standard. ` + projectionMsg;
        color = "#ff0055"; 
    } else if (ratio < 0.90) {
        title = "Elite (AAAA Time)";
        description = `Top 2% of swimmers your age. Zone qualifying time. ` + projectionMsg;
        color = "#ffd700"; 
    } else if (ratio < 0.93) {
        title = "Advanced (AAA Time)";
        description = `Top 5-8% of swimmers. Great conditioning. ` + projectionMsg;
        color = "#c0c0c0"; 
    } else if (ratio < 0.965) {
        title = "Highly Competitive (AA Time)";
        description = `Top 15%. Respectful time. Focus on race details to drop to Triple-A.`;
        color = "#cd7f32"; 
    } else if (ratio <= 1.00) {
        title = "Competitive (A Time)";
        description = `Gold standard for age-group swimming. ` + projectionMsg;
        color = "#00b4d8"; 
    } else if (ratio < 1.10) {
        title = "Strong (BB Time)";
        description = `Above average. Work on endurance to break the next barrier.`;
        color = "#a78bfa"; 
    } else if (ratio < 1.20) {
        title = "Developing (B Time)";
        description = `Good start. Focus on maintaining good form when tired.`;
        color = "#9ca3af"; 
    } else {
        title = "Novice";
        description = `Welcome to the sport! Focus on long, smooth strokes. Speed follows technique.`;
        color = "#555";
    }

    // Get specific tip
    const specificTip = MAIN_TIPS[event] || "Visualize your race.";

    return { title, description, color, suggestion: specificTip };
}

function displayResult(prediction) {
    const resultBox = document.getElementById('resultBox');
    const titleEl = document.getElementById('predictionTitle');
    const descEl = document.getElementById('predictionDesc');
    const suggEl = document.getElementById('suggestion');

    titleEl.textContent = prediction.title;
    titleEl.style.color = prediction.color;
    descEl.innerHTML = prediction.description; // Enable HTML for bold time
    suggEl.textContent = prediction.suggestion;

    resultBox.classList.add('active');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
