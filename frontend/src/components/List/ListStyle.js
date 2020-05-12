import globalStyle from "../../globalStylesheet";
import button from "../CustomComponents/Button/ButtonStyle";
let list;
export default list = {
  listCard: {
    margin: "15px",
    width: "289px",
    backgroundColor: globalStyle.backgroundColor,
  },
  listSelectHide: {
    ...button.buttonRound,
    display: "flex",
    visibility: "hidden",
    opacity: "0",
    backgroundColor: globalStyle.primaryColor,
    position: "absolute",
    left: "-10px",
    top: "-10px",
    transition: "visibility 0.3s, opacity 0.3s ease-in-out",
  },
  listSelectShow: {
    visibility: "visible",
    opacity: "1",
  },
  listSelectIcon: {
    color: globalStyle.backgroundColor,
  },
  listHeader: {
    backgroundColor: globalStyle.backgroundColor,
  },
  listTitle: {
    resize: "none",
    border: "none",
    fontWeight: "bold",
    fontSize: "large",
    textAlign: "center",
    boxShadow: "none",
  },
  listTitleHover: {
    textShadow: "1px 1px 2px lightGray",
    boxShadow: "none",
  },
  listAddButton: button.buttonAdd,
  listAddIcon: button.buttonAddIcon,
  listItem: {
    display: "flex",
    placeContent: "center",
    alignItems: "center",
    paddingLeft: "0px",
    paddingRight: "0px",
    border: "none",
  },
  listItemContent: {
    resize: "none",
  },
  listItemContentCompleted: {
    textDecorationLine: "line-through",
  },
  listItemButtonDiv: {
    ...button.buttonDiv,
    ...{ marginLeft: "0.25rem", marginRight: "0.25rem", boxShadow: "none" },
  },
  listCompletedItemsAlert: {
    borderRadius: "0px",
    marginTop: "0px",
    marginBottom: "0px",
    paddingBottom: "10px",
    fontWeight: "bold",
  },
  listFooter: {
    backgroundColor: globalStyle.backgroundColor,
    borderTop: "none",
    display: "flex",
    placeContent: "center space-around",
    alignItems: "center",
    height: "40px",
  },
  listFooterButtonDivHide: {
    ...button.buttonDiv,
    ...{
      visibility: "hidden",
      opacity: "0",
      transition: "visibility 0.3s, opacity 0.3s ease-in-out",
    },
  },
  listFooterButtonDivShow: {
    visibility: "visible",
    opacity: "1",
  },
  listIconButton: {
    ...button.buttonNoBorder,
    ...button.buttonRound,
    ...button.buttonOpaque,
  },
  listIconButtonHover: button.buttonOpaqueHover,
};
