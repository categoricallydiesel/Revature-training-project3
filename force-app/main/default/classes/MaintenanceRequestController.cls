public without sharing class MaintenanceRequestController {
    public class RentalPropertyInfo {
        @AuraEnabled
        public Id rentalPropertyId;
        @AuraEnabled
        public String rentalPropertyName;
    }

    @AuraEnabled(cacheable=true)
    public static RentalPropertyInfo getRentalProperty(Id contactId) {
        try {
            Contact contact = [
                SELECT Rental_Property__c, Rental_Property__r.Name
                FROM Contact 
                WHERE Id = :contactId 
                LIMIT 1
            ];
            System.debug('Rental Property ID: ' + contact.Rental_Property__c);
            System.debug('Rental Property Name: ' + contact.Rental_Property__r.Name);
            
            if (contact.Rental_Property__c == null) {
                throw new AuraHandledException('Rental Property not found for the provided Contact ID.');
            }

            RentalPropertyInfo rentalPropertyInfo = new RentalPropertyInfo();
            rentalPropertyInfo.rentalPropertyId = contact.Rental_Property__c;
            rentalPropertyInfo.rentalPropertyName = contact.Rental_Property__r.Name;

            return rentalPropertyInfo;
        } catch (Exception e) {
            System.debug('Error retrieving rental property: ' + e.getMessage());
            throw new AuraHandledException('Error retrieving rental property: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static void submitMaintenanceRequest(String subject, String description, String priority, Id contactId, Id rentalPropertyId) {
        try {
            System.debug('Subject: ' + subject);
            System.debug('Description: ' + description);
            System.debug('Priority: ' + priority);
            System.debug('Contact ID: ' + contactId);
            System.debug('Rental Property ID: ' + rentalPropertyId);
            
            if (rentalPropertyId == null) {
                throw new AuraHandledException('Rental Property ID cannot be null');
            }

            Case maintenanceRequest = new Case(
                Subject = subject,
                Description = description,
                Priority = priority,
                ContactId = contactId,
                Rental_Property__c = rentalPropertyId
            );
          
            insert maintenanceRequest;
            System.debug('Maintenance request inserted successfully');
        } catch (Exception e) {
            System.debug('Error submitting maintenance request: ' + e.getMessage());
            throw new AuraHandledException('Error submitting maintenance request: ' + e.getMessage());
        }
    }
}

