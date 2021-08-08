import "./../scss/main.scss";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { data } from "browserslist";

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

  axios({
    url: document.querySelector("[data-url]").value,
    method: document.querySelector("[data-method]").value,
    params: keyValuePairToObjects(queryParamsContainer),
    headers: keyValuePairToObjects(requestHeadersContainer),
  })
    .catch((e) => e)
    .then((res) => {
      document
        .querySelector("[data-response-section]")
        .classList.remove("d-none");
      updateResponseDetails(res);
      //   updateResponseEditor(res.data)
      updateResponseHeaders(res.headers);
    });
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
}
//event listeners
