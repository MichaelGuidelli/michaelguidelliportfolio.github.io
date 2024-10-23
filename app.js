let timeoutId;

document.addEventListener('mousemove', (e) => {
    const cursorHue = document.getElementById('cursorHue');
    cursorHue.classList.remove('fade-out');
    cursorHue.style.left = `${e.pageX}px`;
    cursorHue.style.top = `${e.pageY}px`;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => cursorHue.classList.add('fade-out'), 1000);
});

function updateMyAge() {
    const myBirthDate = new Date(new Date().getFullYear(), 9, 7); // October 7th
    const today = new Date();
    const myCurrentAge = today >= myBirthDate ? 21 : 20;
    document.getElementById("my-age").innerText = myCurrentAge;
}

function toggleLanguage() {
    const button = document.getElementById("toggle-language");
    button.innerHTML = button.innerHTML === "EN" ? "IT" : "EN";
}

const plausibleEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const validTLDs = ['com', 'org', 'net', 'edu', 'gov', 'io', 'co', 'uk', 'it'];

function isPlausibleEmail(email) {
    return plausibleEmailRegex.test(email) && validTLDs.includes(email.split('.').pop());
}

function sendEmail(event) {
    event.preventDefault();

    const formData = getContactFormData();

    if (!isPlausibleEmail(formData.userEmail)) {
        return displayMessage("Invalid email address. Please check your email.", "red");
    }

    sendEmailUsingSMTP(formData);
}

function getContactFormData() {
    return {
        userName: document.getElementById('contact-form-user-name').value,
        userEmail: document.getElementById('contact-form-user-email').value.trim(),
        userMessage: document.getElementById('contact-form-user-message').value,
    };
}

function displayMessage(message, color) {
    const responseElement = document.getElementById('form-response');
    responseElement.innerText = message;
    responseElement.style.color = color;

    setTimeout(() => responseElement.innerText = '', 3000);
}

function sendEmailUsingSMTP({ userName, userEmail, userMessage }) {
    Email.send({
        SecureToken: "3dc73667-d27e-4157-a8df-7ac3799176b7",
        To: 'guidellimichael@gmail.com',
        From: 'guidellimichael@gmail.com',
        Subject: "FORM PORTFOLIO: New Contact Form Enquiry",
        Body: `Name: ${userName}<br>Email: ${userEmail}<br>Message: ${userMessage}`,
    }).then(
        () => {
            displayMessage("Email sent successfully!", "green");
            document.getElementById('contact-form').reset();
        },
        () => displayMessage("Email sending failed. Please try again.", "red")
    );
}

function hireMeButton() {
    const hireMeButton = document.getElementById('hire-me-button');
    hireMeButton.innerText = "Hire me 👋";
    hireMeButton.disabled = false;
}

document.getElementById("hire-me-button").addEventListener("click", () => {
    new bootstrap.Modal(document.getElementById('myModal')).show();
});

const userTypeSelect = document.getElementById('userType');
const companyDiv = document.getElementById('companyDiv');

userTypeSelect.addEventListener('change', function () {
    if (this.value === 'privateClient') {
        companyDiv.style.display = 'none'; 
    } else {
        companyDiv.style.display = 'block';
    }
});

window.onload = () => {
    document.getElementById("year-site").textContent = new Date().getFullYear();
    hireMeButton();
    updateMyAge();
};
