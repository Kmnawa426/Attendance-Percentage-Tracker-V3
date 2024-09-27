// Get DOM elements
const studentInput = document.getElementById('student-name-input');
const addStudentBtn = document.getElementById('add-student-btn');
const studentList = document.getElementById('student-list');
const adminLoginBtn = document.getElementById('admin-btn');
const logoutBtn = document.getElementById('logout-btn');
const adminControls = document.getElementById('admin-controls');

// Admin login logic (simple password prompt)
adminLoginBtn.addEventListener('click', () => {
    const password = prompt("Enter admin password:");
    if (password === 'admin123') {  // Replace 'admin123' with your own password
        document.body.classList.add('admin-mode');
    } else {
        alert("Incorrect password.");
    }
});

// Logout admin
logoutBtn.addEventListener('click', () => {
    document.body.classList.remove('admin-mode');
});

// Load students and percentages from localStorage
let students = JSON.parse(localStorage.getItem('students')) || {};

function updateLocalStorage() {
    localStorage.setItem('students', JSON.stringify(students));
}

// Add student event listener (only in admin mode)
addStudentBtn.addEventListener('click', () => {
    const name = studentInput.value.trim();
    if (name && !students[name]) {
        students[name] = 100;  // Initialize student with 100% 
        addStudentToList(name, students[name]);
        updateLocalStorage();
    }
    studentInput.value = '';  // Clear input field
});

// Add student to the UI
function addStudentToList(name, percentage) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${name}</span>
        <span class="percentage">${percentage}%</span>
        <div>
            <button class="percentage-btn admin-only" onclick="decreasePercentage('${name}')">-3</button>
            <button class="percentage-btn admin-only" onclick="increasePercentage('${name}')">+1</button>
            <button class="remove-btn admin-only" onclick="removeStudent('${name}')">Remove</button>
        </div>
    `;
    studentList.appendChild(li);
}

// Load all students on page load
Object.keys(students).forEach(name => addStudentToList(name, students[name]));

// Decrease percentage by 3 (only in admin mode)
function decreasePercentage(name) {
    if (students[name] >= 3) {
        students[name] -= 3;
    } else {
        students[name] = 0;  // Ensure it doesn't go below 0
    }
    updateStudentUI(name);
    updateLocalStorage();
}

// Increase percentage by 1 (only in admin mode)
function increasePercentage(name) {
    if (students[name] < 100) {
        students[name] += 1;
    }
    updateStudentUI(name);
    updateLocalStorage();
}

// Update the percentage display for a student
function updateStudentUI(name) {
    const percentageElements = document.querySelectorAll('.percentage');
    percentageElements.forEach(el => {
        if (el.previousElementSibling.textContent === name) {
            el.textContent = `${students[name]}%`;
        }
    });
}

// Remove student (only in admin mode)
function removeStudent(name) {
    // Remove from the UI
    const studentElements = document.querySelectorAll('li');
    studentElements.forEach(el => {
        if (el.querySelector('span').textContent === name) {
            el.remove();
        }
    });

    // Remove from localStorage
    delete students[name];
    updateLocalStorage();
}
