export default class ButtonStyle {
  constructor() {
    this.buttonDiv = {
      display: "flex",
      justifyContent: "center",
      visibility: "visible",
      opacity: "1",
    };
    this.buttonRound = {
      borderRadius: "50%",
      padding: "6px",
    };
    this.buttonNoBorder = {
      borderColor: "transparent",
      boxShadow: "none",
    };
    this.buttonOpaque = {
      opacity: "0.7",
    };
    this.buttonOpaqueHover = {
      opacity: "1",
    };
    this.buttonAdd = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "6px",
    };
    this.buttonAddIcon = {
      margin: "2px",
    };
  }
}
