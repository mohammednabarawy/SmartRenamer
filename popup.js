document.addEventListener("DOMContentLoaded", function () {
  var websiteNameCheckbox = document.getElementById("websiteNameCheckbox");
  var dateCheckbox = document.getElementById("dateCheckbox");
  var separatorInput = document.getElementById("separatorInput");
  var saveButton = document.getElementById("saveButton");

  // Add an event listener for changes to user settings
  var settingsElements = [websiteNameCheckbox, dateCheckbox, separatorInput];
  settingsElements.forEach(function (element) {
    element.addEventListener("input", updatePreview);
  });

  // Function to update the filename preview
  function updatePreview() {
    var websiteName = websiteNameCheckbox.checked;
    var includeDate = dateCheckbox.checked;
    var separator = separatorInput.value;

    var previewElement = document.getElementById("filenamePreview");
    var previewFilename = generateFilename(
      "ExampleFileName",
      "ExampleWebsite",
      includeDate,
      separator
    );
    // Use an example filename and website for the preview

    // Add the generated filename to the preview element
    previewElement.textContent = "Preview: " + previewFilename;
  }

  // Load saved settings and trigger the initial preview
  chrome.storage.sync.get(
    ["websiteName", "includeDate", "separator"],
    function (result) {
      websiteNameCheckbox.checked = result.websiteName !== false;
      dateCheckbox.checked = result.includeDate !== false;
      separatorInput.value = result.separator || "-";

      // Trigger the initial preview
      updatePreview();
    }
  );

  // Save settings
  saveButton.addEventListener("click", function () {
    var websiteName = websiteNameCheckbox.checked;
    var includeDate = dateCheckbox.checked;
    var separator = separatorInput.value;

    chrome.storage.sync.set(
      {
        websiteName: websiteName,
        includeDate: includeDate,
        separator: separator,
      },
      function () {
        // Display success message to the user
        var status = document.getElementById("status");
        if (status) {
          status.textContent = "Settings saved.";
        } else {
          console.error("Error: Could not find the status element.");
        }
        setTimeout(function () {
          status.textContent = "";
        }, 2000);
      }
    );

    // Update the preview after saving
    updatePreview();
  });
  // Function to generate a filename based on options
  function generateFilename(originalFilename, website, includeDate, separator) {
    var newFilename = "";

    // Add website name if enabled
    if (website) {
      newFilename += website + separator;
    }

    // Add current date if enabled
    if (includeDate) {
      var currentDate = new Date();
      var year = currentDate.getFullYear();
      var month = String(currentDate.getMonth() + 1).padStart(2, "0");
      var day = String(currentDate.getDate()).padStart(2, "0");

      newFilename += year + separator + month + separator + day + separator;
    }

    // Append the original filename
    newFilename += originalFilename;

    return newFilename;
  }
});
