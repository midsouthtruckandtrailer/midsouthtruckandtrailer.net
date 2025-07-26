// revamped_yard_check.js
// This script updates the original yard_check.js to send the yard check summary
// via Darrell's Gmail account using SMTP.js instead of the Zoho mail API.
// To use this script, include the SMTP.js library in your HTML:
//   <script src="https://smtpjs.com/v3/smtp.js"></script>
// and replace <YOUR_SECURE_TOKEN> below with a secure token generated on
// smtpjs.com for your Gmail account.

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
  const summary = `\nName: ${entry.name}\n` +
    `Location: ${entry.location} - ${entry.sublocation}\n` +
    `Trailer: ${entry.trailer}\n` +
    `Status: ${entry.status}\n` +
    `Fuel: ${entry.fuel}\n` +
    `Temp: ${entry.temp}°F\n` +
    `Washout: ${entry.washout}\n` +
    `Notes: ${entry.notes}\n` +
    `Time: ${entry.timestamp}`;
  document.getElementById('entry-summary').innerHTML = summary.replace(/\n/g, '<br>');
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
  // Compile all entries into a single body string
  const compiled = entries.map(e =>
    `Trailer: ${e.trailer}\nLocation: ${e.location} - ${e.sublocation}\nFuel: ${e.fuel}\nTemp: ${e.temp}\nWashout: ${e.washout}\nNotes: ${e.notes}\nTime: ${e.timestamp}\n---`)
    .join('\n');
  // Recipients remain the same as original: send to Jody; cc technician if requested
  const toRecipients = 'jody@midsouthtruckandtrailer.net';
  const devRecipient = 'darrell@midsouthtruckandtrailer.net';
  const ccRecipients = wantsCopy ? userEmail : '';
  const subject = `EOS Yard Check - ${new Date().toLocaleDateString()}`;
  // Send email via SMTP.js
  Email.send({
    SecureToken: '4ebda59a-afe9-422c-b910-58098fc5c445',
    To: toRecipients,devRecipient,
    Cc: ccRecipients,
    From: 'darrellwnicholas@gmail.com',
    Subject: subject,
    Body: compiled.replace(/\n/g, '<br>')
  }).then((message) => {
    if (message === 'OK') {
      alert('Yard check sent successfully!');
    } else {
      alert('Error: ' + message);
    }
  }).catch((err) => alert('Error: ' + err));
}