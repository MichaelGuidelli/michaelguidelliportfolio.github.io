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
    return message.trim().length >= 30;
}

// Capitalize the first letter of each word
function capitalizeName(name) {
    return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Disable all form fields
function disableAllFields(form) {
    const fields = ['userName', 'userEmail', 'userMessage', 'companyName'];
    fields.forEach(fieldName => form[fieldName].disabled = true);

    form.querySelectorAll('input[name="options"]').forEach(checkbox => checkbox.disabled = true);
}

// Enable or disable fields based on user type
function toggleFieldsEnabled(form, userType) {
    const isEnabled = userType !== '';
    ['userName', 'userEmail', 'userMessage', 'companyName'].forEach(field => form[field].disabled = !isEnabled);
    
    form.querySelectorAll('input[name="options"]').forEach(checkbox => checkbox.disabled = !isEnabled);

    if (userType === 'private-client') {
        form['companyName'].value = '';
        applyValidationStyle(form['companyName'], true);
    }
}

// Dynamic Form Validation
function setupDynamicValidation() {
    const form = document.getElementById('hire-me-form');
    disableAllFields(form);

    form['userType'].addEventListener('change', function () {
        const companyDiv = document.getElementById('company-div');
        form['companyName'].required = this.value === 'recruiter';
        companyDiv.style.display = this.value === 'recruiter' ? 'block' : 'none';

        toggleFieldsEnabled(form, this.value);
    });

    form['userName'].addEventListener('input', e => {
        e.target.value = capitalizeName(e.target.value);
        validateField(e.target);
    });

    form['userEmail'].addEventListener('input', e => applyValidationStyle(e.target, isPlausibleEmail(e.target.value)));

    const userMessageField = form['userMessage'];
    userMessageField.addEventListener('input', e => {
        applyValidationStyle(e.target, isPlausibleMessage(e.target.value));
        updateMessageCounter(e.target.value.length);
    });

    if (form['companyName']) {
        form['companyName'].addEventListener('input', e => {
            const isValid = form['userType'].value === 'recruiter' ? validateField(e.target) : true;
            applyValidationStyle(e.target, isValid);
        });
    }
    
    updateMessageCounter(0); // Initialize the message counter
}

function updateMessageCounter(currentLength) {
    const counterElement = document.getElementById('message-counter');
    counterElement.textContent = `${currentLength} / 30`;
}

function validateField(field) {
    const isValid = field.value.trim().length > 0;
    applyValidationStyle(field, isValid);
    return isValid;
}

function sendFormEmail(event) {
    event.preventDefault();
    const form = document.getElementById('hire-me-form');
    const sendButton = document.getElementById('send-button');

    if (!validateForm(form)) return;

    sendButton.classList.add('button-loading');
    sendEmailUsingSMTP(getFormData(form), sendButton);
}

function validateForm(form) {
    const isNameValid = validateField(form['userName']);
    const isEmailValid = isPlausibleEmail(form['userEmail'].value) && validateField(form['userEmail']);
    const isMessageValid = isPlausibleMessage(form['userMessage'].value) && validateField(form['userMessage']);
    const isCompanyNameValid = form['userType'].value !== 'recruiter' || validateField(form['companyName']);

    return isNameValid && isEmailValid && isMessageValid && isCompanyNameValid;
}

function updateSendButton(sendButton, text, showLoader = false) {
    if (showLoader) {
        sendButton.innerHTML = `
            Sending... `;
    } else {
        sendButton.innerHTML = `
            ${text}`;
    }
}

function resetSendButton(sendButton) {
    sendButton.innerHTML = `
        Let's get started 
        <img class="mb-0 ms-2" style="width: 20px; height: 20px;" src="./assets/icons/send-icon.png" alt="">`; // Default state
}

function sendEmailUsingSMTP(formData, sendButton) {
    const subject = "FORM PORTFOLIO: Hire Me Inquiry";
    const emailBody = `
    <html>
      <body>
        <table style="width:100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${formData.userName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${formData.userEmail}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>User Type:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${formData.userType || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Message:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${formData.userMessage}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Company:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${formData.companyName || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Options:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${formData.options || 'None'}</td>
          </tr>
        </table>
      </body>
    </html>
  `;
  
    // Show loading state
    updateSendButton(sendButton, "", true);

    Email.send({
        SecureToken: "3dc73667-d27e-4157-a8df-7ac3799176b7",
        To: 'guidellimichael@gmail.com',
        From: 'guidellimichael@gmail.com',
        Subject: subject,
        Body: emailBody
    }).then(
        (message) => {
            if (message === "OK") {
                updateSendButton(sendButton, "Message Sent");
                resetForm();
            } else {
                updateSendButton(sendButton, "Failed to Send Message");
            }
        },
        () => updateSendButton(sendButton, "Failed to Send Message")
    ).finally(() => {
        setTimeout(() => resetSendButton(sendButton), 3000);
    });
}


function resetForm() {
    const form = document.getElementById('hire-me-form');
    form.reset();
    ['userName', 'userEmail', 'userMessage', 'companyName'].forEach(field => {
        applyValidationStyle(form[field], true);
        form[field].style.borderColor = '';
    });
    updateMessageCounter(0);
    disableAllFields(form);
}

document.getElementById('hire-me-modal').addEventListener('hide.bs.modal', resetForm);

function getFormData(form) {
    const options = Array.from(form.querySelectorAll('input[name="options"]:checked')).map(checkbox => checkbox.value);
    return {
        userName: form['userName'].value.trim(),
        userEmail: form['userEmail'].value.trim(),
        userMessage: form['userMessage'].value.trim(),
        companyName: form['companyName']?.value.trim() || '',
        userType: form['userType'].value,
        options: options.join(', ')
    };
}

function setupTooltips() {
    const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipElements.forEach((el) => {
        const tooltip = new bootstrap.Tooltip(el, { trigger: 'manual', placement: 'bottom' });
        el.addEventListener('mouseenter', () => tooltip.show());
        el.addEventListener('mouseleave', () => tooltip.hide());
        el.addEventListener('click', () => tooltip._isShown() ? tooltip.hide() : tooltip.show());
    });
}

window.onload = () => {
    document.getElementById("year-site").textContent = new Date().getFullYear();
    updateMyAge();
    setupDynamicValidation();
    setupTooltips();
    document.getElementById("hire-me-button")?.addEventListener("click", () => {
        new bootstrap.Modal(document.getElementById("hire-me-modal")).show();
    });
    document.getElementById('hire-me-form').addEventListener('submit', sendFormEmail);
};
