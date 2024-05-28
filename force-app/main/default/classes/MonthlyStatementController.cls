public without sharing class MonthlyStatementController {
  @AuraEnabled(cacheable=true)
  public static List<Monthly_Statement__c> getMonthlyStatementsForLoggedInContact() {
    Id contactId = [SELECT ContactId FROM User WHERE Id = :UserInfo.getUserId()].ContactId;
    System.debug('Contact ID: ' + contactId);
    
    if (contactId == null) {
      System.debug('No Contact ID found for the current user.');
      return new List<Monthly_Statement__c>();
    }
    
    List<Monthly_Statement__c> statements = [
      SELECT Id, Name, Rental_Property__c, Rental_Property__r.Name, Amount_Charged__c
      FROM Monthly_Statement__c
      WHERE Contact__c = :contactId
      LIMIT 10
    ];
    
    System.debug('Retrieved Statements: ' + statements);
    return statements;
  }
}
