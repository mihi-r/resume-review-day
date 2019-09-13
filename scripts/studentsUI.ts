import { EventInfo } from './models/eventInfo';
import { Majors } from './models/majors';
import { displayWarning, generateSelectOption, generateTimeSelectOptions } from './common/uiElements';
import { EmployersInfo } from './models/employersInfo';
import { Employer, TimeInterval } from './types/types';
import { convertTo12HourString } from './common/utils';
import { GradYears } from './models/gradYears';

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

    const majorSelectElement = document.querySelector('form #major-select select') as HTMLSelectElement;

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

    generateSelectOption(timeSelectElement, 'All Times', 'All Times');
    generateTimeSelectOptions(timeSelectElement, eventInfo.startTime, eventInfo.endTime, eventInfo.reviewInterval);
};

/**
 * Generate the form to register for a timeslot.
 * @param employer The employer information to display.
 * @param selectedTime The chosen timeslot.
 */
const generateRegisterFrom = async function (employer: Employer, selectedTime: string) {
    const eventInfo = new EventInfo();
    
    try {
        await eventInfo.initData();
    } catch {
        displayWarning('Information could not be fetched. Please refresh the page. Contact the email on the bottom if this error persists.');
    }

    const registerContainer = document.querySelector('.register') as HTMLDivElement;
    registerContainer.style.display = 'block';

    registerContainer.scrollIntoView({behavior: 'smooth', block: 'start'})

    const companyNameSpan = document.querySelector('.register .selected-company-name') as HTMLSpanElement;
    const companyTimeSpan = document.querySelector('.register .selected-company-time') as HTMLSpanElement;
    const reviewInterval = document.querySelector('.register .review-interval') as HTMLSpanElement;
    const majorSelectElement = document.querySelector('.register #student-major-select select') as HTMLSelectElement;
    const yearSelectElement = document.querySelector('.register #year-select select') as HTMLSelectElement;
    const resumeUploadElement = document.querySelector('.register #resume-file') as HTMLInputElement;
    const resumeUploadText = document.querySelector('.register .file-text span') as HTMLSpanElement;

    companyNameSpan.textContent = employer.company;
    companyTimeSpan.textContent = selectedTime;
    reviewInterval.textContent = String(eventInfo.reviewInterval);

    // Only generate majors if it hasn't been generated before
    if (majorSelectElement.children.length === 1) {
        const majors = new Majors();

        try {
            await majors.initData();
        } catch {
            displayWarning('Information could not be fetched. Please refresh the page. Contact the email on the bottom if this error persists.');
        }
    
        majors.majors.forEach((major) => {
            generateSelectOption(majorSelectElement, major, major);
        })

        const years = new GradYears();

        try {
            await years.initData();
        } catch {
            displayWarning('Information could not be fetched. Please refresh the page. Contact the email on the bottom if this error persists.');
        }
    
        years.years.forEach((year) => {
            generateSelectOption(yearSelectElement, year, year);
        })
    }

    // Changes the text of the file upload to the name of the file
    resumeUploadElement.onchange = function () {
        if (resumeUploadElement.files !== null) {
            const fileName = resumeUploadElement.files[0].name;
            resumeUploadText.textContent = fileName;
        }
    };
}

/**
 * Generate a timeslot table for an employer. Timeslots will not be generated for the lunch break.
 * @param container The container to add the generated table to.
 * @param employer The employer information to use for the table.
 * @param lunchStart The start time of the lunch break.
 * @param lunchEnd The end time of the lunch break.
 * @param interval The intervals for each timeslot.
 * @param timeOption The timeslot to show. If 'All Times' is supplied, then all times will be shown.
 */
