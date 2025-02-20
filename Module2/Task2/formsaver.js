// Function to trim whitespace from input values
function trimInput(value) {
  return value.trim();
}

// Function to validate email format
function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Function to validate phone number format
function validatePhoneNumber(phoneNumber) {
  const regex = /^[0-9]{10}$/; // Basic phone number validation (10 digits)
  return regex.test(phoneNumber);
}

// Function to save user input to local storage
function saveUserInput() {
  const fields = ['fullName', 'email', 'phoneNumber', 'dob', 'gender', 'city', 'state', 'country', 'address', 'message'];

  fields.forEach(field => {
    const value = document.getElementById(field).value;
    localStorage.setItem(field, value);
  });
}

// Function to retrieve and display data from local storage
function retrieveUserInput() {
  const fields = ['fullName', 'email', 'phoneNumber', 'dob', 'gender', 'city', 'state', 'country', 'address', 'message'];

  fields.forEach(field => {
    const storedValue = localStorage.getItem(field);
    if (storedValue) {
      document.getElementById(field).value = storedValue;
    }
  });
}

document.getElementById('fileUpload').addEventListener('change', function() {
  const fileName = this.files[0] ? this.files[0].name : 'Choose File';
  document.getElementById('fileLabel').textContent = fileName;
});


// Event listeners for input fields
const inputFields = document.querySelectorAll('input, textarea');
inputFields.forEach(field => {
  field.addEventListener('input', saveUserInput);
});

// Retrieve and display data on page load
retrieveUserInput();

// Get the checkbox and submit button elements
const termsCheckbox = document.getElementById('terms');
const submitButton = document.getElementById('submitButton');
const yesbox = document.getElementById('counselingYes');
const nobox = document.getElementById('counselingNo');
const fileUpload = document.getElementById('fileUpload');

// Function to enable/disable submit button based on form state
function toggleSubmitButton() {
  const fields = ['fullName', 'email', 'phoneNumber', 'dob', 'gender', 'city', 'state', 'country', 'address', 'message'];
  let allFieldsFilled = true;

  fields.forEach(field => {
    if (!trimInput(document.getElementById(field).value)) {
      allFieldsFilled = false;
    }
  });

  const isFileUploaded = fileUpload.files.length>0;

  if (allFieldsFilled && termsCheckbox.checked && isFileUploaded && (yesbox.checked || nobox.checked)) {
    submitButton.disabled = false;
    submitButton.classList.remove('btn-secondary');
    submitButton.classList.add('btn-orange');
  } else {
    submitButton.disabled = true;
    submitButton.classList.remove('btn-orange');
    submitButton.classList.add('btn-secondary');
  }
}

fileUpload.addEventListener('change',toggleSubmitButton);
// Initial button state (disabled initially)
toggleSubmitButton();

// Event listeners for input fields and checkbox
inputFields.forEach(field => {
  field.addEventListener('input', toggleSubmitButton);
});
termsCheckbox.addEventListener('change', toggleSubmitButton);

// Form submission handler
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent default form submission

  // Validate form fields
  const fields = ['fullName', 'email', 'phoneNumber', 'dob', 'gender', 'city', 'state', 'country', 'address', 'message'];
  let isValid = true;
  let hasGeneralError = false; // Flag to track if general error is already displayed

  fields.forEach(field => {
    const fieldElement = document.getElementById(field);
    const value = trimInput(fieldElement.value);

    // Clear any existing error messages
    const existingError = fieldElement.nextElementSibling;
    if (existingError && existingError.classList.contains('invalid-feedback')) {
      existingError.remove();
      fieldElement.classList.remove('is-invalid'); // Remove red outline
    }

    if (!value) {
      isValid = false;
      fieldElement.classList.add('is-invalid'); // Add red outline

      // Create an error message element
      const errorMessage = document.createElement('div');
      errorMessage.classList.add('invalid-feedback');
      errorMessage.textContent = `Please fill in the ${field} field.`;

      // Insert error message after the field
      fieldElement.parentNode.insertBefore(errorMessage, fieldElement.nextSibling);
    }

    if (field === 'email' && !validateEmail(value)) {
      isValid = false;
      fieldElement.classList.add('is-invalid');

      // Create an error message element
      const errorMessage = document.createElement('div');
      errorMessage.classList.add('invalid-feedback');
      errorMessage.textContent = 'Please enter a valid email address.';

      // Insert error message after the field
      fieldElement.parentNode.insertBefore(errorMessage, fieldElement.nextSibling);
    }

    if (field === 'phoneNumber' && !validatePhoneNumber(value)) {
      isValid = false;
      fieldElement.classList.add('is-invalid');

      // Create an error message element
      const errorMessage = document.createElement('div');
      errorMessage.classList.add('invalid-feedback');
      errorMessage.textContent = 'Please enter a valid 10-digit phone number.';

      // Insert error message after the field
      fieldElement.parentNode.insertBefore(errorMessage, fieldElement.nextSibling);
    }
  });

  if (!isValid && !hasGeneralError) {
    // Display a general error message only once if any field is invalid
    hasGeneralError = true; 
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('alert', 'alert-danger', 'mt-3');
    errorMessage.textContent = 'Please fill in all required fields correctly.';
    contactForm.parentNode.insertBefore(errorMessage, contactForm.nextSibling);

    

    // Sleep for 5 seconds before removing error messages
    setTimeout(() => {
      fields.forEach(field => {
        const fieldElement = document.getElementById(field);
        const existingError = fieldElement.nextElementSibling;
        if (existingError && existingError.classList.contains('invalid-feedback')) {
          existingError.remove();
          fieldElement.classList.remove('is-invalid');
        }
      });
      // Remove the general error message if it exists
      const generalError = contactForm.nextElementSibling;
      if (generalError && generalError.classList.contains('alert-danger')) {
        generalError.remove();
        hasGeneralError = false; // Reset the flag
      }
    }, 6000); // Sleep time in milliseconds
  }

  submitButton.disabled = true; 
    setTimeout(() => {
      submitButton.disabled = false;
      hasGeneralError = false; // Reset the flag for the next submission attempt
    }, 3000);

  if (isValid) {


    // Show success message
    const successMessage = document.createElement('div');
    successMessage.classList.add('alert', 'alert-success', 'mt-3');
    successMessage.textContent = 'Form submitted successfully!';

    // Insert success message below the form
    contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);

    // Optionally reset the form
    contactForm.reset();

    // Remove success message after a short delay
    setTimeout(() => {
      if (successMessage.parentNode) { // Check if the successMessage is still in the DOM
        successMessage.parentNode.removeChild(successMessage);
      }
    }, 7000); // Remove success message after 3 seconds
  }
});