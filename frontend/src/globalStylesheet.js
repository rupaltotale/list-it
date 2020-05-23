// let globalStylesheet;
// export default globalStylesheet = {
//   primaryColor: "#212529",
//   backgroundColor: "#fff",
//   timeout: (duration, callback) => {
//     setTimeout(callback, duration);
//   },
//   fadeInTransition: (time = 0.4) => {
//     return {
//       transition: `visibility ${time}s, opacity ${time}s ease-in-out`,
//     };
//   },
//   body: (primaryColor, backgroundColor) => {
//     globalStylesheet.primaryColor = primaryColor;
//     globalStylesheet.backgroundColor = backgroundColor;
//     return globalStylesheet.app();
//   },
//   app: () => {
//     return {
//       color: globalStylesheet.primaryColor,
//       backgroundColor: globalStylesheet.backgroundColor,
//     };
//   },
// };

export default class globalStylesheet {
  constructor(primaryColor = "#212529", backgroundColor = "#fff") {
    this.primaryColor = primaryColor;
    this.backgroundColor = backgroundColor;
  }

  timeout = (duration, callback) => {
    setTimeout(callback, duration);
  };

  fadeInTransition = (time = 0.4) => {
    return {
      transition: `visibility ${time}s, opacity ${time}s ease-in-out`,
    };
  };

  setColors = (primaryColor = "#212529", backgroundColor = "#fff") => {
    this.primaryColor = primaryColor;
    this.backgroundColor = backgroundColor;
    return {
      color: this.primaryColor,
      backgroundColor: this.backgroundColor,
    };
  };
}
