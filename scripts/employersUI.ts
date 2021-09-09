import { generateCheckboxes, displayWarning, validateInputFieldData, validateSelectFieldData, generateTimeSelectOptions, phoneNumberFormatter } from './common/uiElements';
import { Majors } from './models/majors';
import { EventInfo } from './models/eventInfo';
import { EmployerRegistration } from './models/employerRegistration';
import { convertTo12HourString } from './common/utils';
import { ReviewMethods } from './models/reviewMethods';
import { GeneralConstants } from './constants/generalConstants';

/** 
 * Update the description with the most recent event information.
*/
export const updateDescription = async function () {
    const eventInfo = new EventInfo();
    
    try {
        await eventInfo.initData();
    } catch {
        displayWarning('Information could not be fetched. Please refresh the page. Contact the email on the bottom if this error persists.');
    }

    const eventReviewInterval = document.querySelector('.intro-info .review-interval') as HTMLSpanElement;
    const eventDate = document.querySelector('.intro-info .event-date') as HTMLSpanElement;
    const eventTime = document.querySelector('.intro-info .event-time') as HTMLSpanElement;
    const lunchTime = document.querySelector('.intro-info .lunch-time') as HTMLElement;
    const deadline = document.querySelector('.intro-info .deadline') as HTMLSpanElement;
    const adminEmail = document.querySelector('.intro-info .admin-email') as HTMLAnchorElement;

    eventReviewInterval.textContent = `${eventInfo.reviewInterval}`;

    eventDate.textContent = eventInfo.date;

    let startTime = new Date(`Jan 1, 2000 ${eventInfo.startTime}`);
    let endTime = new Date(`Jan 1, 2000 ${eventInfo.endTime}`);
    let startTime12Hour = convertTo12HourString(startTime.getHours(), startTime.getMinutes());
    let endTime12Hour = convertTo12HourString(endTime.getHours(), endTime.getMinutes());
    eventTime.textContent = `${startTime12Hour} - ${endTime12Hour}`;

    startTime = new Date(`Jan 1, 2000 ${eventInfo.lunchStartTime}`);
    endTime = new Date(`Jan 1, 2000 ${eventInfo.lunchEndTime}`);
    startTime12Hour = convertTo12HourString(startTime.getHours(), startTime.getMinutes());
    endTime12Hour = convertTo12HourString(endTime.getHours(), endTime.getMinutes());
    lunchTime.textContent = `${startTime12Hour} - ${endTime12Hour}`;

    deadline.textContent = eventInfo.employersDeadline;

    adminEmail.textContent = eventInfo.adminEmail;
    adminEmail.setAttribute('href', `mailto:${eventInfo.adminEmail}`);

    // Check to see if form will be open
    if (eventInfo.employersOpen) {
        const registrationForm = document.querySelector('.registration-form form') as HTMLDivElement;
        registrationForm.style.display = 'block';
    } else {
        const eventClosed = document.querySelector('.event-closed') as HTMLDivElement;
        eventClosed.style.display = 'block';
    }
};

