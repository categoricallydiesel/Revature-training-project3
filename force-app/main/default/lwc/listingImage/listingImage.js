import { LightningElement, api } from 'lwc';
import getPropertyListingImg from "@salesforce/apex/PropertyListingsController.getPropertyListingImg";

export default class ListingImage extends LightningElement {

    @api propertyId;
    img;

    connectedCallback(){

        this.img = null;
        getPropertyListingImg({recordId : this.propertyId})
        .then(response => {
            console.log(response);
            this.img = response;
        })
        .catch(e => {
            console.log(e);
        })

    }

}