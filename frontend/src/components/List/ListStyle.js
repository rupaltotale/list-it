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
    this.dropdownTransitionTiming = "0.7s";

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
    this.listCard = (isRenderingDropDown = false) => {
      if (isRenderingDropDown) {
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
        transition: `box-shadow 0.2s, background-color 0.4s, border-radius ${this.dropdownTransitionTiming} ease-in-out`,
      };
    };
    this.listCardHover = (isRenderingDropDown = false) => {
      return {
        ...this.listCard(isRenderingDropDown),
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

    /********** LIST TAGS **********/
    this.listTags = {
      display: "flex",
      placeContent: "center flex-start",
      padding: "5px 10px",
      flexWrap: "wrap",
    };
    this.listTag = {
      maxWidth: "100%",
      margin: "6px 6px 0px 0px",
      position: "relative",
      display: "flex",
      padding: "3px 5px",
      cursor: "pointer",
      backgroundColor: "transparent",
      boxShadow: "inset 0 0 0 1px rgba(154,160,166,0.541)",
      borderRadius: "18px",
    };

    this.listTagHover = {
      ...this.listTag,
      justifyContent: "flex-start",
      justifyItems: "flex-start",
    };

    this.listTagLabel = {
      cursor: "inherit",
      margin: 0,
      border: "1px solid transparent",
      color: this.primaryColor,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      fontSize: "13px",
      padding: "1px",
      textAlign: "center",
    };

    this.listTagLabelHover = {
      ...this.listTagLabel,
      textAlign: "center",
      width: "calc(100% - 16px)",
    };

    this.listTagRemoveButton = {
      ...this.listIconButton,
      display: "none",
      padding: 0,
      flex: "0 0 auto",
      position: "absolute",
      right: "2px",
      top: "50%",
      transform: "translateY(-50%)",
      backgroundColor: "transparent",
      color: this.primaryColor,
    };

    this.listTagRemoveButtonHover = {
      ...this.listTagRemoveButtonShow,
      ...this.listIconButtonHover,
    };

    this.listTagRemoveButtonShow = {
      ...this.listTagRemoveButton,
      display: "flex",
    };

    this.listTagRemoveIcon = {
      color: this.primaryColor,
    };

    /****************************** LIST FOOTER VARIABLES ******************************/

    /********** LIST FOOTER **********/
    this.listFooter = (isRenderingDropDown) => {
      if (isRenderingDropDown) {
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
        transition: `border-radius ${this.dropdownTransitionTiming} ease-in-out`,
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
      margin: "auto",
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

    /****************************** LIST DROPDOWN VARIABLES ******************************/

    /********** LIST DROPDOWN **********/
    this.listDropDownHide = () => {
      return {
        visibility: "hidden",
        boxShadow:
          "0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149)",
        maxWidth: 289,
        marginRight: "15px",
        marginLeft: "15px",
        overflowY: "hidden",
        backgroundColor: this.defaultBackground,
        borderBottomLeftRadius: "8px",
        borderBottomRightRadius: "8px",
      };
    };
    this.listDropDownShow = () => {
      return {
        ...this.listDropDownHide(),
        visibility: "visible",
      };
    };

    this.listDropDownTemplate = {
      display: "flex",
      overflowY: "hidden",
      alignSelf: "stretch",
      flexFlow: "row wrap",
      alignContent: "flex-start",
      placeContent: "flex-start center",
      maxHeight: 90,
      visibility: "visible",
      opacity: 1,
      border: `1px solid ${this.primaryColor}`,
      borderBottomLeftRadius: "8px",
      borderBottomRightRadius: "8px",
      transition: `max-height ${this.dropdownTransitionTiming}, visibility ${this.dropdownTransitionTiming}, opacity ${this.dropdownTransitionTiming}`,
    };
    this.listDropDownTemplateHide = {
      ...this.listDropDownTemplate,
      maxHeight: 0,
      opacity: 0,
      visibility: "hidden",
    };

    /********** LIST COLOR DROPDOWN **********/
    this.listColorsShow = {
      ...this.listDropDownTemplate,
    };
    this.listColorsHide = {
      ...this.listDropDownTemplateHide,
    };

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
