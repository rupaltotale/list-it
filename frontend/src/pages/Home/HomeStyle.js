import ButtonStyle from "../../components/CustomComponents/Button/ButtonStyle";
import globalStylesheet from "../../globalStylesheet";

export default class HomeStyle extends globalStylesheet {
  constructor() {
    super();
    this.buttonStyle = new ButtonStyle();
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
    this.homeAdd = this.buttonStyle.buttonAdd;
    this.homeAddIcon = this.buttonStyle.buttonAddIcon;
  }
}
