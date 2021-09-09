import { RegistrationAPIResponse } from '../types/types';
import { StatusConstants } from '../constants/statusConstants';

export class StudentRegistration {
    public name: string;
    public email: string;
    public companyId: string;
    public time: string;
    public slot: string;
    public year: string;
    public major: string;
    public resume: File | undefined;

    /**
     * The constructor.
     * @param name The name of the student.
     * @param email The email of the student.
     * @param companyId The selected company id.
     * @param time The selected time (if applicable).
     * @param slot The selected slot (if applicable). s
     * @param year The graduation year of the student.
     * @param major The major of the student.
     * @param resume The resume file of the student.
     */
    constructor(
        name: string, email: string, companyId: string, time: string,
        slot: string, year: string, major: string, resume?: File
    ) {
        this.name = name;
        this.email = email;
        this.companyId = companyId;
        this.time = time;
        this.slot = slot;
        this.year = year;
        this.major = major;
        this.resume = resume;
    }

    /**
     * Send data.
     */
    public async sendData() {
        const submissionFormData = new FormData();
        submissionFormData.append('nameText', this.name);
        submissionFormData.append('emailText', this.email);
        submissionFormData.append('yearText', this.year);
        submissionFormData.append('companyIdText', this.companyId);
        submissionFormData.append('timeText', this.time);
        submissionFormData.append('slotText', this.slot);
        submissionFormData.append('majorText', this.major);
        if (this.resume) {
            submissionFormData.append('resumeFile', this.resume);
        }

        const response = await fetch('../api/register_student.php', {
            method: 'POST',
            body: submissionFormData
        });
        
        const data: RegistrationAPIResponse = await response.json();

        if (data.status === StatusConstants.ERROR) {
            throw new Error(data.data);
        }
    }
}