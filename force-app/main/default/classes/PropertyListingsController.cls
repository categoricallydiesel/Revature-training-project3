public without sharing class PropertyListingsController {
  public PropertyListingsController() {
  }

  @AuraEnabled(cacheable=true)
  public static List<Rental_Property__c> getUnoccupiedRentalProperties() {
    try {
      return [
        SELECT Name, Occupied__c, Address__c, Bathrooms__c, Bedrooms__c, Garage__c
        FROM Rental_Property__c
        WHERE Occupied__c = FALSE
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }


  @AuraEnabled(cacheable=true)
  public static ContentVersion getPropertyListingImg(String recordId){
    try {
      List<ContentDocumentLink> cdlList = [SELECT ContentDocument.LatestPublishedVersionId FROM ContentDocumentLink WHERE LinkedEntityId = :recordId];
      Set<String> cdlIdList = new Set<String>();
      for(ContentDocumentLink cdl : cdlList){
        cdlIdList.add(cdl.ContentDocument.LatestPublishedVersionId);
      }
      Set<String> fileTypes = new Set<String>{'jpg', 'gif', 'png'};
      return [SELECT VersionDataUrl FROM ContentVersion WHERE Id IN :cdlIdList AND FileType IN :fileTypes AND Property_Listing__c = true LIMIT 1];

    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}