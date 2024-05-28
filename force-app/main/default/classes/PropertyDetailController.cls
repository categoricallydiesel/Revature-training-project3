public without sharing class PropertyDetailController {
    public PropertyDetailController() {

    }

    @AuraEnabled(cacheable=true)
    public static List<ContentVersion> getRecordAttachments(String propertyId){
        try {        
            List<ContentDocumentLink> cdlList = [SELECT Id, ContentDocument.LatestPublishedVersionId FROM ContentDocumentLink 
                                                 WHERE LinkedEntityId = :propertyId];
            Set<String> cdlIdList = new Set<String>();
            for(ContentDocumentLink cdl : cdlList) {
                cdlIdList.add(cdl.ContentDocument.LatestPublishedVersionId);
            }
            Set<String> fileTypes = new Set<String>{'jpg', 'png', 'gif'};
            return [SELECT Title, VersionDataUrl FROM ContentVersion WHERE Id IN :cdlIdList AND FileType IN :fileTypes];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}