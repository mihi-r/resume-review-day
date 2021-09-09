import { APIResponse } from "../types/types";

export class ResumeZip {
    /** 
     * Initializes the data.
    */
    public async initData(username:string, password:string) {
        const submissionFormData = new FormData();
        submissionFormData.append('usernameText', username);
        submissionFormData.append('passwordText', password);

        const response = await fetch('../api/get_resume_zipfile.php', {
            method: 'POST',
            body: submissionFormData
        });

        if (response.headers.get('content-type') === 'application/zip') {
            const data = await response.blob();
            const url = URL.createObjectURL(data);
            window.open(url, '_blank');
            URL.revokeObjectURL(url);
        } else if (response.headers.get('content-type') === 'application/json') {
            const data: APIResponse = await response.json();
            throw new Error(data.data);
        } else {
            throw new Error('Something went wrong. Please contact the technology chair if the problem persists.');
        }
    }
}

const materialsRef = db.collection('materials');
const allMaterials = materialsRef.get()
  .then(snapshot => {
    snapshot.forEach(doc => {
        documents.push(doc.data());
    });
    for (var i =0; i < documents.length; i++) {
      DocumentCards.push(<DocumentCard />);
    }
    console.log(documents);
}).catch(err => {
    console.log("Error loading materials.");
});

const getAllMaterialsDocs = async () => {
    const documents = []
    const materialsRef = db.collection('materials');
    const allMaterials = materialsRef.get()

    for(const doc of allMaterials.docs) {
        documents.push(doc.data());
    }
    
    return documents;
}