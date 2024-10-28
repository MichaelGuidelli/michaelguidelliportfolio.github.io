// Utility Functions
const plausibleEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function updateMyAge() {
    const birthDate = new Date(new Date().getFullYear(), 9, 7); // October 7th
    const currentAge = new Date() >= birthDate ? 21 : 20;
    document.getElementById("my-age").innerText = currentAge;
}

function applyValidationStyle(field, isValid) {
    field.style.borderColor = isValid ? 'green' : 'red';
}

function isPlausibleEmail(email) {
    return plausibleEmailRegex.test(email);
}

function isPlausibleMessage(message) {
    const trimmedMessage = message.trim();
    return trimmedMessage.length >= 30;
}

// Capitalize the first letter of each word
function capitalizeName(name) {
    return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Disable all form fields
function disableAllFields(form) {
    const fields = ['userName', 'userEmail', 'userMessage', 'companyName'];
    fields.forEach(fieldName => {
        form[fieldName].disabled = true;
    });

    // Disable checkboxes
    const checkboxes = form.querySelectorAll('input[name="options"]');
    checkboxes.forEach(checkbox => {
        checkbox.disabled = true;
    });
}

// Enable or disable fields based on user type
function toggleFieldsEnabled(form, userType) {
    const fields = ['userName', 'userEmail', 'userMessage', 'companyName'];
    const isEnabled = userType !== ''; // Enable only if user type is selected

    fields.forEach(fieldName => {
        form[fieldName].disabled = !isEnabled;
    });

    // Enable or disable checkboxes
    const checkboxes = form.querySelectorAll('input[name="options"]');
    checkboxes.forEach(checkbox => {
        checkbox.disabled = !isEnabled;
    });

    // Reset company name field if user type changes to private client
    if (userType === 'private-client') {
        form['companyName'].value = '';
        applyValidationStyle(form['companyName'], true); // Show as valid since it's optional
    }
}

// Dynamic Form Validation
function setupDynamicValidation() {
    const form = document.getElementById('hire-me-form');

    // Initially disable all fields
    disableAllFields(form);

    form['userType'].addEventListener('change', function () {
        const companyDiv = document.getElementById('company-div');
        const userType = this.value;

        // Set the companyName field requirement based on userType
        form['companyName'].required = userType === 'recruiter';
        companyDiv.style.display = userType === 'recruiter' ? 'block' : 'none';

        // Enable or disable fields based on user type selection
        toggleFieldsEnabled(form, userType);
    });

    form['userName'].addEventListener('input', (e) => {
        e.target.value = capitalizeName(e.target.value);
        validateField(e.target);
    });

    form['userEmail'].addEventListener('input', (e) => {
        applyValidationStyle(e.target, isPlausibleEmail(e.target.value));
    });

    // Update the message counter as user types
    const userMessageField = form['userMessage'];
    userMessageField.addEventListener('input', (e) => {
        applyValidationStyle(e.target, isPlausibleMessage(e.target.value));
        updateMessageCounter(e.target.value.length); // Update counter
    });

    if (form['companyName']) {
        form['companyName'].addEventListener('input', (e) => {
            if (form['userType'].value === 'recruiter') {
                validateField(e.target);
            } else {
                applyValidationStyle(e.target, true); // Mark as valid if not required
            }
        });
    }

    // Initialize the message counter
    updateMessageCounter(0);
}

// New function to update the message counter
function updateMessageCounter(currentLength) {
    const maxLength = 30;
    const counterElement = document.getElementById('message-counter');
    counterElement.textContent = `${currentLength} / ${maxLength}`;
}

function validateField(field) {
    const isValid = field.value.trim().length > 0;
    applyValidationStyle(field, isValid);
    return isValid;
}

function sendFormEmail(event) {
    event.preventDefault();
    const form = document.getElementById('hire-me-form');
    const sendButton = document.getElementById('send-button'); // Replace with your button's actual ID

    if (!validateForm(form)) return;

    // Add loading animation to the button
    sendButton.classList.add('button-loading');

    sendEmailUsingSMTP(getFormData(form), sendButton);
}

function validateForm(form) {
    const userType = form['userType'].value;

    const isNameValid = validateField(form['userName']);
    const isEmailValid = isPlausibleEmail(form['userEmail'].value) && validateField(form['userEmail']);
    const isMessageValid = isPlausibleMessage(form['userMessage'].value) && validateField(form['userMessage']);

    let isCompanyNameValid = true;
    if (userType === 'recruiter') {
        isCompanyNameValid = validateField(form['companyName']);
    }

    const checkboxes = form.querySelectorAll('input[name="options"]:checked');
    const isCheckboxValid = true; // Always valid since checkboxes are optional

    return isNameValid && isEmailValid && isMessageValid && isCompanyNameValid && isCheckboxValid;
}

function sendEmailUsingSMTP(formData) {
    const subject = "FORM PORTFOLIO: Hire Me Inquiry";
    const emailBody = `Name: ${formData.userName}<br>Email: ${formData.userEmail}<br>Message: ${formData.userMessage}<br>` +
        `Company: ${formData.companyName || 'N/A'}<br>Options: ${formData.options || 'None'}`;

    Email.send({
        SecureToken: "3dc73667-d27e-4157-a8df-7ac3799176b7",
        To: 'guidellimichael@gmail.com',
        From: 'guidellimichael@gmail.com',
        Subject: subject,
        Body: emailBody
    }).then(
        () => {
            // Reset the form and field styles after successful email
            const form = document.getElementById('hire-me-form');
            form.reset(); // Reset the form fields
            
            // Reset styles
            const fields = ['userName', 'userEmail', 'userMessage', 'companyName'];
            fields.forEach(fieldName => {
                const field = form[fieldName];
                applyValidationStyle(field, true); // Show as valid since reset
                field.style.borderColor = ''; // Reset to default state
            });

            updateMessageCounter(0); // Reset message counter
            disableAllFields(form); // Disable all fields again
        },
        (error) => {
            console.error("Failed to send email:", error);
        }
    );
}

// Helper Function to Collect Form Data
function getFormData(form) {
    const checkboxes = form.querySelectorAll('input[name="options"]:checked');
    const options = Array.from(checkboxes).map(checkbox => checkbox.value);

    return {
        userName: form['userName'].value.trim(),
        userEmail: form['userEmail'].value.trim(),
        userMessage: form['userMessage'].value.trim(),
        companyName: form['companyName']?.value.trim() || '',
        userType: form['userType'].value,
        options: options.join(', ')
    };
}

// Initialize
window.onload = () => {
    document.getElementById("year-site").textContent = new Date().getFullYear();
    updateMyAge();

    // Initialize dynamic validation
    setupDynamicValidation(); // Setup validation for the form

    // Button to open the modal
    document.getElementById("hire-me-button")?.addEventListener("click", () => {
        new bootstrap.Modal(document.getElementById("hire-me-modal")).show();
    });

    // Submit event for the form
    const form = document.getElementById('hire-me-form');
    form.addEventListener('submit', sendFormEmail);
};
