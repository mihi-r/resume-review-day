import { MajorsAPIResponse } from '../types/types';
import { StatusConstants } from '../constants/statusConstants'

export class Majors {
    public majors: Array<string>;

    /** 
     * Initializes the data.
    */
    public async initData() {
        const response = await fetch('../api/get_majors.php', {
            method: 'GET'
        });

        const data: MajorsAPIResponse = await response.json();
        if (data.status == StatusConstants.SUCCESS) {
            this.majors = data.data;
        } else {
            throw new Error('Could not fetch majors.');
        }
    }
}