/** 
 * Generates radio select for each review method.
*/
export const generateReviewMethodsSelect = async function () {
    const mainFormArea = document.querySelector('form .main-form-area') as HTMLDivElement;
    const reviewMethodContainer = document.querySelector('form .radio-select-container');
    const dietaryInput = document.querySelector('form #dietary') as HTMLInputElement;
    const timeSelectContainer = document.querySelector('form .time-select-container') as HTMLDivElement;
    const reviewCountSliderContainer = document.querySelector('form .review-count-slider-container') as HTMLDivElement;
    const reviewMethods = new ReviewMethods();

    try {
        await reviewMethods.initData();
    } catch {
        displayWarning('Information could not be fetched. Please refresh the page. Contact the email on the bottom if this error persists.');
    }

    // Create radio buttons container
    const radioButtonsContainer = document.createElement('div');
    radioButtonsContainer.setAttribute('class', 'radio-buttons');

    reviewMethods.reviewMethods.forEach((reviewMethod) => {
        if (reviewMethod.active) {
            // Create radio button container
            const radioButtonContainer = document.createElement('div');
            radioButtonContainer.setAttribute('class', 'radio-button')

            // Create radio button area
            const radioButtonArea = document.createElement('div');

            // Create radio button input
            const radioButtonInput = document.createElement('input');
            radioButtonInput.setAttribute('type', 'radio');
            radioButtonInput.setAttribute('name', GeneralConstants.REVIEW_METHODS_RADIO_SELECT_NAME);
            radioButtonInput.setAttribute('id', `review-method-${reviewMethod.id}`);
            radioButtonInput.setAttribute('value', String(reviewMethod.id));

            // Create radio button label
            const radioButtonLabel = document.createElement('label');
            radioButtonLabel.setAttribute('for', `review-method-${reviewMethod.id}`);
            radioButtonLabel.textContent = reviewMethod.name;

            // Create radio button icon
            const radioButtonIcon = document.createElement('i');
            radioButtonIcon.setAttribute('class', 'fas fa-check check');

            // Create radio button description paragraph
            const radioButtonDescriptionPara = document.createElement('p');
            radioButtonDescriptionPara.setAttribute('class', 'radio-button-description');
            radioButtonDescriptionPara.textContent = reviewMethod.description;

            // Create radio button description button
            const radioButtonDescriptionButton = document.createElement('button');
            radioButtonDescriptionButton.setAttribute('type', 'button');
            radioButtonDescriptionButton.textContent = 'Show Details'
            radioButtonDescriptionButton.onclick = (() => {
                radioButtonDescriptionPara.classList.toggle('active');
                if (radioButtonDescriptionButton.textContent === 'Show Details') {
                    radioButtonDescriptionButton.textContent = 'Close Details'
                } else {
                    radioButtonDescriptionButton.textContent = 'Show Details'
                }
            });

            radioButtonContainer.appendChild(radioButtonArea);
            radioButtonContainer.appendChild(radioButtonDescriptionPara);
            radioButtonContainer.appendChild(radioButtonDescriptionButton);
            radioButtonArea.appendChild(radioButtonInput);
            radioButtonArea.appendChild(radioButtonLabel);
            radioButtonArea.appendChild(radioButtonIcon);
            radioButtonsContainer.appendChild(radioButtonContainer);

            radioButtonInput.onchange = (() => {
                mainFormArea.style.display = 'block';
                if (radioButtonInput.checked) {
                    if (radioButtonInput.value === '1') {
                        dietaryInput.style.display = 'block';
                    } else {
                        dietaryInput.style.display = 'none';
                    }

                    if (radioButtonInput.value === '3') {
                        timeSelectContainer.style.display = 'none';
                        reviewCountSliderContainer.style.display = 'block';
                    } else {
                        timeSelectContainer.style.display = 'block';
                        reviewCountSliderContainer.style.display = 'none';
                    }
                }
            });
        }
    });

    reviewMethodContainer?.appendChild(radioButtonsContainer);
}

/** 
 * Generates checkboxes for each major.
*/
export const generateMajorCheckboxes = async function () {
    const majorContainer = document.querySelector('form .majors-container');
    const majors = new Majors();

    try {
        await majors.initData();
    } catch {
        displayWarning('Information could not be fetched. Please refresh the page. Contact the email on the bottom if this error persists.');
    }
    
    if (majorContainer !== null) {
        generateCheckboxes(majorContainer, majors.majors, 'major')
    }
};

export const generateReviewCountSlider = function() {
    const reviewCountSlider = document.querySelector('form .review-count-slider-container .slider') as HTMLInputElement;
    const maxReviewCount = document.querySelector('form .review-count-slider-container .max-review-count') as HTMLSpanElement;
    reviewCountSlider.oninput = (() => {
        maxReviewCount.textContent = reviewCountSlider.value;
    });
};

/** 
 * Generate times for time select elements.
*/
export const generateTimeSelect = async function () {
    const eventInfo = new EventInfo();
    
    try {
        await eventInfo.initData();
    } catch {
        displayWarning('Information could not be fetched. Please refresh the page. Contact the email on the bottom if this error persists.');
    }

    const startTimeSelectElement = document.querySelector('form #start-time select') as HTMLSelectElement;
    const endTimeSelectElement = document.querySelector('form #end-time select') as HTMLSelectElement;

    generateTimeSelectOptions(startTimeSelectElement, eventInfo.startTime, eventInfo.endTime, eventInfo.reviewInterval);

    startTimeSelectElement.onchange = (() => {
        while (endTimeSelectElement.firstElementChild) {
            endTimeSelectElement.removeChild(endTimeSelectElement.firstElementChild);
        }

        if (endTimeSelectElement.parentElement !== null) {
            endTimeSelectElement.parentElement.style.display = 'flex';
        }

        const selectedTime = startTimeSelectElement.options[startTimeSelectElement.selectedIndex].value;
        generateTimeSelectOptions(endTimeSelectElement, selectedTime, eventInfo.endTime, eventInfo.reviewInterval, false, true);
    });
};

