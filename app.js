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

function sendFormEmail(event, formId, responseElementId) {
    event.preventDefault();

    const formData = getFormData(formId);

    // Validate email
    if (!isPlausibleEmail(formData.userEmail)) {
        return displayMessage("Invalid email address. Please check your email.", "red", responseElementId);
    }

    // Send email using the unified sendEmailUsingSMTP function
    sendEmailUsingSMTP(formData, formId === 'hire-me-form', responseElementId);
}

function getFormData(formId) {
    const form = document.getElementById(formId);
    
    // For the "Hire Me" form, we include extra fields
    if (formId === 'hire-me-form') {
        const checkboxes = form.querySelectorAll('input[name="options"]:checked');
        const options = Array.from(checkboxes).map(checkbox => checkbox.value);

        return {
            userName: form.querySelector('#hire-me-form-user-name').value || '',
            userEmail: form.querySelector('#hire-me-form-user-email').value.trim() || '',
            userMessage: form.querySelector('#hire-me-form-user-message').value || '',
            companyName: form.querySelector('#hire-me-form-company-name')?.value || '',
            userType: form.querySelector('#user-type')?.value || '',
            options: options.join(', ') // Join selected options into a string
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
        const emailBody = `Name: ${formData.userName}<br>Email: ${formData.userEmail}<br>Message: ${formData.userMessage}<br>` +
            `${isHireMeForm ? 'Company: ' + (formData.companyName || 'N/A') + '<br>Options: ' + (formData.options || 'None') : ''}`;
    
        console.log('Sending email with the following data:', { subject, emailBody });
    
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
            (error) => {
                displayMessage("Failed to send email. Please try again.", "red", responseElementId);
            }
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
    hireMeButton.innerText = "Hire Me 👋";
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


function showTooltipOnClick(iconId) {
    var icon = document.getElementById(iconId);
    var tooltip = bootstrap.Tooltip.getInstance(icon); // Get the tooltip instance

    // Show the tooltip on click
    icon.addEventListener('click', function () {
        tooltip.show();
    });
}

showTooltipOnClick('gmail-icon');
showTooltipOnClick('mobile-icon');

window.onload = () => {
    
    document.getElementById("year-site").textContent = new Date().getFullYear();
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            placement: 'bottom' // Place the tooltip under the image
        });
    });

    hireMeButton();
    updateMyAge();
};
