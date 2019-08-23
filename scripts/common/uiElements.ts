/**
 * Generate checkboxes with prefixed numerical ids.
 * @param containerElement The parent element to generate the checkboxes in.
 * @param displayNames The display names of each checkbox.
 * @param internalNamePrefix The prefix for each checkbox id.
 */
export const generateCheckboxes = function(containerElement: Element, displayNames: Array<string>, internalNamePrefix: string) {
    displayNames.forEach((displayName, i) => {
        var majorCheckboxElement = document.createElement('input');
        majorCheckboxElement.setAttribute('type', 'checkbox');
        majorCheckboxElement.setAttribute('class', 'form-checkbox-list');
        majorCheckboxElement.setAttribute('id', `${internalNamePrefix}-${i}`);
        containerElement.appendChild(majorCheckboxElement);
        
        var majorLabelElement = document.createElement('label');
        majorLabelElement.setAttribute('for', `${internalNamePrefix}-${i}`);
        majorLabelElement.textContent = displayName;
        containerElement.appendChild(majorLabelElement);
    });
}

/**
 * Generate a option for a select.
 * @param selectElement The select element to add the option in.
 * @param displayName The display name of the option.
 * @param internalName The internal name of the option.
 */
export const generateSelectOption = function(selectElement: Element, displayName: string, internalName: string) {
    var optionElement = document.createElement('option');
    optionElement.textContent = displayName;
    optionElement.value = internalName;

    selectElement.appendChild(optionElement);
}