// Database of Base Times (Approximate Elite/WR standards in seconds)
const STANDARDS = {
    male: {
        '50_free': 21.0,
        '100_free': 46.5,
        '200_free': 102.0, // 1:42.0
        '100_fly': 49.5,
        '100_bk': 51.6,
        '100_br': 57.0
    },
    female: {
        '50_free': 23.6,
        '100_free': 51.7,
        '200_free': 112.9, // 1:52.9
        '100_fly': 55.5,
        '100_bk': 57.3,
        '100_br': 64.1
    }
};

const SUGGESTIONS = [
    "Focus on your underwater dolphin kicks to drop time.",
    "Work on your reaction time off the blocks.",
    "Improve your turn mechanics; races are won off the wall.",
    "Increase your stroke rate while maintaining distance per stroke.",
    "Consistent breathing patterns will help endurance."
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

function calculatePrediction(userTime, event, gender, age) {
    const baseTime = STANDARDS[gender][event];

    // Calculate Ratio (User / Base)
    // 1.0 means World Record pace
    let ratio = userTime / baseTime;

    // Age Adjustment (Be more lenient for younger/older swimmers)
    // We "normalize" the ratio to what it would be for a prime age (20-25) swimmer
    let ageFactor = 1.0;

    if (age <= 10) ageFactor = 0.7; // 10 year olds are roughly 30% slower than pros naturally
    else if (age <= 12) ageFactor = 0.8;
    else if (age <= 14) ageFactor = 0.9;
    else if (age <= 18) ageFactor = 0.95;
    else if (age >= 40) ageFactor = 0.9; // Masters

    // Adjusted Ratio: If I am 10 and swim a time that gives ratio 1.5 (50% slower than WR),
    // My adjusted ratio might be 1.5 * 0.7 = 1.05 (Which is basically Olympic level for a 10yo)
    const adjustedRatio = ratio * ageFactor;

    let title, description, color;

    if (adjustedRatio < 1.15) {
        title = "Future Olympian";
        description = "Your trajectory is incredible. You are swimming at an elite level for your age.";
        color = "#ffd700"; // Gold
    } else if (adjustedRatio < 1.35) {
        title = "National Contender";
        description = "You have the speed to compete at the national level. Keep pushing!";
        color = "#64ffda"; // Cyan
    } else if (adjustedRatio < 1.6) {
        title = "State Champion";
        description = "You are well ahead of the pack. A solid collegiate career could be ahead.";
        color = "#00b4d8"; // Blue
    } else if (adjustedRatio < 2.0) {
        title = "Competitive Swimmer";
        description = "You have a strong foundation. Refine your technique to breakthrough to the next level.";
        color = "#a78bfa"; // Purple
    } else {
        title = "Developing Athlete";
        description = "Great start! Focus on technique and enjoying the water. Speed will come.";
        color = "#999";
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
