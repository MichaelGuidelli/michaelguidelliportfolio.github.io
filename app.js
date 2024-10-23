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

function sendEmail(event) {
    event.preventDefault();

    const formData = getContactFormData();

    if (!isPlausibleEmail(formData.userContactFormEmail)) {
        return displayMessage("Invalid email address. Please check your email.", "red");
    }

    sendEmailUsingSMTP(formData);
}

function getContactFormData() {
    return {
        userContactFormName: document.getElementById('contact-form-user-name').value,
        userContactFormEmail: document.getElementById('contact-form-user-email').value.trim(),
        userContactFormMessage: document.getElementById('contact-form-user-message').value,
    };
}

function displayMessage(message, color, responseElementId) {
    const responseElement = document.getElementById(responseElementId);
    responseElement.innerText = message;
    responseElement.style.color = color;

    setTimeout(() => responseElement.innerText = '', 3000); // Clear message after 3 seconds
}

function sendEmailUsingSMTP({ userContactFormName, userContactFormEmail, userContactFormMessage }) {
    Email.send({
        SecureToken: "3dc73667-d27e-4157-a8df-7ac3799176b7",
        To: 'guidellimichael@gmail.com',
        From: 'guidellimichael@gmail.com',
        Subject: "FORM PORTFOLIO: New Contact Form Enquiry",
        Body: `Name: ${userContactFormName}<br>Email: ${userContactFormEmail}<br>Message: ${userContactFormMessage}`,
    }).then(
        () => {
            displayMessage("Email sent successfully!", "green", 'form-response');
            document.getElementById('contact-form').reset();
        },
        () => displayMessage("Invalid email address. Please check your email.", "red", 'form-response')
    );
}

function hireMeButton() {
    const hireMeButton = document.getElementById('hire-me-button');
    hireMeButton.innerText = "Hire me 👋";
    hireMeButton.disabled = false;
}

document.getElementById("hire-me-button").addEventListener("click", () => {
    new bootstrap.Modal(document.getElementById('book-meet-modal')).show();
});

const userTypeSelect = document.getElementById('user-type');
const companyDiv = document.getElementById('company-div');

userTypeSelect.addEventListener('change', function () {
    if (this.value === 'private-client') {
        companyDiv.style.display = 'none'; 
    } else {
        companyDiv.style.display = 'block';
    }
});

let CLIENT_ID = 'guidellimichael@gmail.com';
let API_KEY = 'AIzaSyCCKy1S2AAEwEbpuJHMKK9-tEy4BsnY6Is';
let DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
let SCOPES = "https://www.googleapis.com/auth/calendar.events";

function loadGoogleAPI() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(() => {
        // Ensure the user is signed in before creating the event
        gapi.auth2.getAuthInstance().signIn();
    });
}

function createMeet(eventData) {
    gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: {
            summary: 'Google Meet Booking',
            description: eventData.message,
            start: {
                dateTime: eventData.dateTime,
                timeZone: 'America/New_York'  // Adjust time zone
            },
            end: {
                dateTime: new Date(new Date(eventData.dateTime).getTime() + 3600000).toISOString(), // 1-hour duration
                timeZone: 'America/New_York'
            },
            conferenceData: {
                createRequest: {
                    requestId: "meet-" + new Date().getTime(),
                    conferenceSolutionKey: { type: "hangoutsMeet" }
                }
            }
        },
        conferenceDataVersion: 1
    }).then(response => {
        let meetLink = response.result.hangoutLink;
        sendConfirmationEmails(eventData, meetLink);
    });
}

function sendConfirmationEmails(eventData, meetLink) {
    // Email to the user
    Email.send({
        SecureToken: "3dc73667-d27e-4157-a8df-7ac3799176b7",
        To: eventData.email,
        From: "guidellimichael@gmail.com",
        Subject: "Meeting Confirmation",
        Body: `Hi ${eventData.name},<br><br>Your Google Meet is scheduled at ${eventData.dateTime}.<br>Join the meeting here: <a href="${meetLink}">${meetLink}</a><br><br>Best regards,<br>Your Name`
    });

    // Email to you with all details
    Email.send({
        SecureToken: "3dc73667-d27e-4157-a8df-7ac3799176b7",
        To: "guidellimichael@gmail.com",
        From: "guidellimichael@gmail.com",
        Subject: "New Google Meet Scheduled",
        Body: `A new Google Meet has been scheduled.<br><br>Name: ${eventData.name}<br>Email: ${eventData.email}<br>Company: ${eventData.company || 'N/A'}<br>Message: ${eventData.message}<br>Date & Time: ${eventData.dateTime}<br>Meet Link: <a href="${meetLink}">${meetLink}</a>`
    }).then(() => {
        displayMessage("Meeting scheduled successfully and emails sent!", "green");
    }).catch(() => {
        displayMessage("Failed to send emails.", "red");
    });
}

document.getElementById("meet-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const userType = document.getElementById('user-type').value;
    const companyName = document.getElementById('meet-form-company-name').value;

    // Get other form data
    const eventData = {
        name: document.getElementById('meet-form-user-name').value,
        email: document.getElementById('meet-form-user-email').value,
        message: document.getElementById('meet-form-user-message').value,
        dateTime: document.getElementById('meet-date-time').value,
        company: companyName
    };

    // Validate email
    if (!isPlausibleEmail(eventData.email)) {
        return displayMessage("Invalid email address. Please check your email.", "red", 'meet-form-response');
    }

    // Validate company name only if the user is a recruiter
    if (userType === 'recruiter' && companyName.trim() === '') {
        return displayMessage("Company name is required for recruiters.", "red", 'meet-form-response');
    }

    // Proceed with Google Meet creation
    createMeet(eventData);
});


window.onload = () => {
    document.getElementById("year-site").textContent = new Date().getFullYear();

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })

    hireMeButton();
    updateMyAge();
};
