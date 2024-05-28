import { LightningElement, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { createRecord } from "lightning/uiRecordApi";
import { reduceErrors } from "c/ldsUtils";
import isGuest from "@salesforce/user/isGuest";
import LEAD_OBJECT from "@salesforce/schema/Lead";
import LASTNAME_FIELD from "@salesforce/schema/Lead.LastName";
import FIRSTNAME_FIELD from "@salesforce/schema/Lead.FirstName";
import PHONE_FIELD from "@salesforce/schema/Lead.Phone";
import EMAIL_FIELD from "@salesforce/schema/Lead.Email";
import TOUR_INFORMATION_FIELD from "@salesforce/schema/Lead.Tour_Information__c";
import PROPERTY_TO_TOUR_FIELD from "@salesforce/schema/Lead.Property_to_Tour__c";

export default class LdsCreateRecord extends LightningElement {
  @track isConfirmationVisible = false;
  isGuest = isGuest;

  lastName = "";
  firstName = "";
  phone = "";
  email = "";
  tourInformation = "";
  propertyToTour = "";

  handleLastNameChange(event) {
    this.lastName = event.target.value;
  }

  handleFirstNameChange(event) {
    this.firstName = event.target.value;
  }

  handlePhoneChange(event) {
    this.phone = event.target.value;
  }

  handleEmailChange(event) {
    this.email = event.target.value;
  }

  handleTourInformationChange(event) {
    this.tourInformation = event.target.value;
  }

  handlePropertyToTourChange(event) {
    this.propertyToTour = event.target.value;
  }

  get showConfirmation() {
    return this.isConfirmationVisible && !this.isGuest;
  }

  async createLead() {
    const fields = {};
    fields[LASTNAME_FIELD.fieldApiName] = this.lastName;
    fields[FIRSTNAME_FIELD.fieldApiName] = this.firstName;
    fields[PHONE_FIELD.fieldApiName] = this.phone;
    fields[EMAIL_FIELD.fieldApiName] = this.email;
    fields[TOUR_INFORMATION_FIELD.fieldApiName] = this.tourInformation;
    fields[PROPERTY_TO_TOUR_FIELD.fieldApiName] = this.propertyToTour;

    const recordInput = { apiName: LEAD_OBJECT.objectApiName, fields };
    try {
      const lead = await createRecord(recordInput);
      this.dispatchEvent(
        new ShowToastEvent({
          title: "Success",
          message: "Tour created",
          variant: "success"
        })
      );
    } catch (error) {
      this.dispatchEvent(
        new ShowToastEvent({
          title: "Error creating record",
          message: reduceErrors(error).join(", "),
          variant: "error"
        })
      );
    }
  }
}