public with sharing class AddFamilyController {
    @AuraEnabled
    public static void addFamilyRequest(String firstName, String lastName, String emailId, String phoneVal){
        System.debug('Received parameters:');
        System.debug('First Name: ' + firstName);
        if (Schema.sObjectType.Contact.isCreateable() && Schema.sObjectType.Contact.isUpdateable()) {
            System.debug('Received parameters:');
            System.debug('First Name: ' + firstName);
            System.debug('Last Name: ' + lastName);
            System.debug('Email: ' + emailId);
            System.debug('Phone: ' + phoneVal);

            Contact newContact = new Contact(
                firstName = firstName,
                lastName = lastName,
                email = emailId,
                Phone = phoneVal
            );
            insert newContact;
        } else {
            System.debug('Current user does not have necessary CRUD permissions on Contact object.');
        }
    }
}
