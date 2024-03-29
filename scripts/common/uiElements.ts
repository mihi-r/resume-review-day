import { convertTo12HourString } from './utils';

/**
 * Generate checkboxes with prefixed numerical ids.
 * @param containerElement The parent element to generate the checkboxes in.
 * @param displayNames The display names of each checkbox.
 * @param internalNamePrefix The prefix for each checkbox id.
 */
export const generateCheckboxes = function(containerElement: Element, displayNames: Array<string>, internalNamePrefix: string) {
    displayNames.forEach((displayName, i) => {
        var majorCheckboxElement = document.createElement('input');
        majorCheckboxElement.setAttribute('type', 'checkbox');
        majorCheckboxElement.setAttribute('class', 'form-checkbox-list');
        majorCheckboxElement.setAttribute('id', `${internalNamePrefix}-${i}`);
        containerElement.appendChild(majorCheckboxElement);
        
        var majorLabelElement = document.createElement('label');
        majorLabelElement.setAttribute('for', `${internalNamePrefix}-${i}`);
        majorLabelElement.textContent = displayName;
        containerElement.appendChild(majorLabelElement);
    });
}

/**
 * Generate a option for a select.
 * @param selectElement The select element to add the option in.
 * @param displayName The display name of the option.
 * @param internalName The internal name of the option.
 */
export const generateSelectOption = function(selectElement: Element, displayName: string, internalName: string) {
    var optionElement = document.createElement('option');
    optionElement.textContent = displayName;
    optionElement.value = internalName;

    selectElement.appendChild(optionElement);
}

/**
 * Populate times for time select elements.
 * @param selectElement The select element to add options to.
 * @param startTime The start time.
 * @param endTime The end time.
 * @param interval The interval in minutes to increment the options by.
 * @param startTimeInclusive If the start time should be included as one of the options.
 * @param endTimeInclusive If the end time should be included as one of the options.
 */
export const generateTimeSelectOptions = function (
    selectElement: Element, startTime: string, endTime: string, 
    interval: number, startTimeInclusive: boolean = true, endTimeInclusive: boolean = false
) {
    let currTimeDate = new Date(`Jan 1, 2000 ${startTime}`);
    const stopTimeDate = new Date(`Jan 1, 2000 ${endTime}`);

    if (!startTimeInclusive) {
        currTimeDate = new Date(currTimeDate.getTime() + interval * 60000);
    }

    let currTime = currTimeDate.getHours();
    const stopTime = stopTimeDate.getHours();

    while (currTime < stopTime) {
        const currTimeMin = currTimeDate.getMinutes();

        const displayName = convertTo12HourString(currTime, currTimeMin);
        const internalName = `${currTime < 10 ? `0${currTime}` : currTime}:${currTimeMin < 10 ? `0${currTimeMin}` : currTimeMin}:00`;

        generateSelectOption(selectElement, displayName, internalName);

        currTimeDate = new Date(currTimeDate.getTime() + interval * 60000);
        currTime = currTimeDate.getHours();
    }

    if (endTimeInclusive) {
        const currTimeMin = currTimeDate.getMinutes();

        const displayName = convertTo12HourString(currTime, currTimeMin);
        const internalName = `${currTime < 10 ? `0${currTime}` : currTime}:${currTimeMin < 10 ? `0${currTimeMin}` : currTimeMin}:00`;

        generateSelectOption(selectElement, displayName, internalName);
    }
};

/**
 * Generate a dismissible warning message.
 * @param msg The message to display.
 */
export const displayWarning = function(msg: string) {
    const containerForm = document.querySelector('.container form');

    const warningDiv = document.createElement('div');
    const warningCloseDiv = document.createElement('div');
    const warningPara = document.createElement('p');
    const warningCloseIcon = document.createElement('i');

    warningDiv.classList.add('warning');
    warningCloseDiv.classList.add('close');
    warningCloseIcon.classList.add('far');
    warningCloseIcon.classList.add('fa-times-circle');

    warningPara.textContent = msg;

    warningCloseDiv.appendChild(warningCloseIcon);
    warningDiv.appendChild(warningCloseDiv);
    warningDiv.appendChild(warningPara);

    if (containerForm !== null) {
        containerForm.appendChild(warningDiv);
    }

    setTimeout(() => {
        warningDiv.style.opacity = '1';
    }, 300);

    warningCloseDiv.onclick = (() => {
        warningDiv.style.opacity = '0';
        setTimeout(() => {
        warningDiv.remove();
        }, 300);
    });
}

/**
 * Checks if an input field is missing and highlights the field is so.
 * @param field The field to check.
 * @returns If the field is missing.
 */
const checkInputField = function checkForMissingField(field: HTMLInputElement | HTMLOptionElement) {
    if (field.value === '') {
      field.classList.add('missing');
      return true;
    } else if (field.classList.contains('missing')) {
      field.classList.remove('missing');
    }
  
    return false;
};

/**
 * Checks if a select field is missing and highlights the field is so.
 * @param field The field to check.
 * @returns If the field is missing.
 */
const checkSelectField = function checkForMissingField(field: HTMLSelectElement) {
    const fieldOption = field.options[field.selectedIndex];
  
    if (field.parentElement !== null) {
        if (fieldOption.value === '') {
            field.parentElement.classList.add('missing');
            return true;
        } else if (field.parentElement.classList.contains('missing')) {
            field.parentElement.classList.remove('missing');
        }
    }
  
    return false;
};
  
/**
 * Checks if a file field is missing a file and highlights the field is so.
 * @param fileField The field to check.
 * @returns If the file field is missing.
 */
const checkFileField = function checkFileMissing(fileField: HTMLInputElement) {
    if (fileField.files !== null && fileField.files.length === 0) {
      fileField.classList.add('missing');
      return true;
    } else if (fileField.classList.contains('missing')) {
      fileField.classList.remove('missing');
    }
  
    return false;
};
  
/**
 * Validates data by checking for missing fields. A field gets highlighted if missing.
 * @param fields The input fields to check.
 * @returns If any of the fields are missing.
 */
export const validateInputFieldData = function validateDataForMissingValues(...fields: Array<HTMLInputElement>) {
    let isfieldMissing = false;

    fields.forEach(field => {
        if (checkInputField(field)) {
            isfieldMissing = true;
        }
    });

    return isfieldMissing;
};

/**
 * Validates data by checking for missing select fields. A field gets highlighted if missing.
 * @param fields The select fields to check.
 * @returns If any of the fields are missing.
 */
export const validateSelectFieldData = function validateDataForMissingValues(...fields: Array<HTMLSelectElement>) {
    let isfieldMissing = false;

    fields.forEach(field => {
        if (checkSelectField(field)) {
            isfieldMissing = true;
        }
    });

    return isfieldMissing;
};

/**
 * Validates data by checking for file fields. A file field gets highlighted if missing.
 * @param fields The file fields to check.
 * @returns If any of the fields are missing.
 */
export const validateFileFieldData = function validateDataForMissingValues(...fields: Array<HTMLInputElement>) {
    let isfieldMissing = false;

    fields.forEach(field => {
        if (checkFileField(field)) {
            isfieldMissing = true;
        }
    });

    return isfieldMissing;
};

/**
 * Adds '-' for the phone number input.
 */
export const phoneNumberFormatter = function (phoneNumberInput: HTMLInputElement) {
    phoneNumberInput.onkeyup = ((event) => {
        if ((phoneNumberInput.value.length === 3 || phoneNumberInput.value.length === 7)
        && phoneNumberInput.value !== ''
        && event.key !== 'Backspace') {
          phoneNumberInput.value += '-';
        }
    });
};