const generateEmployerTimeslots = function (container: HTMLDivElement, employer: Employer, lunchStart: string, lunchEnd: string, interval: number, timeOption: string) {
    // Create table
    const companyTable = document.createElement('table');
    companyTable.setAttribute('class', 'company-times');
    companyTable.setAttribute('id', `company-${employer.companyId}`);

    // Create icon
    const companyInfoIcon = document.createElement('i');
    companyInfoIcon.setAttribute('class', 'fas fa-info-circle');

    // Create company name header
    let tableTr = document.createElement('tr');
    const companyNameTh = document.createElement('th');
    const companyInfoIconTh = document.createElement('th');
    companyNameTh.textContent = employer.company;

    companyInfoIconTh.appendChild(companyInfoIcon);
    companyInfoIconTh.setAttribute('class', 'company-info-icon');

    tableTr.appendChild(companyNameTh);
    tableTr.appendChild(companyInfoIconTh);
    companyTable.appendChild(tableTr);

    // Create company info cell
    tableTr = document.createElement('tr');
    const companyInfoTd = document.createElement('td');
    const representivePara = document.createElement('p');
    const majorsPara = document.createElement('p');
    const divider = document.createElement('hr');

    representivePara.textContent = `Representive: ${employer.name}`;
    majorsPara.textContent = `Majors: ${employer.majors.join(', ')}`;

    companyInfoTd.setAttribute('colspan', '2');
    companyInfoTd.setAttribute('class', 'company-info');

    companyInfoTd.appendChild(representivePara);
    companyInfoTd.appendChild(divider);
    companyInfoTd.appendChild(majorsPara);
    tableTr.appendChild(companyInfoTd);
    companyTable.appendChild(tableTr);

    // Expand information on click
    companyInfoIconTh.onclick = (() => {
        if (companyInfoTd.style.display == 'table-cell') {
            companyInfoTd.style.transform = 'scaleY(0)';

            setTimeout(function() {
                companyInfoTd.style.display = 'none';
            }, 100);
        } else {
            companyInfoTd.style.display = 'table-cell';

            setTimeout(function() {
                companyInfoTd.style.transform = 'scaleY(1)';
            }, 100);
        }
    })

    const firstTimeInterval: TimeInterval = {
        start: employer.start,
        end: lunchStart
    }

    const secondTimeInterval: TimeInterval = {
        start: lunchEnd,
        end: employer.end
    }

    // Add times
    const timeIntervals = [firstTimeInterval, secondTimeInterval];
    timeIntervals.forEach((timeInterval) => {
        let currTimeDate = new Date(`Jan 1, 2000 ${timeInterval.start}`);
        const stopTimeDate = new Date(`Jan 1, 2000 ${timeInterval.end}`);

        let currTime = currTimeDate.getHours();
        const stopTime = stopTimeDate.getHours();

        while (currTime < stopTime) {
            const currTimeMin = currTimeDate.getMinutes();

            const displayName = convertTo12HourString(currTime, currTimeMin);
            const internalName = `${currTime}:${currTimeMin < 10 ? `0${currTimeMin}` : currTimeMin}:00`;

            if (!employer.unavailableTimes.includes(internalName)) {
                if (timeOption == internalName || timeOption == 'All Times')
                {
                    tableTr = document.createElement('tr');
                    const tableTd = document.createElement('td');
            
                    tableTd.textContent = displayName;
                    tableTd.setAttribute('colspan', '2');
            
                    tableTr.appendChild(tableTd);
                    companyTable.appendChild(tableTr);
        
                    tableTd.onclick = function(e) {
                        const currentSelectedTime = document.querySelector('.employers .selected') as HTMLTableDataCellElement;
                        if (currentSelectedTime != null) {
                            currentSelectedTime.classList.toggle('selected');
                        }
                        
                        tableTd.classList.toggle('selected');
                        generateRegisterFrom(employer, displayName);
                    }
                }
            }

            currTimeDate = new Date(currTimeDate.getTime() + interval * 60000);
            currTime = currTimeDate.getHours();
        }
    });

    // Only generate the table if there are available timeslots
    if (companyTable.children.length > 2)
    {
        container.appendChild(companyTable);
    }
};

/**
 * Display employer timeslot tables.
 * @param majorOption The major to filter by.
 * @param timeOption The time to filter by.
 */
const displayEmployers = async function (majorOption: string, timeOption: string) {
    const employersTimeslots = document.querySelector('.timeslots .employers') as HTMLDivElement;
    const employersInfo = new EmployersInfo();
    const eventInfo = new EventInfo();

    try {
        await employersInfo.initData();
        await eventInfo.initData();
    } catch {
        displayWarning('Information could not be fetched. Please refresh the page. Contact the email on the bottom if this error persists.');
    }

    // Remove already existing timeslots before generating new ones
    while (employersTimeslots.firstChild) {
        employersTimeslots.firstChild.remove();
    }

    employersInfo.employers.forEach((employer) => {
        if (employer.majors.includes(majorOption) || majorOption == 'All Majors') {
            generateEmployerTimeslots(employersTimeslots, employer, eventInfo.lunchStartTime, eventInfo.lunchEndTime, eventInfo.reviewInterval, timeOption);
        }
    });

    if (employersTimeslots.children.length === 0) {
        const notFoundMessage = document.createElement('p');
        notFoundMessage.setAttribute('class', 'not-found-message');
        notFoundMessage.textContent = 'Unfortunately, no available timeslots could be found with your desired filters.';
        employersTimeslots.appendChild(notFoundMessage);
    }
};

/** 
 * Display timeslots with the filters when clicking the filter button.
*/
export const filterAction = function() {
    const filterButton = document.querySelector('.intro #filter-button') as HTMLButtonElement;

    filterButton.onclick = (() => {
        const majorSelectElement = document.querySelector('form #major-select select') as HTMLSelectElement;
        let majorOption = majorSelectElement.options[majorSelectElement.selectedIndex].value;
        const timeSelectElement = document.querySelector('form #time-select select') as HTMLSelectElement;
        let timeOption = timeSelectElement.options[timeSelectElement.selectedIndex].value;
        const timeslotPage = document.querySelector('.timeslots') as HTMLDivElement;
    
        if (!majorOption) {
            majorOption = 'All Majors';
        }
    
        if (!timeOption) {
            timeOption = 'All Times';
        }
    
        // TODO: Add clearTimeslots() function
        displayEmployers(majorOption, timeOption);

        timeslotPage.style.display = 'block';
        timeslotPage.scrollIntoView({behavior: 'smooth', block: 'start'});
    });
};