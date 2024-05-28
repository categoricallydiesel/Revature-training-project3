import { LightningElement, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import getUnoccupiedRentalProperties from "@salesforce/apex/PropertyListingsController.getUnoccupiedRentalProperties";

export default class Home extends NavigationMixin(LightningElement) {
  @wire(getUnoccupiedRentalProperties)
  properties;

  navToRentalPropertyPage(e) {
    // the name Residence_Viewer__c needs to correspond with
    // the api name of the page made in experience builder
    this[NavigationMixin.Navigate]({
      type: "comm__namedPage",
      attributes: {
        name: "RentalProperty__c"
      },
      state: {
        c__recordId: e.target.dataset.id
      }
    });
  }
}