import { ResetAPIResponse } from '../types/types';
import { StatusConstants } from '../constants/statusConstants';

export class Reset {
    /** 
     * Initializes the data.
    */
    public async initData(username:string, password:string) {
        const submissionFormData = new FormData();
        submissionFormData.append('usernameText', username);
        submissionFormData.append('passwordText', password);

        const response = await fetch('../api/reset.php', {
            method: 'POST',
            body: submissionFormData
        });
        
        const data: ResetAPIResponse = await response.json();

        if (data.status === StatusConstants.ERROR) {
            throw new Error(data.data);
        }
    }
}