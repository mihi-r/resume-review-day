interface Info {
    admin_email: string;
    ​​​event_date: string;
    event_end_time: string;
    event_lunch_end_time: string;
    ​​​event_lunch_start_time: string;
    ​​​event_start_time: string;
    review_interval_minutes: string;
}

export interface APIResponse {
    data: Array<Object>;
    status: string;
}

export interface InfoAPIResponse extends APIResponse {
    data: Array<Info>;
}