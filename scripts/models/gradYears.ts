import { YearsAPIResponse } from '../types/types';
import { StatusConstants } from '../constants/statusConstants'

export class GradYears {
    public years: Array<string>;

    /** 
     * Initializes the data.
    */
    public async initData() {
        const response = await fetch('../api/get_grad_years.php', {
            method: 'GET'
        });

        const data: YearsAPIResponse = await response.json();
    
        if (data.status == StatusConstants.SUCCESS) {
            this.years = data.data;
        } else {
            throw new Error('Could not fetch years.');
        }
    }
}