/**
 * Adds '-' for the employer phone number input.
 */
export const employerPhoneNumberFormatter = function () {
    const phoneNumberInput = document.querySelector('.intro #phone') as HTMLInputElement;
    phoneNumberFormatter(phoneNumberInput);
};

/** 
 * Get all of the selected majors.
*/
const getAllMajorsSelected = function() {
    const majorContainerCheckboxes = document.querySelectorAll('form .majors-container .form-checkbox-list') as NodeListOf<HTMLInputElement>;
    let majorsText = '';

    majorContainerCheckboxes.forEach((element, i) => {
        if (majorContainerCheckboxes[i].checked == true) {
            const checkboxId = majorContainerCheckboxes[i].getAttribute('id'); 
            const majorLabel = document.querySelector(`form .majors-container label[for="${checkboxId}"]`);
            if (majorLabel !== null) {
                majorsText += `${majorLabel.textContent}, `;
            }
        }
    });

    if (majorsText != '') {
        majorsText = majorsText.slice(0, -2);
    }

    return majorsText;
};

/** 
 * Register the employer after clicking the sign up button.
*/
export const signUpAction = function() {
    const signUpButton = document.querySelector('form #sign-up-button') as HTMLButtonElement;
    const formLoader = document.querySelector('.intro .loader') as HTMLDivElement;

    signUpButton.onclick = (async () => {
        const name = document.querySelector('form #name') as HTMLInputElement;
        const company = document.querySelector('form #company') as HTMLInputElement;
        const email = document.querySelector('form #email') as HTMLInputElement;
        const phone = document.querySelector('form #phone') as HTMLInputElement;
        const reviewMethod = document.querySelector(`input[name="${GeneralConstants.REVIEW_METHODS_RADIO_SELECT_NAME}"]:checked`) as HTMLInputElement;
        const dietary = document.querySelector('form #dietary') as HTMLInputElement;
    
        const startTimeSelect = document.querySelector('form #start-time select') as HTMLSelectElement;
        const startTime = startTimeSelect.options[startTimeSelect.selectedIndex];
        const endTimeSelect = document.querySelector('form #end-time select') as HTMLSelectElement;
        const endTime = endTimeSelect.options[endTimeSelect.selectedIndex];

        const maxResumesCount = document.querySelector('form .review-count-slider-container .slider') as HTMLInputElement;

        const majorsSelect = getAllMajorsSelected();
    
        const alumnusCheckbox = document.querySelector('form #alumnus') as HTMLInputElement;


        if(!validateInputFieldData(name, company, email, phone) && 
            (reviewMethod.value === '3' || !validateSelectFieldData(startTimeSelect, endTimeSelect))
        ){
            if (majorsSelect) {
                let alumnusStatus = 'No';
            
                if (alumnusCheckbox.checked == true) {
                    alumnusStatus = 'Yes';
                }

                signUpButton.style.display = 'none';
                formLoader.style.display = 'block';

                const employerRegistration = new EmployerRegistration(name.value, company.value, email.value, phone.value, reviewMethod.value, dietary.value, alumnusStatus, startTime.value, endTime.value, maxResumesCount.value, majorsSelect);
                try {
                    await employerRegistration.sendData();

                    const registeredBox = document.querySelector('.intro .registered') as HTMLDivElement;
                    const adminEmail = document.querySelector('.intro .registered .admin-email') as HTMLAnchorElement;
                    const registrationForm = document.querySelector('.registration-form form') as HTMLDivElement;

                    registrationForm.style.display = 'none';
                    registeredBox.style.display = 'block';

                    adminEmail.textContent = email.value;
                    adminEmail.setAttribute('href', `mailto:${email.value}`);
                } catch (e) {
                    displayWarning(e);
                }

                signUpButton.style.display = 'block';
                formLoader.style.display = 'none';
            } else {
                displayWarning('At least one major has to be selected to sign up.');
            }
        } else {
            displayWarning('Please complete the form before signing up.')
        }
    });
};
