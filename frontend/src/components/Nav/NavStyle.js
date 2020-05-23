import globalStylesheet from "../../globalStylesheet";

export default class NavStyle extends globalStylesheet {
  constructor() {
    super();
    this.navDropdownLink = {
      color: "black",
      textDecoration: "none",
    };
    this.navDropdownLogout = {
      color: "red",
      fontWeight: "bold",
    };
    this.navDropdownMenu = {
      right: "0",
      left: "auto",
    };
  }
}
