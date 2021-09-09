interface EventInfo {
    admin_email: string;
    ​​​event_date: string;
    event_end_time: string;
    ​​​event_start_time: string;
    event_lunch_end_time: string;
    ​​​event_lunch_start_time: string;
    event_location: string;
    review_interval_minutes: string;
    student_review_max: string;
    employers_deadline: string;
    students_deadline: string;
    employers_open: string;
    students_open: string;
}

interface EmployerInfo {
    name: string;
    company: string;
    company_id: string;
    review_method: string;
    start: string;
    end: string;
    max_resumes: number;
    majors: Array<string>;
    unavailable_times: Array<string>;
    unavailable_slots: Array<string>;
}

interface ReviewMethodInfo {
    id: number;
    name: string;
    description: string;
    active: number;
}

export interface ReviewMethod {
    id: number;
    name: string;
    description: string;
    active: boolean;
}

export interface Employer {
    name: string;
    company: string;
    companyId: string;
    reviewMethod: string;
    start: string;
    end: string;
    maxResumes: number;
    majors: Array<string>;
    unavailableTimes: Array<string>;
    unavailableSlots: Array<string>;
}

export interface TimeInterval {
    start: string;
    end: string;
}

export interface APIResponse {
    data: any;
    status: string;
}

export interface EventInfoAPIResponse extends APIResponse {
    data: EventInfo;
}

export interface MajorsAPIResponse extends APIResponse {
    data: Array<string>;
}

export interface YearsAPIResponse extends APIResponse {
    data: Array<string>;
}

export interface RegistrationAPIResponse extends APIResponse {
    data: string;
}

export interface EmployerInfoAPIResponse extends APIResponse {
    data: Array<EmployerInfo>;
}

export interface ReviewMethodsAPIResponse extends APIResponse {
    data: Array<ReviewMethodInfo>;
}

export interface ResetAPIResponse extends APIResponse {
    data: string;
}