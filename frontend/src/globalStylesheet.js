export default class globalStylesheet {
  constructor(primaryColor = "black", backgroundColor = "#fff") {
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

  fadeColorTransition = (time = 0.4) => {
    return {
      transition: `background-color ${time}s ease-in-out`,
    };
  };

  setColors = (primaryColor = "black", backgroundColor = "#fff") => {
    this.primaryColor = primaryColor;
    this.backgroundColor = backgroundColor;
    return {
      color: this.primaryColor,
      backgroundColor: this.backgroundColor,
    };
  };
}
