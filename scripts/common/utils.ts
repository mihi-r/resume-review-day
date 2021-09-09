/**
 * Convert 24-hour time to 12-hour string format.
 * @param hour The hour.
 * @param minute The minute.
 * @returns The time in 12-hour format.
 */
export const convertTo12HourString = function(hour: number, minute: number) {
    let time12Hour = `${hour <= 12 ? hour : hour-12}:${minute < 10 ? `0${
        minute}` : minute}`;
    time12Hour += hour < 12 ? " AM" : " PM";

    return time12Hour;
}