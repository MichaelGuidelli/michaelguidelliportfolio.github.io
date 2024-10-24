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

const plausibleEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const validTLDs = ['com', 'org', 'net', 'edu', 'gov', 'io', 'co', 'uk', 'it'];

function isPlausibleEmail(email) {
    return plausibleEmailRegex.test(email) && validTLDs.includes(email.split('.').pop());
}

// Unified email-sending function that handles one form at a time
function sendFormEmail(event, formId, responseElementId) {
    event.preventDefault();

    const formData = getFormData(formId);

    // Validate email
    if (!isPlausibleEmail(formData.userEmail)) {
        return displayMessage("Invalid email address. Please check your email.", "red", responseElementId);
    }

    // Additional validation for the "Hire Me" form
    if (formId === 'hire-me-form') {
        const userType = formData.userType;
        const companyName = formData.companyName;

        // Check if recruiter and validate company name
        if (userType === 'recruiter' && companyName.trim() === '') {
            return displayMessage("Company name is required for recruiters.", "red", responseElementId);
        }
    }

    // Send email using the unified sendEmailUsingSMTP function
    sendEmailUsingSMTP(formData, formId === 'hire-me-form', responseElementId);
}

function getFormData(formId) {
    const form = document.getElementById(formId);

    // For the "Hire Me" form, we include extra fields
    if (formId === 'hire-me-form') {
        return {
            userName: form.querySelector('#hire-me-form-user-name').value || '',
            userEmail: form.querySelector('#hire-me-form-user-email').value.trim() || '',
            userMessage: form.querySelector('#hire-me-form-user-message').value || '',
            companyName: form.querySelector('#hire-me-form-company-name')?.value || '',
            userType: form.querySelector('#user-type')?.value || ''
        };
    }
    
    // For the contact form, return basic fields
    return {
        userName: form.querySelector('#contact-form-user-name').value || '',
        userEmail: form.querySelector('#contact-form-user-email').value.trim() || '',
        userMessage: form.querySelector('#contact-form-user-message').value || ''
    };
}

function sendEmailUsingSMTP(formData, isHireMeForm = false, responseElementId) {
    const subject = isHireMeForm ? "FORM PORTFOLIO: Hire Me Inquiry" : "FORM PORTFOLIO: New Contact Form Enquiry";
    const emailBody = `Name: ${formData.userName}<br>Email: ${formData.userEmail}<br>Message: ${formData.userMessage}<br>${
        isHireMeForm ? 'Company: ' + (formData.companyName || 'N/A') : ''
    }`;

    Email.send({
        SecureToken: "3dc73667-d27e-4157-a8df-7ac3799176b7",
        To: 'guidellimichael@gmail.com',
        From: 'guidellimichael@gmail.com',
        Subject: subject,
        Body: emailBody
    }).then(
        () => {
            displayMessage("Email sent successfully!", "green", responseElementId);
            document.getElementById(isHireMeForm ? 'hire-me-form' : 'contact-form').reset();
        },
        () => displayMessage("Failed to send email. Please try again.", "red", responseElementId)
    );
}


function displayMessage(message, color, responseElementId) {
    const responseElement = document.getElementById(responseElementId);
    
    // Check if the element exists
    if (responseElement) {
        responseElement.innerText = message;
        responseElement.style.color = color;

        // Clear the message after 3 seconds
        setTimeout(() => responseElement.innerText = '', 3000);
    } else {
        console.error(`Element with id "${responseElementId}" not found.`);
    }
}

function hireMeButton() {
    const hireMeButton = document.getElementById('hire-me-button');
    hireMeButton.innerText = "Hire me 👋";
    hireMeButton.disabled = false;
}

document.getElementById("hire-me-button")?.addEventListener("click", () => {
    new bootstrap.Modal(document.getElementById('hire-me-modal')).show();
});

const userTypeSelect = document.getElementById('user-type');
const companyDiv = document.getElementById('company-div');

userTypeSelect?.addEventListener('change', function () {
    if (this.value === 'private-client') {
        companyDiv.style.display = 'none'; 
    } else {
        companyDiv.style.display = 'block';
    }
});

window.onload = () => {
    document.getElementById("year-site").textContent = new Date().getFullYear();

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    hireMeButton();
    updateMyAge();
};
