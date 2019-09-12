import { EmployerInfoAPIResponse, Employer } from '../types/types';
import { StatusConstants } from '../constants/statusConstants';

export class EmployersInfo {
    public employers: Array<Employer> = [];

    /** 
     * Initializes the data.
    */
    public async initData() {
        const response = await fetch('../api/get_employer_info.php', {
            method: 'GET'
        });

        const data: EmployerInfoAPIResponse = await response.json();

        if (data.status == StatusConstants.SUCCESS) {
            const info = data.data;

            info.forEach((employerInfo) => {
                const employer: Employer = {
                    name: employerInfo.name,
                    company: employerInfo.company,
                    companyId: employerInfo.company_id,
                    start: employerInfo.start,
                    end: employerInfo.end,
                    majors: employerInfo.majors,
                    unavailableTimes: employerInfo.unavailable_times
                }

                this.employers.push(employer);
            });
        } else {
            throw new Error('Could not fetch info.');
        }
    }
}