// Mileage Tracker JavaScript

/*
 * This script handles adding entries (fuel, service or mileage), deleting entries and
 * calculating summary statistics. Entries are stored in localStorage under the key
 * "mt_entries" and have the shape: { id, date, type, amount, description }.
 */

(function() {
    const form = document.getElementById('entryForm');
    const tableBody = document.querySelector('#entriesTable tbody');
    const summaryList = document.getElementById('summaryList');

    // Load existing entries
    let entries = loadEntries();
    renderEntries();
    renderSummary();

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const date = document.getElementById('entryDate').value;
        const type = document.getElementById('entryType').value;
        const amountStr = document.getElementById('entryAmount').value;
        const description = document.getElementById('entryDescription').value.trim();

        if (!date || !type || !amountStr) {
            alert('Please fill out all required fields.');
            return;
        }
        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }

        const newEntry = {
            id: generateId(),
            date: date,
            type: type,
            amount: amount,
            description: description
        };
        entries.push(newEntry);
        saveEntries();
        renderEntries();
        renderSummary();
        form.reset();
    });

    function generateId() {
        return 'entry-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }

    function loadEntries() {
        try {
            const stored = localStorage.getItem('mt_entries');
            return stored ? JSON.parse(stored) : [];
        } catch (err) {
            console.error('Error loading entries', err);
            return [];
        }
    }

    function saveEntries() {
        localStorage.setItem('mt_entries', JSON.stringify(entries));
    }

    function deleteEntry(id) {
        entries = entries.filter(entry => entry.id !== id);
        saveEntries();
        renderEntries();
        renderSummary();
    }

    function renderEntries() {
        tableBody.innerHTML = '';
        if (entries.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 5;
            cell.textContent = 'No entries yet.';
            cell.style.textAlign = 'center';
            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }
        // Sort by date descending
        const sorted = [...entries].sort((a,b) => b.date.localeCompare(a.date));
        sorted.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.date}</td>
                <td>${capitalize(entry.type)}</td>
                <td>${formatAmount(entry)}</td>
                <td>${escapeHtml(entry.description)}</td>
                <td><button class="delete-btn" data-id="${entry.id}" title="Delete entry">&times;</button></td>
            `;
            tableBody.appendChild(row);
        });
        tableBody.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                deleteEntry(id);
            });
        });
    }

    function renderSummary() {
        const totalFuel = entries
            .filter(e => e.type === 'fuel')
            .reduce((sum, e) => sum + e.amount, 0);
        const totalService = entries
            .filter(e => e.type === 'service')
            .reduce((sum, e) => sum + e.amount, 0);
        const totalMiles = entries
            .filter(e => e.type === 'mileage')
            .reduce((sum, e) => sum + e.amount, 0);
        summaryList.innerHTML = '';
        const items = [
            { label: 'Total Fuel Cost', value: totalFuel.toFixed(2) },
            { label: 'Total Service Cost', value: totalService.toFixed(2) },
            { label: 'Total Miles Driven', value: totalMiles.toFixed(2) }
        ];
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.label}: ${item.value}`;
            summaryList.appendChild(li);
        });
    }

    function formatAmount(entry) {
        if (entry.type === 'mileage') {
            return `${entry.amount.toFixed(2)} mi`;
        }
        // currency representation; can customise
        return `$${entry.amount.toFixed(2)}`;
    }

    function capitalize(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
})();