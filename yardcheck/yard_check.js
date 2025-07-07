// yard_check.js

let userName = '';
let userEmail = '';
let entries = [];

function verifyPin() {
  const pin = document.getElementById('pin-input').value;
  if (pin === '0125') {
    userName = 'Debra';
    userEmail = 'debbers@midsouthtruckandtrailer.net';
  } else if (pin === '2525') {
    userName = 'Corey';
    userEmail = 'corey@midsouthtruckandtrailer.net';
  } else {
    alert('Invalid PIN');
    return;
  }

  document.getElementById('username').textContent = userName;
  document.getElementById('login-section').classList.add('hidden');
  document.getElementById('form-section').classList.remove('hidden');
}

function updateLocationOptions() {
  const yard = document.getElementById('yard-location').value;
  const subLocation = document.getElementById('sub-location');
  const group = document.getElementById('sub-location-group');
  subLocation.innerHTML = '';

  if (yard === 'Pocahontas') {
    subLocation.innerHTML = '<option value="Peco in Pocahontas">Peco in Pocahontas</option>';
    group.classList.remove('hidden');
  } else if (yard === 'Batesville') {
    subLocation.innerHTML = [
      '<option value="OMP">OMP</option>',
      '<option value="Peco">Peco</option>',
      '<option value="Custom Craft">Custom Craft</option>'
    ].join('');
    group.classList.remove('hidden');
  } else {
    group.classList.add('hidden');
  }
}

function submitTrailerEntry() {
  const entry = {
    name: userName,
    location: document.getElementById('yard-location').value,
    sublocation: document.getElementById('sub-location').value,
    trailer: document.getElementById('trailer-number').value,
    status: document.getElementById('load-status').value,
    fuel: document.getElementById('fuel').value,
    temp: document.getElementById('temperature').value,
    washout: document.getElementById('washout').value,
    notes: document.getElementById('notes').value,
    timestamp: new Date().toLocaleString()
  };

  const summary = `
    <strong>Name:</strong> ${entry.name}<br>
    <strong>Location:</strong> ${entry.location} - ${entry.sublocation}<br>
    <strong>Trailer:</strong> ${entry.trailer}<br>
    <strong>Status:</strong> ${entry.status}<br>
    <strong>Fuel:</strong> ${entry.fuel}<br>
    <strong>Temp:</strong> ${entry.temp}&deg;F<br>
    <strong>Washout:</strong> ${entry.washout}<br>
    <strong>Notes:</strong> ${entry.notes}<br>
    <strong>Time:</strong> ${entry.timestamp}
  `;

  document.getElementById('entry-summary').innerHTML = summary;
  document.getElementById('form-section').classList.add('hidden');
  document.getElementById('confirmation-section').classList.remove('hidden');
  window.currentEntry = entry;
}

function confirmEntry(confirmed) {
  if (confirmed) {
    entries.push(window.currentEntry);
    document.getElementById('confirmation-section').classList.add('hidden');
    document.getElementById('more-trailers-section').classList.remove('hidden');
  } else {
    document.getElementById('confirmation-section').classList.add('hidden');
    document.getElementById('form-section').classList.remove('hidden');
  }
}

function handleMore(more) {
  document.getElementById('more-trailers-section').classList.add('hidden');
  if (more) {
    document.getElementById('form-section').reset();
    document.getElementById('form-section').classList.remove('hidden');
  } else {
    document.getElementById('final-section').classList.remove('hidden');
  }
}

function sendCopy(wantsCopy) {
  const compiled = entries.map(e => `Trailer: ${e.trailer}\nLocation: ${e.location} - ${e.sublocation}\nFuel: ${e.fuel}\nTemp: ${e.temp}\nWashout: ${e.washout}\nNotes: ${e.notes}\nTime: ${e.timestamp}\n---`).join('\n');
  const payload = {
    to: ['jody@midsouthtruckandtrailer.net'],
    cc: wantsCopy ? [userEmail] : [],
    subject: `EOS Yard Check - ${new Date().toLocaleDateString()}`,
    content: compiled
  };

  fetch('https://api.zohoapis.com/mail/v1/messages', {
    method: 'POST',
    headers: {
      Authorization: `Zoho-oauthtoken ${window.ZOHO_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to send email');
      return res.json();
    })
    .then(() => alert('Yard check sent successfully!'))
    .catch(err => alert(`Error: ${err.message}`));
}
