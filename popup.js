// document.addEventListener("DOMContentLoaded", function() {
//   const captureButton = document.getElementById("capture");
//   const startCropButton = document.getElementById("startCrop");
//   const cropSaveButton = document.getElementById("cropSave");
//   const screenshotContainer = document.getElementById("screenshotContainer");
//   let startX, startY, endX, endY, screenshotImage, canvas, ctx;
//   let isSelecting = false;
//   let croppingEnabled = false; // Flag to control when cropping is allowed

//   captureButton.addEventListener("click", function() {
//       chrome.tabs.captureVisibleTab(function(screenshotDataUrl) {
//           if (screenshotDataUrl) {
//               // Create an image element to display the screenshot
//               screenshotImage = new Image();
//               screenshotImage.src = screenshotDataUrl;
//               screenshotImage.id = "screenshotImage";
//               screenshotContainer.innerHTML = ''; // Clear any previous screenshot
//               screenshotContainer.appendChild(screenshotImage);

//               // Disable dragging of the screenshot image
//               screenshotImage.addEventListener('dragstart', (e) => e.preventDefault());

//               // Show the Crop buttons after the screenshot is captured
//               startCropButton.style.display = "inline-block";
//               cropSaveButton.style.display = "none"; // Hide Crop & Save button initially
//           } else {
//               console.error("Failed to capture screenshot.");
//           }
//       });
//   });

//   startCropButton.addEventListener("click", function() {
//       // Enable cropping when "Start Cropping" is clicked
//       croppingEnabled = true;
//       cropSaveButton.style.display = "inline-block"; // Show Crop & Save button now
//       initializeCropping();
//   });

//   function initializeCropping() {
//       canvas = document.createElement('canvas');
//       ctx = canvas.getContext('2d');
//       screenshotContainer.appendChild(canvas);

//       screenshotImage.addEventListener('mousedown', function(e) {
//           if (!croppingEnabled) return; // Prevent selection until cropping is enabled
//           isSelecting = true;
//           startX = e.offsetX;
//           startY = e.offsetY;
//       });

//       screenshotImage.addEventListener('mousemove', function(e) {
//           if (isSelecting && croppingEnabled) {
//               endX = e.offsetX;
//               endY = e.offsetY;
//               drawSelection();
//           }
//       });

//       screenshotImage.addEventListener('mouseup', function() {
//           isSelecting = false;
//       });
//   }

//   function drawSelection() {
//       // Remove any existing selection box
//       let selectionBox = document.getElementById('selectionBox');
//       if (selectionBox) {
//           screenshotContainer.removeChild(selectionBox);
//       }

//       // Create a new selection box
//       selectionBox = document.createElement('div');
//       selectionBox.id = 'selectionBox';
//       selectionBox.style.position = 'absolute';
//       selectionBox.style.border = '2px solid red';
//       selectionBox.style.left = Math.min(startX, endX) + 'px';
//       selectionBox.style.top = Math.min(startY, endY) + 'px';
//       selectionBox.style.width = Math.abs(endX - startX) + 'px';
//       selectionBox.style.height = Math.abs(endY - startY) + 'px';
//       screenshotContainer.appendChild(selectionBox);
//   }

//   function finalizeSelection() {
//       const selectionBox = document.getElementById('selectionBox');
      
//       // Check if the selection box exists before proceeding
//       if (!selectionBox) {
//           console.error("No selection made.");
//           return;
//       }

//       const rect = selectionBox.getBoundingClientRect();
//       const imgRect = screenshotImage.getBoundingClientRect();

//       const cropWidth = rect.width;
//       const cropHeight = rect.height;

//       // Calculate scale factors
//       const scaleX = screenshotImage.naturalWidth / screenshotImage.width;
//       const scaleY = screenshotImage.naturalHeight / screenshotImage.height;

//       // Calculate cropping coordinates
//       const cropX = Math.max((rect.left - imgRect.left) * scaleX, 0);
//       const cropY = Math.max((rect.top - imgRect.top) * scaleY, 0);

//       // Adjust crop dimensions to ensure they fit within the image
//       const cropEndX = Math.min(cropX + cropWidth * scaleX, screenshotImage.naturalWidth);
//       const cropEndY = Math.min(cropY + cropHeight * scaleY, screenshotImage.naturalHeight);

//       // Ensure the crop dimensions are valid
//       const cropWidthAdjusted = cropEndX - cropX;
//       const cropHeightAdjusted = cropEndY - cropY;

//       // Set canvas size
//       canvas.width = cropWidthAdjusted;
//       canvas.height = cropHeightAdjusted;

//       // Draw the cropped image on canvas
//       ctx.drawImage(
//           screenshotImage,
//           cropX,
//           cropY,
//           cropWidthAdjusted,
//           cropHeightAdjusted,
//           0, 0,
//           cropWidthAdjusted,
//           cropHeightAdjusted
//       );

//       // Trigger download of the cropped image
//       const croppedImageDataUrl = canvas.toDataURL("image/png");
//       const downloadLink = document.createElement("a");
//       downloadLink.href = croppedImageDataUrl;
//       downloadLink.download = `cropped_screenshot_${Date.now()}.png`;
//       downloadLink.click();
//   }

