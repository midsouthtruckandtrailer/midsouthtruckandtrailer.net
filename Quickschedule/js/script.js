// QuickSchedule JavaScript

/*
 * Schedule Management
 *
 * This script handles adding, deleting and persisting shift entries. Shifts are
 * stored in the browser's localStorage under the key "qs_shifts". Each shift
 * has the form { id: string, employee: string, date: string, start: string, end: string }.
 */

(function() {
    const form = document.getElementById('scheduleForm');
    const scheduleTableBody = document.querySelector('#scheduleTable tbody');

    // Load any existing shifts from localStorage
    let shifts = loadShifts();
    renderShifts();

    // Add a new shift on form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const employee = document.getElementById('employeeName').value.trim();
        const date = document.getElementById('shiftDate').value;
        const start = document.getElementById('startTime').value;
        const end = document.getElementById('endTime').value;

        if (!employee || !date || !start || !end) {
            alert('Please fill out all fields.');
            return;
        }

        const newShift = {
            id: generateId(),
            employee: employee,
            date: date,
            start: start,
            end: end
        };

        shifts.push(newShift);
        saveShifts();
        renderShifts();

        // Reset form
        form.reset();
    });

    // Generate a simple unique ID using timestamp
    function generateId() {
        return 'shift-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }

    // Load shifts from localStorage
    function loadShifts() {
        try {
            const stored = localStorage.getItem('qs_shifts');
            return stored ? JSON.parse(stored) : [];
        } catch (err) {
            console.error('Error parsing stored shifts', err);
            return [];
        }
    }

    // Save shifts to localStorage
    function saveShifts() {
        localStorage.setItem('qs_shifts', JSON.stringify(shifts));
    }

    // Delete a shift by ID
    function deleteShift(id) {
        shifts = shifts.filter(shift => shift.id !== id);
        saveShifts();
        renderShifts();
    }

    // Render shifts into the table
    function renderShifts() {
        // Clear existing rows
        scheduleTableBody.innerHTML = '';
        if (shifts.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 5;
            cell.textContent = 'No shifts scheduled yet.';
            cell.style.textAlign = 'center';
            row.appendChild(cell);
            scheduleTableBody.appendChild(row);
            return;
        }
        // Sort shifts by date and start time
        const sorted = [...shifts].sort((a, b) => {
            if (a.date === b.date) {
                return a.start.localeCompare(b.start);
            }
            return a.date.localeCompare(b.date);
        });
        sorted.forEach(shift => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${escapeHtml(shift.employee)}</td>
                <td>${shift.date}</td>
                <td>${shift.start}</td>
                <td>${shift.end}</td>
                <td><button class="delete-btn" data-id="${shift.id}" title="Delete shift">&times;</button></td>
            `;
            scheduleTableBody.appendChild(row);
        });
        // Attach delete handlers
        scheduleTableBody.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                deleteShift(id);
            });
        });
    }

    // Escape HTML to prevent injection
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
})();