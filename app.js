let modulePromise = null;
const MAX_CHUNK_SIZE = 100000; // process this many characters at a time

function loadModule() {
  if (modulePromise) {
    return modulePromise;
  }

  modulePromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'numora.js';
    script.onload = () => {
      if (typeof createNumoraModule === 'function') {
        resolve(createNumoraModule());
      } else {
        reject(new Error('numora.js did not expose createNumoraModule().'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load numora.js'));
    document.head.appendChild(script);
  });

  return modulePromise;
}

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return 'N/A';
  }
  return Number(value).toFixed(6).replace(/\.0+$|(?<=\.[0-9]*?)0+$/g, '');
}

function renderResult(rawText) {
  const output = document.getElementById('output');
  const lines = rawText.trim().split(/\n/).filter(Boolean);

  if (lines.length === 0) {
    output.textContent = 'Please enter at least one number.';
    return;
  }

  const values = lines.map((line) => Number(line));
  const labels = ['n', 'mean', 'sd', 'minimum', 'q1', 'median', 'q3', 'maximum'];
  const rows = labels.map((label, index) => [label, formatNumber(values[index])]);

  output.innerHTML = `
    <div class="output-grid">
      ${rows
        .map(([label, value]) => `
          <div class="label">${label}</div>
          <div>${value}</div>
        `)
        .join('')}
    </div>
  `;
}

async function calculate() {
  const runButton = document.getElementById('run');
  const output = document.getElementById('output');
  const textarea = document.getElementById('numbers');
  const fullText = textarea.value;

  runButton.disabled = true;
  runButton.textContent = 'Calculating...';
  output.textContent = 'Processing...';

  try {
    const mod = await loadModule();

    // Process in chunks to avoid blocking the UI
    let processedText = '';
    for (let i = 0; i < fullText.length; i += MAX_CHUNK_SIZE) {
      processedText += fullText.substring(i, i + MAX_CHUNK_SIZE);
      // Yield to allow UI updates
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    const ptr = mod.ccall('compute_stats', 'number', ['string'], [processedText]);
    const result = mod.UTF8ToString(ptr);
    mod._free(ptr);
    renderResult(result);
  } catch (error) {
    output.textContent = 'Error: ' + error.message;
  } finally {
    runButton.disabled = false;
    runButton.textContent = 'Calculate';
  }
}

function clearValues() {
  document.getElementById('numbers').value = '';
  document.getElementById('output').textContent = 'Enter numbers and click calculate.';
}

function loadSample() {
  document.getElementById('numbers').value = '12 15 18 20 22 25 100';
  calculate();
}

document.getElementById('run').addEventListener('click', calculate);
document.getElementById('sample').addEventListener('click', loadSample);
document.getElementById('clear').addEventListener('click', clearValues);
