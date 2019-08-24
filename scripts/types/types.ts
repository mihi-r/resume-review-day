interface Info {
    admin_email: string;
    ​​​event_date: string;
    event_end_time: string;
    event_lunch_end_time: string;
    ​​​event_lunch_start_time: string;
    ​​​event_start_time: string;
    review_interval_minutes: string;
    employers_deadline: string;
    students_deadline: string;
    employers_open: string;
    students_open: string;
}

export interface APIResponse {
    data: any;
    status: string;
}

export interface InfoAPIResponse extends APIResponse {
    data: Info;
}

export interface MajorsAPIResponse extends APIResponse {
    data: Array<string>;
}

export interface RegistrationAPIResponse extends APIResponse {
    data: string;
}