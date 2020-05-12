import button from "../../components/CustomComponents/Button/ButtonStyle";
let home;
export default home = {
  home: {
    display: "flex",
    flexDirection: "column",
    placeContent: "flex-start center",
  },
  homeHeading: {
    display: "flex",
    flexDirection: "column",
    placeContent: "stretch center",
    alignItems: "center",
  },
  homeTitle: {
    textAlign: "center",
  },
  homeRow: {
    display: "flex",
    flexFlow: "row wrap",
    placeContent: "flex-start center",
    alignItems: "flex-start",
  },
  homeCol: {
    display: "flex",
    flexDirection: "column",
    placeContent: "flex-start center",
    alignItems: "flex-start",
  },
  homeAdd: button.buttonAdd,
  homeAddIcon: button.buttonAddIcon,
};
