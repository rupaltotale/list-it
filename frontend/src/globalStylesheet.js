import { getUser } from "./API";

export default class globalStylesheet {
  constructor(primaryColor = "black", backgroundColor = "#fff") {
    this.primaryColor = primaryColor;
    this.backgroundColor = backgroundColor;
  }

  static initialize() {
    return new Promise((resolve, reject) => {
      getUser(
        (response) => {
          resolve(response.data.theme);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}
