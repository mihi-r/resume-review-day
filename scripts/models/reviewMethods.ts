import { StatusConstants } from '../constants/statusConstants';
import { ReviewMethodsAPIResponse, ReviewMethod } from '../types/types';

const reviewMethods: Array<ReviewMethod> = [];

export class ReviewMethods {
    public reviewMethods: Array<ReviewMethod> = [];

    /** 
     * Initializes the data.
    */
    public async initData() {
        if (reviewMethods.length === 0) {
            const response = await fetch('../api/get_review_methods.php', {
                method: 'GET'
            });
    
            const data: ReviewMethodsAPIResponse = await response.json();
    
            if (data.status == StatusConstants.SUCCESS) {
                const info = data.data;
    
                info.forEach((reviewMethod) => {
                    reviewMethods.push({
                        id: reviewMethod.id,
                        name: reviewMethod.name,
                        description: reviewMethod.description,
                        active: Boolean(reviewMethod.active),
                    });
                });
            } else {
                throw new Error('Could not fetch review methods.');
            }
        }
        
        this.reviewMethods = reviewMethods;
    }
}