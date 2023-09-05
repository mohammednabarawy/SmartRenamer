document.addEventListener("DOMContentLoaded", function () {
  var saveBtn = document.getElementById("saveBtn");

  saveBtn.addEventListener("click", function () {
    var siteUrl = document.getElementById("siteUrl").value;
    var extraText = document.getElementById("extraText").value;

    chrome.storage.sync.set(
      { siteUrl: siteUrl, extraText: extraText },
      function () {
        alert("Options saved successfully!");
      }
    );
  });

  chrome.storage.sync.get(["siteUrl", "extraText"], function (result) {
    document.getElementById("siteUrl").value = result.siteUrl || "";
    document.getElementById("extraText").value = result.extraText || "";
  });
});
