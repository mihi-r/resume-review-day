import { generateCheckboxes, generateSelectOption } from './common/uiElements';
import { Majors } from './models/majors';
import { EventInfo } from './models/eventInfo';

/** 
 * Generates checkboxes for each major.
*/
export const generateMajorCheckboxes = async function () {
    const majorContainer = document.querySelector('form .majors-container');
    const majors = new Majors();
    await majors.initData();
    
    if (majorContainer !== null) {
        generateCheckboxes(majorContainer, majors.majors, 'major')
    }
};

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
        currTimeDate = new Date(currTimeDate.getTime() + interval*60000);
    }

    let currTime = currTimeDate.getHours();
    const stopTime = stopTimeDate.getHours();

    while (currTime < stopTime) {
        const currTimeMin = currTimeDate.getMinutes();

        let displayName = `${currTime <= 12 ? currTime : currTime-12}:${currTimeMin < 10 ? `0${currTimeMin}` : currTimeMin}`;
        displayName += currTime < 12 ? " AM" : " PM";
        const internalName = `${currTime}:${currTimeMin < 10 ? `0${currTimeMin}` : currTimeMin}:00`;

        generateSelectOption(selectElement, displayName, internalName);

        currTimeDate = new Date(currTimeDate.getTime() + interval*60000);
        currTime = currTimeDate.getHours();
    }

    if (endTimeInclusive) {
        const currTimeMin = currTimeDate.getMinutes();

        let displayName = `${currTime <= 12 ? currTime : currTime-12}:${currTimeMin < 10 ? `0${currTimeMin}` : currTimeMin}`;
        displayName += currTime < 12 ? " AM" : " PM";
        const internalName = `${currTime}:${currTimeMin < 10 ? `0${currTimeMin}` : currTimeMin}:00`;

        generateSelectOption(selectElement, displayName, internalName);
    }
};

/** 
 * Generate times for time select elements.
*/
export const generateTimeSelect = async function () {
    const startTimeSelectElement = document.querySelector('form #start-time select') as HTMLSelectElement;
    const endTimeSelectElement = document.querySelector('form #end-time select') as HTMLSelectElement;
    const eventInfo = new EventInfo();
    await eventInfo.initData();

    if (startTimeSelectElement !== null) {
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
    }
};