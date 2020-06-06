import axios from "axios";

// *********************************** POST API REQUESTS ***********************************

const BaseURL = "http://127.0.0.1:8000";

export function createNewList(
  responseFunc,
  rejectFunc,
  properties = { title: "" }
) {
  axios
    .post(`${BaseURL}/api/v1/lists/new`, properties, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      responseFunc ? responseFunc(response) : null;
    })
    .catch((error) => {
      rejectFunc ? rejectFunc(error) : null;
    });
}

export function createNewListItem(responseFunc, rejectFunc, properties) {
  axios
    .post(`${BaseURL}/api/v1/list_item/new`, properties, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      responseFunc ? responseFunc(response) : null;
    })
    .catch((error) => {
      rejectFunc ? rejectFunc(error) : null;
    });
}

export function postUser(responseFunc, rejectFunc, properties) {
  axios
    .post(properties.url, properties.data, {
      headers: { "Content-Type": "application/json" },
    })
    .then((response) => {
      responseFunc ? responseFunc(response) : null;
    })
    .catch((error) => {
      rejectFunc ? rejectFunc(error) : null;
    });
}

export function createNewTag(responseFunc, rejectFunc, properties) {
  axios
    .post(`${BaseURL}/api/v1/tags/new`, properties, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      responseFunc ? responseFunc(response) : null;
    })
    .catch((error) => {
      rejectFunc ? rejectFunc(error) : null;
    });
}

// *********************************** GET API REQUESTS ***********************************

export function getLists(responseFunc, rejectFunc) {
  axios
    .get(`${BaseURL}/api/v1/lists/`, {
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      responseFunc ? responseFunc(response) : null;
    })
    .catch((error) => {
      rejectFunc ? rejectFunc(error) : null;
    });
}

export function getList(responseFunc, rejectFunc, properties) {
  axios
    .get(`${BaseURL}/api/v1/lists/${properties.id}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      responseFunc ? responseFunc(response) : null;
    })
    .catch((error) => {
      console.log(error);
      rejectFunc ? rejectFunc(error) : null;
    });
}

export function getListItem(responseFunc, rejectFunc, properties) {
  axios
    .get(`${BaseURL}/api/v1/list_item/${properties.id}/`, {
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      responseFunc ? responseFunc(response) : null;
    })
    .catch((error) => {
      rejectFunc ? rejectFunc(error) : null;
    });
}

export function getUser(responseFunc, rejectFunc) {
  axios
    .get(`${BaseURL}/current_user/`, {
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      responseFunc ? responseFunc(response) : null;
    })
    .catch((error) => {
      rejectFunc ? rejectFunc(error) : null;
    });
}

// *********************************** PUT API REQUESTS ***********************************

export function updateList(responseFunc, rejectFunc, properties) {
  axios
    .put(`${BaseURL}/api/v1/lists/${properties.id}/`, properties, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      responseFunc ? responseFunc(response) : null;
    })
    .catch((error) => {
      rejectFunc ? rejectFunc(error) : null;
    });
}

export function updateListItem(responseFunc, rejectFunc, properties) {
  axios
    .put(
      `${BaseURL}/api/v1/list_item/${properties.id}/`,
      {
        content: properties.content,
        completed: properties.completed,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem("token")}`,
        },
      }
    )
    .then((response) => {
      responseFunc ? responseFunc(response) : null;
    })
    .catch((error) => {
      rejectFunc ? rejectFunc(error) : null;
    });
}

export function updateUser(responseFunc, rejectFunc, properties) {
  axios
    .put(`${BaseURL}/api/v1/user/${properties.id}/`, properties, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      responseFunc ? responseFunc(response) : null;
    })
    .catch((error) => {
      rejectFunc ? rejectFunc(error) : null;
    });
}

export function updateTag(responseFunc, rejectFunc, properties) {
  axios
    .put(`${BaseURL}/api/v1/tags/${properties.id}`, properties, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      responseFunc ? responseFunc(response) : null;
    })
    .catch((error) => {
      rejectFunc ? rejectFunc(error) : null;
    });
}

// *********************************** DELETE API REQUESTS ***********************************

export function deleteList(responseFunc, rejectFunc, properties) {
  axios
    .delete(`${BaseURL}/api/v1/lists/${properties.id}/`, {
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      responseFunc ? responseFunc(response) : null;
    })
    .catch((error) => {
      rejectFunc ? rejectFunc(error) : null;
    });
}

export function deleteListItem(responseFunc, rejectFunc, properties) {
  axios
    .delete(`${BaseURL}/api/v1/list_item/${properties.id}/`, {
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      responseFunc ? responseFunc(response) : null;
    })
    .catch((error) => {
      rejectFunc ? rejectFunc(error) : null;
    });
}

export function deleteTag(responseFunc, rejectFunc, properties) {
  axios
    .delete(`${BaseURL}/api/v1/tags/${properties.id}`, {
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      responseFunc ? responseFunc(response) : null;
    })
    .catch((error) => {
      rejectFunc ? rejectFunc(error) : null;
    });
}
