import { generateCheckboxes, displayWarning, validateInputFieldData, validateSelectFieldData, generateTimeSelectOptions } from './common/uiElements';
import { Majors } from './models/majors';
import { EventInfo } from './models/eventInfo';
import { EmployerRegistration } from './models/employerRegistration';
import { convertTo12HourString } from './common/utils';

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
 * Adds '-' for the phone number input.
 */
export const phoneNumberFormater = function () {
    const phoneNumberInput = document.querySelector('.intro #phone') as HTMLInputElement;

    phoneNumberInput.onkeyup = ((event) => {
        if ((phoneNumberInput.value.length === 3 || phoneNumberInput.value.length === 7)
        && phoneNumberInput.value !== ''
        && event.key !== 'Backspace') {
          phoneNumberInput.value += '-';
        }
    });
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
        const dietary = document.querySelector('form #dietary') as HTMLInputElement;
    
        const startTimeSelect = document.querySelector('form #start-time select') as HTMLSelectElement;
        const startTime = startTimeSelect.options[startTimeSelect.selectedIndex];
        const endTimeSelect = document.querySelector('form #end-time select') as HTMLSelectElement;
        const endTime = endTimeSelect.options[endTimeSelect.selectedIndex];

        const majorsSelect = getAllMajorsSelected();
    
        const alumnusCheckbox = document.querySelector('form #alumnus') as HTMLInputElement;

        if(!validateInputFieldData(name, company, email, phone) && !validateSelectFieldData(startTimeSelect, endTimeSelect)){
            if (majorsSelect) {
                let alumnusStatus = 'No';
            
                if (alumnusCheckbox.checked == true) {
                    alumnusStatus = 'Yes';
                }

                signUpButton.style.display = 'none';
                formLoader.style.display = 'block';

                const employerRegistration = new EmployerRegistration(name.value, company.value, email.value, phone.value, dietary.value, alumnusStatus, startTime.value, endTime.value, majorsSelect);
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
