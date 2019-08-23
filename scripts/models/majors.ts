export class Majors {
    public majors: Array<string>;

    /** 
     * Initializes the data.
    */
    public async initData() {
        const response = await fetch('../api/get_majors.php', {
            method: 'GET',
        });

        const data: Array<string> = await response.json();
        this.majors = data;
    }
}