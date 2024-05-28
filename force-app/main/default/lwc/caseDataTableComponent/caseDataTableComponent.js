import { LightningElement, wire, track } from "lwc";
import getCasesForLoggedInContact from "@salesforce/apex/CaseController.getCasesForLoggedInContact";

const COLUMNS = [
  { label: "Case Number", fieldName: "CaseNumber" },
  { label: "Contact Name", fieldName: "ContactName", type: "text" },
  { label: "Subject", fieldName: "Subject" },
  { label: "Status", fieldName: "Status" }
];

export default class CaseDataTableComponent extends LightningElement {
  @track data;
  @track columns = COLUMNS;

  @wire(getCasesForLoggedInContact)
  wiredCases({ error, data }) {
    if (data) {
      // Transforming data to include Contact Name as a separate field
      this.data = data.map((caseRecord) => {
        return {
          ...caseRecord,
          ContactName: caseRecord.Contact ? caseRecord.Contact.Name : "N/A"
        };
      });
    } else if (error) {
      // Handle error
      console.error(error);
    }
  }
}