const dots = [];

// Define variables to store information about the currently dragged label
let isLabelDragged = false;
let draggedLabel = null;
let initialMouseX = 0;
let initialMouseY = 0;
let initialLabelX = 0;
let initialLabelY = 0;

function plotDot() {
    const x = parseFloat(document.getElementById('xInput').value);
    const y = parseFloat(document.getElementById('yInput').value);
    const text = document.getElementById('textInput').value;
    
    const sel = document.getElementById('textInput');
    const toolTipText = document.getElementById('tooltiptext').value;

    console.log(toolTipText);
    console.log(text);
    
    if (isNaN(x) || isNaN(y) || x < 0 || x > 10 || y < 0 || y > 10) {
        alert("Please enter valid X and Y values between 0 and 10.");
        return;
    }

    const chartContainer = document.getElementById('chart-container');
    
    // Create a new dot element
    const dot = document.createElement('div');
    dot.className = 'dot';
    
    // Calculate the position of the dot within the chart container
    const chartWidth = chartContainer.clientWidth;
    const chartHeight = chartContainer.clientHeight;
    const dotX = (x / 10) * chartWidth - dot.clientWidth / 2;
    const dotY = (1 - y / 10) * chartHeight - dot.clientHeight / 2;

    // Set the position of the dot
    dot.style.left = dotX + 'px';
    dot.style.top = dotY + 'px';

    // Add the dot to the chart container
    chartContainer.appendChild(dot);

    // Create a label and tooltip for the dot
    const dotLabel = document.createElement('div');
    const toolTip = document.createElement('span');
    
    dotLabel.className = 'dot-label';
    toolTip.className = 'tooltiptext';

    dotLabel.textContent = `${text}`;
    toolTip.textContent = `${toolTipText}`

    dotLabel.style.left = dotX + 15 + 'px';
    dotLabel.style.top = dotY - 15 + 'px';

    chartContainer.appendChild(dotLabel);
    dotLabel.appendChild(toolTip);
    
    // Store the dot's coordinates and text in the array
    dots.push({ x, y, text });
}

function deleteLastDot() {
    const chartContainer = document.getElementById('chart-container');
    const dotsOnChart = chartContainer.querySelectorAll('.dot');
    const dotLabelsOnChart = chartContainer.querySelectorAll('.dot-label');

    // Check if there are dots to delete
    if (dotsOnChart.length > 0) {
        const lastDot = dotsOnChart[dotsOnChart.length - 1];
        const lastDotLabel = dotLabelsOnChart[dotLabelsOnChart.length - 1];

        chartContainer.removeChild(lastDot);
        chartContainer.removeChild(lastDotLabel);

        // Remove the last dot from the array
        dots.pop();
    }
}

function exportToCSV() {
    if (dots.length === 0) {
        alert("There are no dots to export.");
        return;
    }

    // Create a CSV string with headers
    let csvContent = "Impact, Implementation, PICK\n";

    // Loop through the dots array and add each dot's data to the CSV
    dots.forEach((dot) => {
        csvContent += `${dot.x}, ${dot.y}, "${dot.text}"\n`;
    });

    // Create a Blob object containing the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv' });

    // Create a temporary URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // Create a link element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PICK.csv';

    // Simulate a click to trigger the download
    a.click();

    // Clean up by revoking the temporary URL
    window.URL.revokeObjectURL(url);
}

// Function to handle the start of label dragging
function startDragLabel(e) {
    e.preventDefault();

    // Set the flag to indicate label dragging
    isLabelDragged = true;

    // Store the dragged label, initial mouse position, and initial label position
    draggedLabel = e.target;
    initialMouseX = e.clientX;
    initialMouseY = e.clientY;
    initialLabelX = parseFloat(draggedLabel.style.left) || 0;
    initialLabelY = parseFloat(draggedLabel.style.top) || 0;

    // Bring the dragged label to the top of the stack
    draggedLabel.style.zIndex = '999';
}

// Function to handle label dragging
function dragLabel(e) {
    if (isLabelDragged) {
        // Calculate the new label position based on mouse movement
        const deltaX = e.clientX - initialMouseX;
        const deltaY = e.clientY - initialMouseY;
        const newLabelX = initialLabelX + deltaX;
        const newLabelY = initialLabelY + deltaY;

        // Set the new label position
        draggedLabel.style.left = newLabelX + 'px';
        draggedLabel.style.top = newLabelY + 'px';
    }
}

// Function to handle the end of label dragging
function endDragLabel() {
    // Reset the flag and clear the dragged label reference
    isLabelDragged = false;
    // draggedLabel.style.zIndex = ''; // Reset z-index to default
    draggedLabel = null;
}

// Add event listeners for label dragging
document.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('dot-label')) {
        startDragLabel(e);
    }
});

document.addEventListener('mousemove', (e) => {
    dragLabel(e);
});

document.addEventListener('mouseup', () => {
    endDragLabel();
});


// Function to handle label click (highlighting)
function toggleHighlightLabel(e) {
    e.preventDefault();

    // Toggle the highlighted class on the clicked label
    const clickedLabel = e.target;
    clickedLabel.classList.toggle('highlighted-label');
}

// Function to handle clicking anywhere on the screen
function handleScreenClick(e) {
    // Check if the click target is not a label
    if (!e.target.classList.contains('.dot-label')) {
        // Remove the highlighted class from all labels
        const allLabels = document.querySelectorAll('.dot-label');
        allLabels.forEach((label) => {
            label.classList.remove('highlighted-label');
        });
    }
}

// Add event listeners for label click and screen click
document.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('dot-label')) {
        toggleHighlightLabel(e);
    } else {
        handleScreenClick(e);
    }
});