import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import submitMaintenanceRequest from '@salesforce/apex/MaintenanceRequestController.submitMaintenanceRequest';
import getRentalProperty from '@salesforce/apex/MaintenanceRequestController.getRentalProperty';
import { getRecord } from 'lightning/uiRecordApi';
import USER_ID from '@salesforce/user/Id';
import isGuest from '@salesforce/user/isGuest';

const FIELDS = ['User.ContactId'];

export default class MaintenanceRequestForm extends LightningElement {
    @track subject = '';
    @track description = '';
    @track priority = '';
    @track contactId;
    @track rentalPropertyId;
    @track rentalPropertyName;
    @track isFormVisible = true;
    @track isConfirmationVisible = false;
    isSubmitDisabled = false; // Not tracked because we don't need reactive UI changes for it
    isGuest = isGuest;

    priorityOptions = [
        { label: 'Low', value: 'Low' },
        { label: 'Medium', value: 'Medium' },
        { label: 'High', value: 'High' },
    ];

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
            this.queryRentalProperty(this.contactId);
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

    queryRentalProperty(contactId) {
        getRentalProperty({ contactId })
            .then(result => {
                this.rentalPropertyId = result.rentalPropertyId;
                this.rentalPropertyName = result.rentalPropertyName;
                console.log('Retrieved Rental Property ID:', this.rentalPropertyId);
                console.log('Retrieved Rental Property Name:', this.rentalPropertyName);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error loading rental property data',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
    }

    handleInputChange(event) {
        const field = event.target.dataset.id;
        if (field === 'subject') {
            this.subject = event.target.value;
        } else if (field === 'description') {
            this.description = event.target.value;
        } else if (field === 'priority') {
            this.priority = event.target.value;
        }
    }

    handleSubmit() {
        // Prevent additional clicks by checking the flag
        if (this.isSubmitDisabled) {
            return;
        }

        // Disable the submit button and prevent further clicks
        this.isSubmitDisabled = true;

        // Hide the form and show the confirmation page
        this.isFormVisible = false;
        this.isConfirmationVisible = true;

        const requestPayload = {
            subject: this.subject,
            description: this.description,
            priority: this.priority,
            contactId: this.contactId,
            rentalPropertyId: this.rentalPropertyId
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
            // No need to change visibility or re-enable the button since it's already done
        })
        .catch(error => {
            console.error('Error submitting maintenance request:', error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body ? error.body.message : error.message, // Show specific error message from Apex
                    variant: 'error',
                }),
            );
            // Even in case of error, keep the button disabled and do not revert to form view
            // Optionally, log the error or handle it differently if needed
        });
    }
}