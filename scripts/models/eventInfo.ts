import { InfoAPIResponse } from '../types/types'
import { StatusConstants } from '../constants/statusConstants'

export class EventInfo {
    public date: string;
    public startTime: string;
    public endTime: string;
    public lunchStartTime: string;
    public lunchEndTime: string;
    public reviewInterval: number;
    public adminEmail: string;
    public employersDeadline: string;
    public studentsDeadline: string;
    public employersOpen: boolean;
    public studentsOpen: boolean;

    /** 
     * Initializes the data.
    */
    public async initData() {
        const response = await fetch('../api/get_info.php', {
            method: 'GET'
        });

        const data: InfoAPIResponse = await response.json();

        if (data.status == StatusConstants.SUCCESS) {
            const info = data.data;

            if (info !== undefined) {
                this.date = info.event_date;
                this.startTime = info.event_start_time;
                this.endTime = info.event_end_time;
                this.lunchStartTime = info.event_lunch_start_time;
                this.lunchEndTime =info.event_lunch_end_time;
                this.reviewInterval = Number(info.review_interval_minutes);
                this.adminEmail = info.admin_email;
                this.employersDeadline = info.employers_deadline;
                this.studentsDeadline = info.students_deadline;
                this.employersOpen = Boolean(Number(info.employers_open));
                this.studentsOpen = Boolean(Number(info.students_open));
            }
        } else {
            throw new Error('Could not fetch info.');
        }
    }
}