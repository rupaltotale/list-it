import ButtonStyle from "../CustomComponents/Button/ButtonStyle";
import { getListColorsFromTheme, getPrimaryColorFromTheme } from "../../Colors";

export default class ListStyle {
  constructor(backgroundColor, theme) {
    /****************************** GLOBAL VARIABLES ******************************/

    this.theme = theme;
    this.colors = getListColorsFromTheme(theme);
    this.primaryColor = getPrimaryColorFromTheme(theme);
    this.defaultBackground = this.colors.Default;
    this.listBackground = backgroundColor
      ? this.colors[backgroundColor]
      : this.defaultBackground;
    this.buttonStyle = new ButtonStyle();

    this.listIconButton = {
      ...this.buttonStyle.buttonNoBorder,
      ...this.buttonStyle.buttonRound,
      ...this.buttonStyle.buttonOpaque,
      color: "inherit",
    };
    this.listIconButtonHover = this.buttonStyle.buttonOpaqueHover;

    /****************************** LIST AND LIST CARD VARIABLES ******************************/

    this.list = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    };
    this.listCard = (isRenderingColorDropDown = false) => {
      if (isRenderingColorDropDown) {
        var borderRadius = {
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          borderBottomLeftRadius: "0px",
          borderBottomRightRadius: "0px",
        };
      } else {
        var borderRadius = {
          borderRadius: "8px",
        };
      }
      return {
        ...borderRadius,
        margin: "15px 15px 0px 15px",
        width: "289px",
        color: this.primaryColor,
        backgroundColor: this.listBackground,
        borderColor: this.primaryColor,
        transition:
          "box-shadow 0.2s, background-color 0.4s, border-radius 0.3s ease-in-out",
      };
    };
    this.listCardHover = (isRenderingColorDropDown = false) => {
      return {
        ...this.listCard(isRenderingColorDropDown),
        boxShadow:
          "0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149)",
      };
    };

    /****************************** LIST HEADER VARIABLES ******************************/

