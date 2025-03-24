let originalValues = {};

// Function to update the price outputs dynamically
function updatePrices() {
    let inputValue = parseFloat(document.getElementById("inputValue").value) || 0;
    let shippingValue = parseFloat(document.getElementById("shippingValue").value) || 0;
    let sellingPrice = parseFloat(document.getElementById("sellingPrice").value) || 0;

    let formulasElement = document.getElementById("formulas");
    let rrpFormula = formulasElement.getAttribute("data-rrp");
    let priceFormula = formulasElement.getAttribute("data-price");

    let comparePrice = evaluateFormula(rrpFormula, inputValue);
    let price = evaluateFormula2(priceFormula, comparePrice);

    document.getElementById("comparePrice").innerText = comparePrice.toFixed(2);
    document.getElementById("price").innerText = price.toFixed(2);

    // Update the formula boxes with real values
    document.getElementById("compareFormula").innerText = rrpFormula.replace(/x/g, inputValue.toFixed(2));
    document.getElementById("priceFormula").innerText = priceFormula.replace(/y/g, comparePrice.toFixed(2));

    // Calculate Price Difference
    let priceDifference = sellingPrice - inputValue;
    document.getElementById("priceDifference").innerText = priceDifference.toFixed(2);

    // Calculate Margin (%)
    let priceDifferenceIncShip = sellingPrice - inputValue - shippingValue;
    let margin = (sellingPrice > 0) ? (priceDifferenceIncShip * 100) / sellingPrice : 0;
    document.getElementById("margin").innerText = margin.toFixed(2) + "%";

    // Update summary box
    let correctPriceInclVAT = evaluateFormula(priceFormula, inputValue).toFixed(2);
    let summaryText = `Input value exc. VAT = ${inputValue}\nShipping = ${shippingValue}\nCorrect price incl. VAT = ${correctPriceInclVAT}\nWe are making ${margin.toFixed(2)}% margin`;

    document.getElementById("summaryBox").value = summaryText;

    originalValues["comparePrice"] = comparePrice;
    originalValues["price"] = price;
}

// Function to Toggle Selling Price, Margin, and Summary on Button Click
function showMargin() {
    let elements = ["sellingPriceSection", "priceDifferenceSection", "marginSection", "summarySection"];
    elements.forEach(id => document.getElementById(id).classList.toggle("hidden"));
}

// Function to Evaluate Formulas Dynamically
function evaluateFormula(formula, x) {
    if (!formula || formula.trim() === "") return 0;
    try {
        return eval(formula.replace(/x/g, x));
    } catch (error) {
        console.error("Error evaluating formula:", formula, error);
        return 0;
    }
}

function evaluateFormula2(formula, y) {
    if (!formula || formula.trim() === "") return 0;
    try {
        return eval(formula.replace(/y/g, y));
    } catch (error) {
        console.error("Error evaluating formula:", formula, error);
        return 0;
    }
}

// Function to Copy Text from a Textarea
function copyToClipboard(elementId) {
    let textarea = document.getElementById(elementId);
    textarea.select();
    textarea.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand("copy");

    let copyButton = document.querySelector(`[onclick="copyToClipboard('${elementId}')"]`);
    copyButton.innerText = "✅";
    setTimeout(() => copyButton.innerText = "📋", 1500);
}

// Function to Toggle VAT
function toggleVAT(elementId) {
    let element = document.getElementById(elementId);
    let value = parseFloat(element.innerText);

    if (isNaN(value)) return;

    if (!originalValues[elementId]) {
        originalValues[elementId] = value;
    }

    let isCurrentlyIncVAT = element.innerText == originalValues[elementId].toFixed(2);

    // Toggle VAT value
    element.innerText = isCurrentlyIncVAT 
        ? (originalValues[elementId] / 1.2).toFixed(2) 
        : originalValues[elementId].toFixed(2);

    // Find and update the corresponding label
    let labelElement = document.getElementById(elementId + "Label");
    if (labelElement) {
        labelElement.innerText = isCurrentlyIncVAT 
            ? labelElement.innerText.replace("inc.", "excl.") 
            : labelElement.innerText.replace("excl.", "inc.");
    }
}



