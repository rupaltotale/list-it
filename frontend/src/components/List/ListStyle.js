import globalStylesheet from "../../globalStylesheet";
import ButtonStyle from "../CustomComponents/Button/ButtonStyle";

export default class ListStyle extends globalStylesheet {
  constructor() {
    super();
    this.buttonStyle = new ButtonStyle();
    this.listBackground = this.backgroundColor;
    this.list = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    };
    this.listCard = {
      margin: "15px 15px 0px 15px",
      width: "289px",
      backgroundColor: this.listBackground,
      borderRadius: "0",
    };
    this.listSelectHide = {
      ...this.buttonStyle.buttonRound,
      ...this.buttonStyle.buttonNoBorder,
      ...this.fadeInTransition(),
      display: "flex",
      visibility: "hidden",
      opacity: "0",
      backgroundColor: this.primaryColor,
      position: "absolute",
      left: "-10px",
      top: "-10px",
    };
    this.listSelectShow = {
      ...this.fadeInTransition(),
      ...this.listSelectHide,
      visibility: "visible",
      opacity: "1",
    };
    this.listSelectIcon = {
      color: this.backgroundColor,
    };
    this.listHeader = {
      backgroundColor: this.listBackground,
    };
    this.listTitle = {
      resize: "none",
      border: "none",
      fontWeight: "bold",
      fontSize: "large",
      textAlign: "center",
      boxShadow: "none",
    };
    this.listTitleFocus = {
      textShadow: "1px 1px 2px lightGray",
      boxShadow: "none",
    };
    this.listAddButton = this.buttonStyle.buttonAdd;
    this.listAddIcon = this.buttonStyle.buttonAddIcon;
    this.listItem = {
      display: "flex",
      placeContent: "center",
      alignItems: "center",
      paddingLeft: "0px",
      paddingRight: "0px",
      border: "none",
    };
    this.listItemContent = {
      resize: "none",
    };
    this.listItemContentCompleted = {
      textDecorationLine: "line-through",
    };
    this.listItemButtonDiv = {
      ...this.buttonStyle.buttonDiv,
      marginLeft: "0.25rem",
      marginRight: "0.25rem",
      boxShadow: "none",
    };
    this.listCompletedItemsAlert = {
      borderRadius: "0px",
      marginTop: "0px",
      marginBottom: "0px",
      paddingBottom: "10px",
      fontWeight: "bold",
    };
    this.listFooter = {
      backgroundColor: this.listBackground,
      borderTop: "none",
      display: "flex",
      flexDirection: "column",
      paddingTop: 0,
      paddingBottom: 0,
    };
    this.listFooterButtonRow = {
      display: "flex",
      placeContent: "center space-around",
      alignItems: "center",
      height: "40px",
    };
    this.listFooterButtonDivHide = {
      ...this.buttonStyle.buttonDiv,
      ...this.fadeInTransition(),
      visibility: "hidden",
      opacity: "0",
    };
    this.listFooterButtonDivShow = {
      ...this.fadeInTransition(),
      ...this.listFooterButtonDivShow,
      visibility: "visible",
      opacity: "1",
    };
    this.listIconButton = {
      ...this.buttonStyle.buttonNoBorder,
      ...this.buttonStyle.buttonRound,
      ...this.buttonStyle.buttonOpaque,
    };
    this.listIconButtonHover = this.buttonStyle.buttonOpaqueHover;
    this.listColorDropDownHide = {
      transition: "max-height 1.3s, visibility 1s, opacity 1s ease-in-out",
      visibility: "hidden",
      opacity: 0.3,
      maxHeight: 0,
      maxWidth: 289,
      marginRight: "15px",
      marginLeft: "15px",
      overflowY: "hidden",
      borderTop: "none",
      border: "1px solid rgba(0,0,0,.125)",
    };
    this.listColorDropDownShow = {
      ...this.listColorDropDownHide,
      maxHeight: 200,
      visibility: "visible",
      opacity: 1,
    };
    this.listColors = {
      display: "flex",
      alignSelf: "stretch",
      flexDirection: "row",
      flexWrap: "wrap",
      alignContent: "flex-start",
      alignItems: "flex-start",
      justifyContent: "center",
    };
    this.listColorButton = (color, IsDefault = false, isActive = false) => {
      return {
        ...this.buttonStyle.buttonRound,
        backgroundColor: color,
        padding: isActive ? 7 : 12,
        margin: 7,
        boxShadow: "none",
        transition: "transform 0.1s, box-shadow 0.1s ease-in-out",
        borderWidth: "2px",
        borderColor: isActive ? "black" : IsDefault ? "gray" : color,
      };
    };
    this.listColorButtonHover = (
      color,
      IsDefault = false,
      isActive = false
    ) => {
      let style = this.listColorButton(color, IsDefault, isActive);
      return {
        ...style,
        transform: "scale(1.2)",
        boxShadow: `${color} 0px 0px 5px `,
      };
    };
  }

  setNewBackgroundColor = (backgroundColor) => {
    this.listBackground = backgroundColor;
    this.listCard = {
      ...this.listCard,
      backgroundColor: backgroundColor,
    };
    this.listHeader = {
      ...this.listHeader,
      backgroundColor: backgroundColor,
    };
    this.listFooter = {
      ...this.listFooter,
      backgroundColor: backgroundColor,
    };
  };
}
