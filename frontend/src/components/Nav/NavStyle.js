export default class NavStyle {
  constructor() {
    this.navDropdownLink = {
      color: "black",
      textDecoration: "none",
    };
    this.navDropdownLogout = {
      ...this.navDropdownItem,
      color: "red",
      fontWeight: "bold",
    };
    this.navDropdownItem = {
      display: "flex",
      alignItems: "center",
    };
    this.navDropdownIcon = {
      marginRight: "5px",
    };
  }
}
