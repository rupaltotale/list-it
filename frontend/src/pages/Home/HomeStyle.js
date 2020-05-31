import ButtonStyle from "../../components/CustomComponents/Button/ButtonStyle";
import {
  getBackgroundColorFromTheme,
  getPrimaryColorFromTheme,
} from "../../Colors";

export default class HomeStyle {
  constructor(theme) {
    this.theme = theme;
    this.buttonStyle = new ButtonStyle();
    this.backgroundColor = getBackgroundColorFromTheme(this.theme);
    this.primaryColor = getPrimaryColorFromTheme(this.theme);
    this.home = {
      display: "flex",
      flexDirection: "column",
      placeContent: "flex-start center",
    };
    this.homeHeading = {
      display: "flex",
      flexDirection: "column",
      placeContent: "stretch center",
      alignItems: "center",
    };
    this.homeTitle = {
      textAlign: "center",
    };
    this.homeRow = {
      display: "flex",
      flexFlow: "row wrap",
      placeContent: "flex-start center",
      alignItems: "flex-start",
    };
    this.homeCol = {
      display: "flex",
      flexDirection: "column",
      placeContent: "flex-start center",
      alignItems: "flex-start",
    };
    this.homeAdd = {
      ...this.buttonStyle.buttonAdd,
      backgroundColor: "transparent",
      color: "inherit",
      borderColor: "inherit",
    };
    this.homeAddHover = {
      ...this.homeAddHover,
      color: this.backgroundColor,
      backgroundColor: this.primaryColor,
    };
    this.homeAddIcon = this.buttonStyle.buttonAddIcon;
  }
}
