const sampleValues = [12, 15, 18, 20, 22, 25, 100];

function medianRange(data, left, right) {
  const length = right - left + 1;
  if (length <= 0) return 0;

  if (length % 2 === 1) {
    return data[left + Math.floor(length / 2)];
  }

  const a = data[left + length / 2 - 1];
  const b = data[left + length / 2];
  return (a + b) / 2;
}

function calculateStats(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;

  if (n === 0) {
    return null;
  }

  const mean = sorted.reduce((sum, value) => sum + value, 0) / n;
  const minimum = sorted[0];
  const maximum = sorted[n - 1];

  let median = 0;
  if (n % 2 === 0) {
    median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  } else {
    median = sorted[Math.floor(n / 2)];
  }

  let q1, q3;
  if (n === 1) {
    q1 = q3 = sorted[0];
  } else if (n % 2 === 1) {
    q1 = medianRange(sorted, 0, Math.floor(n / 2) - 1);
    q3 = medianRange(sorted, Math.floor(n / 2) + 1, n - 1);
  } else {
    q1 = medianRange(sorted, 0, n / 2 - 1);
    q3 = medianRange(sorted, n / 2, n - 1);
  }

  let squaredSum = 0;
  for (const value of sorted) {
    squaredSum += (value - mean) * (value - mean);
  }

  let sd = Number.NaN;
  if (n > 1) {
    sd = Math.sqrt(squaredSum / (n - 1));
  }

  return {
    n,
    mean,
    sd,
    minimum,
    q1,
    median,
    q3,
    maximum,
  };
}

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return 'N/A';
  }

  return Number(value).toFixed(6).replace(/\.0+$|(?<=\.[0-9]*?)0+$/g, '');
}

function renderStats(stats) {
  const output = document.getElementById('output');

  if (!stats) {
    output.textContent = 'Please enter at least one number.';
    return;
  }

  const rows = [
    ['n', stats.n],
    ['mean', formatNumber(stats.mean)],
    ['sd', formatNumber(stats.sd)],
    ['minimum', formatNumber(stats.minimum)],
    ['q1', formatNumber(stats.q1)],
    ['median', formatNumber(stats.median)],
    ['q3', formatNumber(stats.q3)],
    ['maximum', formatNumber(stats.maximum)],
  ];

  const html = `
    <div class="output-grid">
      ${rows
        .map(
          ([label, value]) => `
            <div class="label">${label}</div>
            <div>${value}</div>
          `
        )
        .join('')}
    </div>
  `;

  output.innerHTML = html;
}

function readInput() {
  const raw = document.getElementById('numbers').value;
  const values = raw
    .split(/[\s,]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map(Number)
    .filter((value) => Number.isFinite(value));

  return values;
}

function calculate() {
  const values = readInput();
  const stats = calculateStats(values);
  renderStats(stats);
}

function loadSample() {
  document.getElementById('numbers').value = sampleValues.join(' ');
  calculate();
}

document.getElementById('run').addEventListener('click', calculate);
document.getElementById('sample').addEventListener('click', loadSample);
