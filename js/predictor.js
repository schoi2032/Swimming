// Motivational Standards (Approximate LCM 'A' times for Age Groups)
// Source: Heuristic approximation of USA Swimming Motional Standards (A/AA/AAA mixture)
const MOTIVATIONAL_TIMES = {
    male: {
        '10': { '50_free': 31.0, '100_free': 109.0, '200_free': 230.0, '100_fly': 119.0, '100_bk': 120.0, '100_br': 130.0 },
        '12': { '50_free': 28.0, '100_free': 61.0, '200_free': 136.0, '100_fly': 70.0, '100_bk': 71.0, '100_br': 79.0 },
        '14': { '50_free': 25.5, '100_free': 56.5, '200_free': 124.0, '100_fly': 62.0, '100_bk': 64.0, '100_br': 70.0 },
        '16': { '50_free': 24.5, '100_free': 53.5, '200_free': 117.0, '100_fly': 58.0, '100_bk': 60.0, '100_br': 66.0 },
        '18': { '50_free': 23.5, '100_free': 51.5, '200_free': 113.0, '100_fly': 55.0, '100_bk': 57.0, '100_br': 63.0 },
        'open': { '50_free': 22.5, '100_free': 49.5, '200_free': 108.0, '100_fly': 52.0, '100_bk': 54.0, '100_br': 60.0 }
    },
    female: {
        '10': { '50_free': 31.5, '100_free': 110.0, '200_free': 235.0, '100_fly': 120.0, '100_bk': 122.0, '100_br': 132.0 },
        '12': { '50_free': 28.5, '100_free': 62.0, '200_free': 138.0, '100_fly': 71.0, '100_bk': 72.0, '100_br': 80.0 },
        '14': { '50_free': 27.5, '100_free': 59.5, '200_free': 129.0, '100_fly': 66.0, '100_bk': 67.0, '100_br': 75.0 },
        '16': { '50_free': 26.5, '100_free': 57.5, '200_free': 125.0, '100_fly': 64.0, '100_bk': 65.0, '100_br': 73.0 },
        '18': { '50_free': 26.0, '100_free': 56.5, '200_free': 123.0, '100_fly': 62.0, '100_bk': 63.0, '100_br': 71.0 },
        'open': { '50_free': 25.0, '100_free': 54.0, '200_free': 118.0, '100_fly': 58.0, '100_bk': 60.0, '100_br': 68.0 }
    }
};

const SUGGESTIONS = [
    "Focus on your underwater dolphin kicks to drop time.",
    "Work on your reaction time off the blocks.",
    "Improve your turn mechanics; races are won off the wall.",
    "Increase your stroke rate while maintaining distance per stroke.",
    "Consistent breathing patterns will help endurance.",
    "Try incorporating High Intensity Interval Training (HIIT) for speed.",
    "Visualize your perfect race before you step on the blocks."
];

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
    // Handling MM:SS.ms or SS.ms
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

function calculatePrediction(userTime, event, gender, age) {
    const ageGroup = getAgeGroup(age);
    const standardTime = MOTIVATIONAL_TIMES[gender][ageGroup][event];

    // Performance Ratio (Lower is better)
    // 0.90 = 10% faster than standard (State/Zone)
    // 1.00 = Hits the standard (A time)
    // 1.10 = 10% slower than standard (B time)
    const ratio = userTime / standardTime;

    let title, description, color;

    if (ratio < 0.88) {
        title = "Elite / National Level";
        description = `Incredible! Your time is well below the 'A' standard for age ${age}. You are swimming at a Sectional or Junior National pace.`;
        color = "#ffd700"; // Gold
    } else if (ratio < 0.95) {
        title = "State / Zone Champion";
        description = `You are crushing the standard! You would be competitive at State Championships. Keep refining those details.`;
        color = "#64ffda"; // Cyan
    } else if (ratio <= 1.00) {
        title = "Advanced Competitor (A Time)";
        description = "You've hit the 'A' standard! This is a major milestone. Consistency is your next goal.";
        color = "#00b4d8"; // Blue
    } else if (ratio < 1.10) {
        title = "Strong Swimmer (BB Time)";
        description = "You are just off the A standard. Work on your turns and starts to find those extra seconds.";
        color = "#a78bfa"; // Purple
    } else if (ratio < 1.20) {
        title = "Developing Swimmer (B Time)";
        description = "Solid foundation. You have the mechanics, now you need the engine (endurance and power).";
        color = "#9ca3af"; // Gray
    } else {
        title = "Novice / C Time";
        description = "Welcome to the journey! Focus on technique over speed right now. Smooth is fast.";
        color = "#555";
    }

    return { title, description, color };
}

function displayResult(prediction) {
    const resultBox = document.getElementById('resultBox');
    const titleEl = document.getElementById('predictionTitle');
    const descEl = document.getElementById('predictionDesc');
    const suggEl = document.getElementById('suggestion');

    titleEl.textContent = prediction.title;
    titleEl.style.color = prediction.color;
    descEl.textContent = prediction.description;

    // Random suggestion
    suggEl.textContent = SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)];

    resultBox.classList.add('active');

    // Scroll result into view
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
