import { LightningElement, track } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import isGuest from "@salesforce/user/isGuest";
import logo from "@salesforce/resourceUrl/logo";

export default class Navigation extends NavigationMixin(LightningElement) {
  @track isGuest = isGuest;
  @track isLoggedIn = !isGuest;

  logoUrl = logo;

  navigateToHome(event) {
    event.preventDefault();
    window.location.href = "/bytepropertymanagement";
  }

  navigateToSignUp(event) {
    event.preventDefault();
    window.location.href = "/bytepropertymanagement/SelfRegister";
  }

  navigateToLogin(event) {
    event.preventDefault();
    window.location.href = "/bytepropertymanagement/login";
  }

  handleLogout(event) {
    event.preventDefault();
    window.location.href = "/secur/logout.jsp";
  }
}