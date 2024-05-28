import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
import rentalPropertyReference from '@salesforce/schema/Rental_Property__c';
import NAME_FIELD from '@salesforce/schema/Rental_Property__c.Name';
import ADDRESS_FIELD from '@salesforce/schema/Rental_Property__c.Address__c';
import BEDROOMS_FIELD  from '@salesforce/schema/Rental_Property__c.Bedrooms__c';
import BATHROOMS_FIELD  from '@salesforce/schema/Rental_Property__c.Bathrooms__c';
import GARAGE_FIELD  from '@salesforce/schema/Rental_Property__c.Garage__c';
import SQUARE_FOOTAGE_FIELD  from '@salesforce/schema/Rental_Property__c.Square_Footage__c';
import PETS_ALLOWED_FIELD  from '@salesforce/schema/Rental_Property__c.Pets_Allowed__c';
import MONTHLY_RENT_FIELD  from '@salesforce/schema/Rental_Property__c.Monthly_Rent__c';
import DESCRIPTION_FIELD  from '@salesforce/schema/Rental_Property__c.Description__c';
import getImgs from '@salesforce/apex/PropertyDetailController.getRecordAttachments';

export default class ResidencePage extends NavigationMixin(LightningElement) {

    @track
    currentPageReference;

    @wire(CurrentPageReference)
    setCurrentPageReference(currentPageReference) {
        this.currentPageReference = currentPageReference;
    }
 
    recordId;
    imgUrlList;
    scheduleTour;

    connectedCallback() {
        this.recordId = this.currentPageReference?.state?.c__recordId;
        this.imgUrlList = null;

        getImgs({propertyId : this.recordId})
        .then(response => {
            console.log(response);
            this.imgUrlList = response;
        })
        .catch(e => {
            console.log(e);
        })
    }

    objectApiName = rentalPropertyReference;
    name = NAME_FIELD;
    address = ADDRESS_FIELD;
    bedrooms = BEDROOMS_FIELD;
    bathrooms = BATHROOMS_FIELD;
    garage = GARAGE_FIELD;
    squareFootage = SQUARE_FOOTAGE_FIELD;
    petsAllowed = PETS_ALLOWED_FIELD;
    monthlyRent = MONTHLY_RENT_FIELD;
    description = DESCRIPTION_FIELD;

    handleScheduleTour(event){
        this.scheduleTour = true;
    }

}