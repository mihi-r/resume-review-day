import { EventInfo } from './models/eventInfo';
import { Majors } from './models/majors';
import { displayWarning, generateSelectOption, generateTimeSelectOptions } from './common/uiElements';

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
    const location = document.querySelector('.intro-info .location') as HTMLSpanElement;
    const deadline = document.querySelector('.intro-info .deadline') as HTMLSpanElement;
    const adminEmail = document.querySelector('.intro-info .admin-email') as HTMLAnchorElement;

    eventReviewInterval.textContent = `${eventInfo.reviewInterval}`;

    eventDate.textContent = eventInfo.date;

    location.textContent = eventInfo.location;

    deadline.textContent = eventInfo.studentsDeadline;

    adminEmail.textContent = eventInfo.adminEmail;
    adminEmail.setAttribute('href', `mailto:${eventInfo.adminEmail}`);
};

/** 
 * Generate majors for major select filter.
*/
export const generateMajorSelect = async function () {
    const majors = new Majors();

    try {
        await majors.initData();
    } catch {
        displayWarning('Information could not be fetched. Please refresh the page. Contact the email on the bottom if this error persists.');
    }

    const majorSelectElement = document.querySelector("form #major-select select") as HTMLSelectElement;

    generateSelectOption(majorSelectElement, 'All Majors', 'All Majors');
    majors.majors.forEach((major) => {
        generateSelectOption(majorSelectElement, major, major);
    })
};

/** 
 * Generate times for time select filter.
*/
export const generateTimeSelect = async function () {
    const eventInfo = new EventInfo();
    
    try {
        await eventInfo.initData();
    } catch {
        displayWarning('Information could not be fetched. Please refresh the page. Contact the email on the bottom if this error persists.');
    }

    const timeSelectElement = document.querySelector('form #time-select select') as HTMLSelectElement;

    generateTimeSelectOptions(timeSelectElement, eventInfo.startTime, eventInfo.endTime, eventInfo.reviewInterval);
};
