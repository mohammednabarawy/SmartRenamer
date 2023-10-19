document.addEventListener("DOMContentLoaded", function () {
  var saveButton = document.getElementById("saveButton");

  // Load saved settings
  chrome.storage.sync.get(
    [
      "websiteName",
      "includeDate",
      "separator",
      "fileTypeImage",
      "fileTypeDocument",
      "fileTypeVideo",
    ],
    function (result) {
      // Update website name checkbox
      var websiteNameCheckbox = document.getElementById("websiteNameCheckbox");
      websiteNameCheckbox.checked = result.websiteName !== false;

      // Update date checkbox
      var dateCheckbox = document.getElementById("dateCheckbox");
      dateCheckbox.checked = result.includeDate !== false;

      // Update separator input
      var separatorInput = document.getElementById("separatorInput");
      separatorInput.value = result.separator || "-";

      // Update file type filters
      var fileTypeImageInput = document.getElementById("fileTypeImage");
      fileTypeImageInput.value = result.fileTypeImage || "";

      var fileTypeDocumentInput = document.getElementById("fileTypeDocument");
      fileTypeDocumentInput.value = result.fileTypeDocument || "";

      var fileTypeVideoInput = document.getElementById("fileTypeVideo");
      fileTypeVideoInput.value = result.fileTypeVideo || "";
    }
  );

  // Save settings, including file type filter rules
  saveButton.addEventListener("click", function () {
    // Get user-defined settings
    var websiteName = document.getElementById("websiteNameCheckbox").checked;
    var includeDate = document.getElementById("dateCheckbox").checked;
    var separator = document.getElementById("separatorInput").value;

    // Get user-defined file type filter rules
    var fileTypeImage = document.getElementById("fileTypeImage").value;
    var fileTypeDocument = document.getElementById("fileTypeDocument").value;
    var fileTypeVideo = document.getElementById("fileTypeVideo").value;

    // Save the settings and file type filter rules
    chrome.storage.sync.set(
      {
        websiteName: websiteName,
        includeDate: includeDate,
        separator: separator,
        fileTypeImage: fileTypeImage,
        fileTypeDocument: fileTypeDocument,
        fileTypeVideo: fileTypeVideo,
      },
      function () {
        // Display success message to the user
        var status = document.getElementById("status");

        // Check if the status element exists
        if (status) {
          // Update the status text if the element exists
          status.textContent = "Settings saved.";
        } else {
          // Log an error message if the element is not found
          console.error("Error: Could not find the status element.");
        }
        setTimeout(function () {
          status.textContent = "";
        }, 2000);
      }
    );
  });

  // Add input event listeners to update the filename preview
  document
    .getElementById("websiteNameCheckbox")
    .addEventListener("input", updatePreview);
  document
    .getElementById("dateCheckbox")
    .addEventListener("input", updatePreview);
  document
    .getElementById("separatorInput")
    .addEventListener("input", updatePreview);
  document
    .getElementById("fileTypeImage")
    .addEventListener("input", updatePreview);
  document
    .getElementById("fileTypeDocument")
    .addEventListener("input", updatePreview);
  document
    .getElementById("fileTypeVideo")
    .addEventListener("input", updatePreview);

  // Initial update of the filename preview
  updatePreview();
});

function updatePreview() {
  // Retrieve the user-defined settings
  var websiteName = document.getElementById("websiteNameCheckbox").checked;
  var includeDate = document.getElementById("dateCheckbox").checked;
  var separator = document.getElementById("separatorInput").value;
  var fileTypeImage = document.getElementById("fileTypeImage").value;
  var fileTypeDocument = document.getElementById("fileTypeDocument").value;
  var fileTypeVideo = document.getElementById("fileTypeVideo").value;

  // Build a sample filename based on the settings
  var previewFilename = "Example";

  if (websiteName) {
    previewFilename = "Website" + separator + previewFilename;
  }

  if (includeDate) {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = String(currentDate.getMonth() + 1).padStart(2, "0");
    var day = String(currentDate.getDate()).padStart(2, "0");

    previewFilename =
      previewFilename + separator + year + separator + month + separator + day;
  }

  if (fileTypeImage) {
    previewFilename += separator + fileTypeImage;
  } else if (fileTypeDocument) {
    previewFilename += separator + fileTypeDocument;
  } else if (fileTypeVideo) {
    previewFilename += separator + fileTypeVideo;
  }

  // Display the preview filename
  document.getElementById("filenamePreview").textContent =
    "Preview: " + previewFilename;
}