    /********** SELECT ICON **********/

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
      color: this.listBackground,
    };

    /********** LIST HEADER AND LIST TITLE **********/

    this.listHeader = {
      backgroundColor: "inherit",
      color: "inherit",
      borderColor: this.primaryColor,
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
    };
    this.listTitle = {
      resize: "none",
      border: "none",
      fontWeight: "bold",
      fontSize: "large",
      textAlign: "center",
      boxShadow: "none",
      backgroundColor: "inherit",
      color: "inherit",
    };
    this.listTitleFocus = {
      textShadow: "1px 1px 2px lightGray",
      boxShadow: "none",
    };

    /****************************** LIST BODY VARIABLES ******************************/

    /********** LIST ITEM ADD BUTTON **********/
    this.listAddButton = {
      ...this.buttonStyle.buttonAdd,
      backgroundColor: "transparent",
      color: "inherit",
      borderColor: "inherit",
    };
    this.listAddButtonHover = {
      ...this.listAddButton,
      backgroundColor: this.primaryColor,
      color: this.listBackground,
    };
    this.listAddIcon = this.buttonStyle.buttonAddIcon;

    /********** LIST ITEM GROUP **********/
    this.listGroup = {
      backgroundColor: "inherit",
      color: "inherit",
    };
    this.listItem = {
      display: "flex",
      placeContent: "center",
      alignItems: "center",
      paddingLeft: "0px",
      paddingRight: "0px",
      border: "none",
      backgroundColor: "inherit",
      color: "inherit",
    };
    this.listItemContent = {
      resize: "none",
      backgroundColor: "inherit",
      color: "inherit",
      borderColor: this.primaryColor,
    };
    this.listItemContentCompleted = {
      textDecorationLine: "line-through",
    };
    this.listCompletedItemsAlert = {
      borderRadius: "0px",
      marginTop: "0px",
      marginBottom: "0px",
      paddingBottom: "10px",
      fontWeight: "bold",
    };

    /********** LIST ITEM BUTTONS **********/
    this.listItemButtonDiv = {
      ...this.buttonStyle.buttonDiv,
      marginLeft: "0.25rem",
      marginRight: "0.25rem",
      boxShadow: "none",
      color: "inherit",
    };
    this.listItemButton = { ...this.listIconButton };
    this.listItemButtonHover = { ...this.listIconButtonHover };

    /****************************** LIST FOOTER VARIABLES ******************************/

    /********** LIST FOOTER **********/
    this.listFooter = (isRenderingColorDropDown) => {
      if (isRenderingColorDropDown) {
        var borderRadius = {
          borderRadius: "0px",
        };
      } else {
        var borderRadius = {
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
        };
      }
      return {
        ...borderRadius,
        transition: "border-radius 0.3s ease-in-out",
        backgroundColor: "inherit",
        borderTop: "none",
        display: "flex",
        flexDirection: "column",
        paddingTop: 0,
        paddingBottom: 0,
      };
    };
    this.listFooterButtonRow = {
      display: "flex",
      placeContent: "center space-around",
      alignItems: "center",
      height: "40px",
    };

    /********** LIST FOOTER BUTTONS **********/
    this.listFooterButtonDivHide = {
      ...this.buttonStyle.buttonDiv,
      ...this.fadeInTransition(),
      visibility: "hidden",
      opacity: "0",
    };
    this.listFooterButtonDivShow = {
      ...this.fadeInTransition(),
      ...this.listFooterButtonDivHide,
      visibility: "visible",
      opacity: "1",
    };
    this.listFooterButton = {
      ...this.listIconButton,
      marginBottom: "8px",
    };

    this.listFooterButtonHover = {
      ...this.listFooterButton,
      ...this.listIconButtonHover,
    };

    /****************************** LIST COLOR VARIABLES ******************************/

    /********** LIST COLOR DROPDOWN **********/
    this.listColorDropDownHide = (isRenderingColorDropDown) => {
      if (isRenderingColorDropDown) {
        var boxShadow = {
          boxShadow:
            "0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149)",
        };
      } else {
        var boxShadow = {};
      }
      return {
        ...boxShadow,
        transition:
          "max-height 0.6s, visibility 1s, opacity 1s, box-shadow 0.2s ease-in-out",
        visibility: "hidden",
        opacity: 0.3,
        maxHeight: 0,
        maxWidth: 289,
        marginRight: "15px",
        marginLeft: "15px",
        overflowY: "hidden",
        borderTop: "none",
        border: "1px solid rgba(0,0,0,.125)",
        borderBottomLeftRadius: "8px",
        borderBottomRightRadius: "8px",
        backgroundColor: this.defaultBackground,
        borderColor: this.primaryColor,
      };
    };
    this.listColorDropDownShow = (isRenderingColorDropDown) => {
      return {
        ...this.listColorDropDownHide(isRenderingColorDropDown),
        maxHeight: 90,
        visibility: "visible",
        opacity: 1,
      };
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

    /********** LIST COLOR DROPDOWN BUTTONS **********/
    this.listColorButton = (color, isActive = false) => {
      let colorRGB = this.colors[color];
      return {
        ...this.buttonStyle.buttonRound,
        backgroundColor: colorRGB.replace(")", ", 0.7)"),
        padding: isActive ? 7 : 12,
        margin: 7,
        boxShadow: "none",
        transition: "transform 0.1s, box-shadow 0.1s ease-in-out",
        borderWidth: "2px",
        borderColor: isActive
          ? this.primaryColor
          : color === "Default"
          ? "gray"
          : colorRGB,
      };
    };
    this.listColorButtonHover = (color, isActive = false) => {
      let colorRGB = this.colors[color];
      let nonHoverStyle = this.listColorButton(color, isActive);
      return {
        ...nonHoverStyle,
        transform: "scale(1.2)",
        boxShadow: `${colorRGB} 0px 0px 5px `,
      };
    };
    this.listColorButtonCheck = {
      color: this.primaryColor,
    };
  }

  fadeInTransition = (time = 0.4) => {
    return {
      transition: `visibility ${time}s, opacity ${time}s ease-in-out`,
    };
  };

  fadeColorTransition = (time = 0.4) => {
    return {
      transition: `background-color ${time}s ease-in-out`,
    };
  };

  setNewTheme = (theme) => {
    return new ListStyle(this.listBackground, theme);
  };

  setNewBackgroundColor = (backgroundColor) => {
    return new ListStyle(backgroundColor, this.theme);
  };
}
