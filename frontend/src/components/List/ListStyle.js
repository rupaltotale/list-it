import ButtonStyle from "../CustomComponents/Button/ButtonStyle";
import {
  getListColorsFromTheme,
  getPrimaryColorFromTheme,
  getDeleteButtonColorFromTheme,
  getElevationColorFromTheme,
  getHoveringAndFocusingColorFromTheme,
  getHoveringColorFromTheme,
  getFocusingColorFromTheme,
} from "../../Colors";

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
    this.dropdownTransitionTiming = 0.7;

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
        transition: `box-shadow 0.2s, background-color 0.4s, border-radius ${this.dropdownTransitionTiming}s`,
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
      display: "flex",
      justifyContent: "center",
      maxWidth: "100%",
      minWidth: "35px",
      margin: "6px 6px 0px 0px",
      position: "relative",
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
      boxSizing: "content-box",
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
        transition: `border-radius ${this.dropdownTransitionTiming}s`,
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

    /****************************** LIST DROPDOWN VARIABLES ******************************/

    /********** LIST DROPDOWN **********/
    this.listDropDownShow = (typeOfDropdown) => {
      switch (typeOfDropdown) {
        case "tags":
          var maxHeight = {
            maxHeight: 280,
          };
          break;
        default:
          var maxHeight = {
            maxHeight: 84,
          };
          break;
      }
      return {
        backgroundColor: this.defaultBackground,
        display: "flex",
        //Border Values
        ...this.setBorderValues({
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: this.primaryColor,
        }),
        borderTopWidth: "0px",
        borderBottomLeftRadius: "8px",
        borderBottomRightRadius: "8px",
        boxShadow:
          "0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149)",
        //Width, Height, Margin
        width: 289,
        marginRight: "15px",
        marginLeft: "15px",
        overflowY: "hidden",
        //Transition Properties
        ...maxHeight,
        visibility: "visible",
        opacity: 1,
        transition: `max-height ${this.dropdownTransitionTiming}s, 
                     visibility ${this.dropdownTransitionTiming}s, 
                     opacity ${this.dropdownTransitionTiming}s,  
                     border-right-width ${this.dropdownTransitionTiming}s,
                     border-left-width ${this.dropdownTransitionTiming}s,
                     border-bottom-width ${this.dropdownTransitionTiming}s`,
      };
    };
    this.listDropDownHide = (typeOfDropdown) => {
      return {
        ...this.listDropDownShow(),
        ...this.setBorderValues({
          borderWidth: "0px",
        }),
        maxHeight: 0,
        visibility: "hidden",
        opacity: 0,
      };
    };

    this.listDropDownContent = (typeOfDropdown = null) => {
      var defaultStyle = {
        //Display Attributes
        display: "flex",
        flexFlow: "row wrap",
        flexGrow: 1,
        alignContent: "flex-end",
        //Transition Attributes
        visibility: "visible",
        opacity: 1,
        transition: `visibility ${this.dropdownTransitionTiming}s, opacity ${this.dropdownTransitionTiming}s`,
        overflowY: "hidden",
      };
      switch (typeOfDropdown) {
        case "tags":
          var extraStyle = {};
          break;
        case "colors":
          var extraStyle = {
            justifyContent: "center",
          };
          break;
        case "delete":
          var extraStyle = {};
          break;
      }
      return { ...defaultStyle, ...extraStyle };
    };

    this.listDropDownContentHide = (typeOfDropdown) => {
      return {
        ...this.listDropDownContent(typeOfDropdown),
        opacity: 0,
        visibility: "hidden",
      };
    };

    /********** LIST COLOR DROPDOWN **********/

    this.listColorButton = (color, isActive = false) => {
      let colorRGB = this.colors[color];
      return {
        ...this.buttonStyle.buttonRound,
        backgroundColor: colorRGB.replace(")", ", 0.7)"),
        padding: isActive ? 7 : 12,
        margin: 7,
        boxShadow: "none",
        transition: "transform 0.1s, box-shadow 0.1s",
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

    /********** LIST DELETE DROPDOWN **********/
    this.listDeleteInfo = {
      alignSelf: "center",
      justifySelf: "center",
      color: this.primaryColor,
    };
    this.listDeleteButton = {
      placeSelf: "center",
      backgroundColor: getDeleteButtonColorFromTheme(this.theme),
      borderColor: this.primaryColor,
      borderRadius: 0,
      color: this.primaryColor,
      height: 40,
      marginBottom: "10px",
    };
    this.listArchiveButton = {
      ...this.listDeleteButton,
    };

    /********** LIST TAGS DROPDOWN **********/
    this.listTagSearchDiv = {
      padding: "0px 12px",
      position: "relative",
      width: "100%",
      backgroundColor: this.backgroundColor,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };
    this.listTagSearch = {
      height: "auto",
      width: "100%",
      padding: "2px 22px 2px 2px",
      boxSizing: "border-box",
      border: "none",
      backgroundColor: "transparent",
      color: this.primaryColor,
      outline: "none",
    };
    this.listTagSearchIcon = {
      position: "absolute",
      right: "11px",
    };
    this.listAllTags = (renderingCreateTagButton) => {
      if (renderingCreateTagButton) {
        var maxHeight = { maxHeight: "202px" };
      } else {
        var maxHeight = { maxHeight: "236px" };
      }
      return {
        ...maxHeight,
        padding: "6px 0",
        overflowY: "auto",
        width: "100%",
      };
    };
    this.listListedTag = (matchesSearch, hoveringTag, focusingTag) => {
      if (hoveringTag) {
        if (focusingTag) {
          var backgroundColor = {
            backgroundColor: getHoveringAndFocusingColorFromTheme(this.theme),
          };
        } else {
          var backgroundColor = {
            backgroundColor: getHoveringColorFromTheme(this.theme),
          };
        }
      } else if (focusingTag) {
        var backgroundColor = {
          backgroundColor: getFocusingColorFromTheme(this.theme),
        };
      } else {
        var backgroundColor = {
          backgroundColor: this.defaultBackground,
        };
      }
      return {
        ...backgroundColor,
        cursor: "pointer",
        display: matchesSearch ? "flex" : "none",
        alignItems: "center",
        outline: "none",
        padding: "5px 10px 3px",
        position: "relative",
      };
    };
    this.listTagCheckbox = {};
    this.listTagName = {
      display: "flex",
      textAlign: "center",
      marginLeft: "7px",
      maxWidth: "240px",
      paddingTop: "2px",
      verticalAlign: "top",
      overflowX: "hidden",
      wordBreak: "break-all",
    };
    this.listCreateTagButton = (shouldDisplay) => {
      return {
        display: shouldDisplay ? "flex" : "none",
        padding: "5px",
        alignItems: "center",
      };
    };
  }

  setBorderValues = (args) => {
    if (args.borderWidth) {
      var borderWidth = {
        borderTopWidth: borderWidth,
        borderBottomWidth: borderWidth,
        borderLeftWidth: borderWidth,
        borderRightWidth: borderWidth,
      };
    }
    if (args.borderStyle) {
      var borderStyle = {
        borderTopStyle: borderStyle,
        borderBottomStyle: borderStyle,
        borderLeftStyle: borderStyle,
        borderRightStyle: borderStyle,
      };
    }
    if (args.borderColor) {
      var borderColor = {
        borderTopColor: borderColor,
        borderBottomColor: borderColor,
        borderLeftColor: borderColor,
        borderRightColor: borderColor,
      };
    }
    return {
      ...borderWidth,
      ...borderStyle,
      ...borderColor,
    };
  };

  setBorderValues = (args) => {
    if (args.borderWidth) {
      var borderWidth = {
        borderTopWidth: args.borderWidth,
        borderBottomWidth: args.borderWidth,
        borderLeftWidth: args.borderWidth,
        borderRightWidth: args.borderWidth,
      };
    }
    if (args.borderStyle) {
      var borderStyle = {
        borderTopStyle: args.borderStyle,
        borderBottomStyle: args.borderStyle,
        borderLeftStyle: args.borderStyle,
        borderRightStyle: args.borderStyle,
      };
    }
    if (args.borderColor) {
      var borderColor = {
        borderTopColor: args.borderColor,
        borderBottomColor: args.borderColor,
        borderLeftColor: args.borderColor,
        borderRightColor: args.borderColor,
      };
    }
    return {
      ...borderWidth,
      ...borderStyle,
      ...borderColor,
    };
  };

  fadeInTransition = (time = 0.4) => {
    return {
      transition: `visibility ${time}s, opacity ${time}s `,
    };
  };

  fadeColorTransition = (time = 0.4) => {
    return {
      transition: `background-color ${time}s `,
    };
  };

  setNewTheme = (theme) => {
    return new ListStyle(this.listBackground, theme);
  };

  setNewBackgroundColor = (backgroundColor) => {
    return new ListStyle(backgroundColor, this.theme);
  };
}
