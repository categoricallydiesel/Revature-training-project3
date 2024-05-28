public with sharing class CaseController {
  @AuraEnabled(cacheable=true)
  public static List<Case> getCasesForLoggedInContact() {
    // Get the current user's contact ID
    Id contactId = [SELECT ContactId FROM User WHERE Id = :UserInfo.getUserId()]
    .ContactId;
    if (contactId == null) {
      return new List<Case>();
    }
    // Query cases for the current user's contact
    return [
      SELECT Id, CaseNumber, Subject, Status, Contact.Name
      FROM Case
      WHERE ContactId = :contactId
      LIMIT 10
    ];
  }
}