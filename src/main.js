import "bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
import "./bootswatch.min.css";
import setupEditors from "./setupEditor";
import axios from "axios";
import prettyBytes from "pretty-bytes";

//selectors
const form = document.querySelector("[data-form]");
const queryParamsContainer = document.querySelector("[data-query-params]");
const requestHeadersContainer = document.querySelector(
  "[data-request-headers]"
);
const keyValueTemplate = document.querySelector("[data-key-value-template]");
const ResponseHeadersContainer = document.querySelector(
  "[data-response-headers]"
);

const { requestEditor, updateResponseEditor } = setupEditors();

//functions
queryParamsContainer.append(createKeyValuePair());
requestHeadersContainer.append(createKeyValuePair());

document
  .querySelector("[data-add-query-param-btn]")
  .addEventListener("click", () => {
    queryParamsContainer.append(createKeyValuePair());
  });

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let data;
  try {
    data = JSON.parse(requestEditor.state.doc.toString() || null);
  } catch (e) {
    alert("Incorrect JSON data");
    return;
  }

  axios({
    url: document.querySelector("[data-url]").value,
    method: document.querySelector("[data-method]").value,
    params: keyValuePairToObjects(queryParamsContainer),
    headers: keyValuePairToObjects(requestHeadersContainer),
    data,
  })
    .catch((e) => e)
    .then((res) => {
      document
        .querySelector("[data-response-section]")
        .classList.remove("d-none");
      updateResponseDetails(res);
      updateResponseEditor(res.data);
      updateResponseHeaders(res.headers);
    });
});

axios.interceptors.request.use((request) => {
  request.customData = request.customData || {};
  request.customData.startTime = new Date().getTime();
  return request;
});

function updateEndTime(response) {
  response.customData = response.customData || {};
  response.customData.time =
    new Date().getTime() - response.config.customData.startTime;
  return response;
}

axios.interceptors.response.use(updateEndTime, (e) => {
  return Promise.reject(updateEndTime(e.response));
});

function createKeyValuePair() {
  const element = keyValueTemplate.content.cloneNode(true);
  element.querySelector("[data-remove-btn]").addEventListener("click", (e) => {
    e.target.closest("[data-key-value-pair]").remove();
  });

  return element;
}

function keyValuePairToObjects(container) {
  const pairs = document.querySelectorAll("[data-key-value-pair]");
  return [...pairs].reduce((data, pair) => {
    const key = pair.querySelector("[data-key]").value;
    const value = pair.querySelector("[data-value]").value;
    if (key === "") return data;
    return { ...data, [key]: value };
  }, {});
}

function updateResponseHeaders(headers) {
  ResponseHeadersContainer.innerHTML = "";
  Object.entries(headers).forEach(([key, value]) => {
    const keyElement = document.createElement("div");
    keyElement.textContent = key;
    ResponseHeadersContainer.append(keyElement);
    const valueElement = document.createElement("div");
    valueElement.textContent = value;
    ResponseHeadersContainer.append(valueElement);
  });
}

function updateResponseDetails(response) {
  document.querySelector("[data-status]").textContent = response.status;
  document.querySelector("[data-time]").textContent = response.customData.time;
  document.querySelector("[data-size]").textContent = prettyBytes(
    JSON.stringify(response.data).length +
      JSON.stringify(response.headers).length
  );
}
//event listeners
