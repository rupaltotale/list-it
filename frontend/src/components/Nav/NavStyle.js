import {
  getBackgroundColorFromTheme,
  getPrimaryColorFromTheme,
} from "../../Colors";

export default class NavStyle {
  constructor(theme) {
    this.theme = theme;
    this.primaryColor = getPrimaryColorFromTheme(this.theme);
    this.backgroundColor = getBackgroundColorFromTheme(this.theme);
    this.navbar = {
      color: "inherit",
      backgroundColor: "inherit",
    };
    this.navBrand = {
      color: "inherit",
    };
    this.leftNavbar = {
      backgroundColor: "inherit",
      color: "inherit",
      marginRight: "auto",
    };
    this.navLink = {
      backgroundColor: "inherit",
      color: "inherit",
    };
    this.navDropdown = {
      color: "inherit",
      backgroundColor: "inherit",
    };
    this.navDropdownMenu = {
      color: "inherit",
      backgroundColor: "inherit",
    };
    this.navDropdownLink = {
      color: "inherit",
      textDecoration: "none",
    };
    this.navDropdownLogout = {
      ...this.navDropdownItem,
      backgroundColor: "inherit",
      color: "red",
      fontWeight: "bold",
    };
    this.navDropdownItem = {
      color: "inherit",
      backgroundColor: "inherit",
      display: "flex",
      alignItems: "center",
    };
    this.navDropdownIcon = {
      color: "inherit",
      marginRight: "5px",
    };
  }
}
