import { ResumeZip } from './models/resumeZip';
import { displayWarning, validateInputFieldData } from './common/uiElements';
import { Reset } from './models/reset';

export const downloadResumesAction = function() {
    const resumeZip = new ResumeZip();
    const resetButton = document.querySelector('.intro #reset-button') as HTMLButtonElement;
    const downloadButton = document.querySelector('.intro #download-button') as HTMLButtonElement;
    const resetContinueContainer = document.querySelector('.intro .continue-reset') as HTMLDivElement;
    const username = document.querySelector('.intro #username') as HTMLInputElement;
    const password = document.querySelector('.intro #password') as HTMLInputElement;
    const formLoader = document.querySelector('.intro .loader') as HTMLDivElement;

    downloadButton.onclick = async function () {
        let isResetContinueContainerHiddenInitially = true;
        if (resetContinueContainer.style.display === 'block') {
            isResetContinueContainerHiddenInitially = false;
        }

        downloadButton.style.display = 'none';
        resetButton.style.display = 'none';
        resetContinueContainer.style.display = 'none';
        formLoader.style.display = 'block';

        try {
            if (!validateInputFieldData(username, password)) {
                await resumeZip.initData(username.value, password.value);
            } else {
                displayWarning('Please enter in your username and password.');
            }
        } catch (e){
            displayWarning(e);
        }

        downloadButton.style.display = 'block';
        formLoader.style.display = 'none';

        if (isResetContinueContainerHiddenInitially) {
            resetButton.style.display = 'block';
        } else {
            resetContinueContainer.style.display = 'block';
        }
    }
}

export const resetAction = function() {
    const resetButton = document.querySelector('.intro #reset-button') as HTMLButtonElement;
    const resetContinueContainer = document.querySelector('.intro .continue-reset') as HTMLDivElement;

    resetButton.onclick = function () {
        resetContinueContainer.style.display = 'block';
        resetButton.style.display = 'none';
    }
}

export const continueResetAction = function() {
    const reset = new Reset()
    const mainContainer = document.querySelector('.main') as HTMLDivElement;
    const downloadButton = document.querySelector('.intro #download-button') as HTMLButtonElement;
    const resetSuccessContainer = document.querySelector('.reset-success') as HTMLDivElement;
    const continueResetButton = document.querySelector('.intro #reset-continue-button') as HTMLButtonElement;
    const username = document.querySelector('.intro #username') as HTMLInputElement;
    const password = document.querySelector('.intro #password') as HTMLInputElement;
    const continueResetText = document.querySelector('.intro #continue-reset') as HTMLInputElement;
    const formLoader = document.querySelector('.intro .loader') as HTMLDivElement;

    continueResetButton.onclick = async function () {
        downloadButton.style.display = 'none';
        continueResetButton.style.display = 'none';
        formLoader.style.display = 'block';
        let success = false;

        try {
            if (validateInputFieldData(username, password)) {
                displayWarning('Please enter in your username and password.');
            } else if (continueResetText.value.toLowerCase() !== 'yes') {
                console.log(continueResetText.textContent?.toLowerCase());
                displayWarning('You will need to enter "Yes" (case insensitive) to reset Resume Review Day.');
            } else {
                await reset.initData(username.value, password.value);
                mainContainer.style.display = 'none';
                resetSuccessContainer.style.display = 'block';
                success = true;
            }
        } catch (e){
            displayWarning(e);
        }

        if (!success) {
            downloadButton.style.display = 'block';
            continueResetButton.style.display = 'block';
            formLoader.style.display = 'none';
        }
    }
}