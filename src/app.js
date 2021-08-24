// registering serviceWorker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/serviceworker.js", { scope: "." })
    .then((reg) => console.log("service worker registered", reg))
    .catch((err) => console.log("service worker not registered", err));
}
