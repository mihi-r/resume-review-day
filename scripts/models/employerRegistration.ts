import { RegistrationAPIResponse } from '../types/types';
import { StatusConstants } from '../constants/statusConstants';

export class EmployerRegistration {
    public name: string;
    public company: string;
    public email: string;
    public phone: string;
    public reviewMethod: string;
    public dietary: string;
    public alumnusStatus: string;
    public startTime: string;
    public endTime: string;
    public maxResumes: string;
    public majors: string;

    /**
     * The constructor.
     * @param name The name of the employer.
     * @param company The company name of the employer.
     * @param email The email of the employer.
     * @param phone The phone of the employer.
     * @param reviewMethod The review method of the employer.
     * @param dietary The dietary restrictions of the employer.
     * @param alumnusStatus The alumnus status of the employer.
     * @param startTime The desired start time of the employer.
     * @param endTime The desired end time of the employer.
     * @param maxResumes The maximum resumes to review by the employer.
     * @param majors The desired majors.
     */
    constructor(
        name: string, company: string, email: string, phone: string, reviewMethod: string, dietary: string, 
        alumnusStatus: string, startTime: string, endTime: string, maxResumes: string, majors: string
    ) {
        this.name = name;
        this.company = company;
        this.email = email;
        this.phone = phone;
        this.reviewMethod = reviewMethod;
        this.dietary = dietary;
        this.alumnusStatus = alumnusStatus;
        this.startTime = startTime;
        this.endTime = endTime;
        this.maxResumes = maxResumes;
        this.majors = majors;
    }

    /**
     * Send data.
     */
    public async sendData() {
        const submissionFormData = new FormData();
        submissionFormData.append('nameText', this.name);
        submissionFormData.append('companyText', this.company);
        submissionFormData.append('emailText', this.email);
        submissionFormData.append('phoneText', this.phone);
        submissionFormData.append('reviewMethodText', this.reviewMethod);
        submissionFormData.append('dietText', this.dietary);
        submissionFormData.append('alumnusText', this.alumnusStatus);
        submissionFormData.append('startTimeText', this.startTime);
        submissionFormData.append('endTimeText', this.endTime);
        submissionFormData.append('maxResumesText', this.maxResumes);
        submissionFormData.append('majorsText', this.majors);

        const response = await fetch('../api/register_employer.php', {
            method: 'POST',
            body: submissionFormData
        });
        
        const data: RegistrationAPIResponse = await response.json();

        if (data.status === StatusConstants.ERROR) {
            throw new Error(data.data);
        }
    }
}