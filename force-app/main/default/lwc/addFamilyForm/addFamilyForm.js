import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { createRecord } from 'lightning/uiRecordApi';
import { getRecord } from 'lightning/uiRecordApi';
import isGuest from '@salesforce/user/isGuest';

export default class ContactForm extends LightningElement {
    @track firstName = '';
    @track lastName = '';
    @track emailId='';
    @track phoneVal='';
    @track isFormVisible = true;
    @track isConfirmationVisible = false;
    isGuest = isGuest;

    get showForm() {
        return this.isFormVisible && !this.isGuest;
    }

    get showConfirmation() {
        return this.isConfirmationVisible && !this.isGuest;
    }

    
    @wire(getRecord, { recordId: USER_ID, fields: FIELDS })
    user({ error, data }) {
        if (data) {
            this.contactId = data.fields.ContactId.value;
        } else if (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading user data',
                    message: error.body.message,
                    variant: 'error',
                }),
            );
        }
    }

    
    handleInputChange(event) {
        const field = event.target.dataset.id;
        if (field === 'firstName') {
            this.firstName = event.target.value;
        } else if (field === 'lastName') {
            this.lastName = event.target.value;
        } else if (field === 'email') {
            this.emailId = event.target.value;
        } 
    }
    handleSubmit() {
        const requestPayload = {
            firstName: this.firstName,
            lastName: this.lastName,
            emailId: this.emailId,
            phoneVal: this.phoneVal
        };
        console.log('Submitting Maintenance Request:', requestPayload);

        submitMaintenanceRequest(requestPayload)
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Maintenance request submitted successfully!',
                    variant: 'success',
                }),
            );
            // Hide form and show confirmation
            this.isFormVisible = false;
            this.isConfirmationVisible = true;
        })
        .catch(error => {
            console.error('Error submitting maintenance request:', error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'An error occurred while submitting the request.',
                    variant: 'error',
                }),
            );
        });
    }
}
