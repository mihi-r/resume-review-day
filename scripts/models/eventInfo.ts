import { InfoAPIResponse } from '../types/types'
import { StatusConstants } from '../constants/statusConstants'

export class EventInfo {
    public date: Date;
    public startTime: string;
    public endTime: string;
    public lunchStartTime: string;
    public lunchEndTime: string;
    public reviewInterval: number;
    public adminEmail: string;

    /** 
     * Initializes the data.
    */
    public async initData() {
        const response = await fetch('../api/get_info.php', {
            method: 'GET',
        });

        const data: InfoAPIResponse = await response.json();
        if (data.status == StatusConstants.SUCCESS) {
            // We only want to most recent event details
            const info = data.data.pop();

            if (info !== undefined) {
                this.date = new Date(info.event_date);
                this.startTime = info.event_start_time;
                this.endTime = info.event_end_time;
                this.lunchStartTime = info.event_lunch_start_time;
                this.lunchEndTime =info.event_lunch_end_time;
                this.reviewInterval = Number(info.review_interval_minutes);
                this.adminEmail = info.admin_email;
            }
        } else {
            throw new Error('Could not fetch data.');
        }
    }
}