//   // Attach the Crop & Save button functionality
//   cropSaveButton.addEventListener('click', finalizeSelection);
// });
document.addEventListener("DOMContentLoaded", function() {
    const triggerButton = document.getElementById("trigger");
    const captureButton = document.getElementById("capture");
    const startCropButton = document.getElementById("startCrop");
    const cropSaveButton = document.getElementById("cropSave");
    const screenshotContainer = document.getElementById("screenshotContainer");
    let startX, startY, endX, endY, screenshotImage, canvas, ctx;
    let isSelecting = false;
    let croppingEnabled = false;

    // Initial button setup
    captureButton.style.display = "none";
    startCropButton.style.display = "none";
    cropSaveButton.style.display = "none";
    screenshotContainer.style.display = "none";

    triggerButton.addEventListener("click", function() {
        captureButton.style.display = "inline-block";
        screenshotContainer.style.display = "block";
        triggerButton.style.display = "none";
    });

    captureButton.addEventListener("click", function() {
        chrome.windows.getCurrent({populate: true}, function(window) {
            // No need to get active tab ID, just use window.id for capturing the visible tab
            chrome.tabs.captureVisibleTab(window.id, {}, function(screenshotDataUrl) {
                if (chrome.runtime.lastError || !screenshotDataUrl) {
                    console.error("Failed to capture screenshot:", chrome.runtime.lastError);
                    return;
                }

                // Create an image element to display the screenshot
                screenshotImage = new Image();
                screenshotImage.src = screenshotDataUrl;
                screenshotImage.id = "screenshotImage";
                screenshotContainer.innerHTML = ''; // Clear any previous screenshot
                screenshotContainer.appendChild(screenshotImage);

                // Disable dragging of the screenshot image
                screenshotImage.addEventListener('dragstart', (e) => e.preventDefault());

                // Show the Crop buttons after the screenshot is captured
                startCropButton.style.display = "inline-block";
                cropSaveButton.style.display = "none";
            });
        });
    });

    startCropButton.addEventListener("click", function() {
        croppingEnabled = true;
        cropSaveButton.style.display = "inline-block";
        initializeCropping();
    });

    function initializeCropping() {
        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');
        screenshotContainer.appendChild(canvas);

        screenshotImage.addEventListener('mousedown', function(e) {
            if (!croppingEnabled) return;
            isSelecting = true;
            startX = e.offsetX;
            startY = e.offsetY;
        });

        screenshotImage.addEventListener('mousemove', function(e) {
            if (isSelecting && croppingEnabled) {
                endX = e.offsetX;
                endY = e.offsetY;
                drawSelection();
            }
        });

        screenshotImage.addEventListener('mouseup', function() {
            isSelecting = false;
        });
    }

    function drawSelection() {
        let selectionBox = document.getElementById('selectionBox');
        if (selectionBox) {
            screenshotContainer.removeChild(selectionBox);
        }

        selectionBox = document.createElement('div');
        selectionBox.id = 'selectionBox';
        selectionBox.style.position = 'absolute';
        selectionBox.style.border = '2px solid red';
        selectionBox.style.left = Math.min(startX, endX) + 'px';
        selectionBox.style.top = Math.min(startY, endY) + 'px';
        selectionBox.style.width = Math.abs(endX - startX) + 'px';
        selectionBox.style.height = Math.abs(endY - startY) + 'px';
        screenshotContainer.appendChild(selectionBox);
    }

    function finalizeSelection() {
        const selectionBox = document.getElementById('selectionBox');
        if (!selectionBox) {
            console.error("No selection made.");
            return;
        }

        const rect = selectionBox.getBoundingClientRect();
        const imgRect = screenshotImage.getBoundingClientRect();

        const cropWidth = rect.width;
        const cropHeight = rect.height;

        const scaleX = screenshotImage.naturalWidth / screenshotImage.width;
        const scaleY = screenshotImage.naturalHeight / screenshotImage.height;

        const cropX = Math.max((rect.left - imgRect.left) * scaleX, 0);
        const cropY = Math.max((rect.top - imgRect.top) * scaleY, 0);

        const cropEndX = Math.min(cropX + cropWidth * scaleX, screenshotImage.naturalWidth);
        const cropEndY = Math.min(cropY + cropHeight * scaleY, screenshotImage.naturalHeight);

        const cropWidthAdjusted = cropEndX - cropX;
        const cropHeightAdjusted = cropEndY - cropY;

        canvas.width = cropWidthAdjusted;
        canvas.height = cropHeightAdjusted;

        ctx.drawImage(
            screenshotImage,
            cropX,
            cropY,
            cropWidthAdjusted,
            cropHeightAdjusted,
            0, 0,
            cropWidthAdjusted,
            cropHeightAdjusted
        );

        const croppedImageDataUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = croppedImageDataUrl;
        downloadLink.download = `cropped_screenshot_${Date.now()}.png`;
        downloadLink.click();
    }

    cropSaveButton.addEventListener('click', finalizeSelection);
});



