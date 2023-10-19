chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
  // Get the URL of the active tab
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
    if (tabs && tabs.length > 0 && tabs[0].url) {
      try {
        var url = new URL(tabs[0].url);
        var hostname = url.hostname.replace("www.", "");
        var domainParts = hostname.split(".");
        var domain = domainParts[domainParts.length - 2];

        chrome.storage.sync.get(
          [
            "includeDate",
            "separator",
            "siteUrl",
            "extraText",
            "fileTypeFilters",
          ],
          function (result) {
            var includeDate = result.includeDate !== false;
            var separator = result.separator || "-";
            var filename = "";

            // Add domain name
            filename += domain + separator;

            // Add date if selected
            if (includeDate) {
              var date = new Date();
              var timestamp =
                formatDate(date) + separator + formatTime(date) + separator;
              filename += timestamp;
            }

            // Check if the site URL matches and add extra text
            var siteUrl = result.siteUrl;
            var extraText = result.extraText;
            if (siteUrl && hostname.includes(siteUrl) && extraText) {
              filename += extraText + separator;
            }

            // Append original filename
            filename += item.filename;

            // Determine the file type of the item (assuming you have a function to do this)
            var fileType = determineFileType(item.filename);

            // Get the user-defined file type filters
            var fileTypeFilters = result.fileTypeFilters || {};

            // Check if there is a custom naming scheme for the file type
            if (fileTypeFilters[fileType]) {
              // Apply the custom naming scheme for the file type
              filename = fileTypeFilters[fileType];
            }

            // Suggest the new filename
            suggest({ filename: filename });
          }
        );
      } catch (error) {
        console.error("Error: Invalid URL");
        suggest({}); // Suggest no changes to the filename
      }
    } else {
      console.error("Error: Active tab URL not available");
      suggest({}); // Suggest no changes to the filename
    }
  });

  return true; // Indicates that the suggest callback will be called asynchronously
});

// Function to format the date as DD-MM-YYYY
function formatDate(date) {
  var day = String(date.getDate()).padStart(2, "0");
  var month = String(date.getMonth() + 1).padStart(2, "0");
  var year = date.getFullYear();
  return day + "-" + month + "-" + year;
}

// Function to format the time as HH-MMam/pm
function formatTime(date) {
  var hours = date.getHours();
  var minutes = String(date.getMinutes()).padStart(2, "0");
  var period = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  return hours + "-" + minutes + period;
}

function determineFileType(filename) {
  // Extract the file extension from the filename
  const fileExtension = filename.split(".").pop().toLowerCase();

  // Define mappings between common file extensions and file types
  const extensionToType = {
    jpg: "image",
    jpeg: "image",
    png: "image",
    gif: "image",
    pdf: "document",
    doc: "document",
    docx: "document",
    mp4: "video",
    avi: "video",
    mkv: "video",
  };

  // Default to a generic type if the extension is not recognized
  return extensionToType[fileExtension] || "other";
}
