// Event listener for determining the filename
chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
  // Get the URL of the active tab
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
    if (tabs && tabs.length > 0 && tabs[0].url) {
      try {
        var url = new URL(tabs[0].url);
        var domain = url.hostname.replace("www.", "").split(".")[0];

        chrome.storage.sync.get(
          ["includeDate", "separator"],
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

            // Append original filename
            filename += item.filename;

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
