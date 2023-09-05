document.addEventListener("DOMContentLoaded", function () {
  var websiteNameCheckbox = document.getElementById("websiteNameCheckbox");
  var dateCheckbox = document.getElementById("dateCheckbox");
  var separatorInput = document.getElementById("separatorInput");
  var saveButton = document.getElementById("saveButton");

  // Load saved settings
  chrome.storage.sync.get(
    ["websiteName", "includeDate", "separator"],
    function (result) {
      websiteNameCheckbox.checked = result.websiteName !== false;
      dateCheckbox.checked = result.includeDate !== false;
      separatorInput.value = result.separator || "-";
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
        // Get the status element
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
});

// Add listener for download completion
chrome.downloads.onChanged.addListener(function (downloadDelta) {
  if (downloadDelta.state && downloadDelta.state.current === "complete") {
    // Retrieve saved settings
    chrome.storage.sync.get(
      ["websiteName", "includeDate", "separator"],
      function (result) {
        var websiteName = result.websiteName !== false;
        var includeDate = result.includeDate !== false;
        var separator = result.separator || "-";

        // Get downloaded file details
        chrome.downloads.search(
          { id: downloadDelta.id },
          function (downloadItems) {
            if (downloadItems.length > 0) {
              var downloadItem = downloadItems[0];
              var originalFilename = downloadItem.filename;

              // Extract website name from URL
              var website = extractWebsiteName(downloadItem.url);

              // Generate new filename
              var newFilename = generateFilename(
                originalFilename,
                website,
                includeDate,
                separator
              );

              // Rename the downloaded file
              chrome.downloads.rename(downloadItem.id, newFilename);
            }
          }
        );
      }
    );
  }
});

// Extract website name from URL
function extractWebsiteName(url) {
  var parser = document.createElement("a");
  parser.href = url;
  return parser.hostname;
}

// Generate new filename based on options
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
