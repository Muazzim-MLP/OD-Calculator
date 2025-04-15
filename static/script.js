let originalValues = {};

// Helper: Evaluate math expression safely
function evaluateMath(input) {
    if (!input || input.trim() === '') return 0;

    // Allow only numbers and math operators
    if (/^[0-9+\-*/().\s]+$/.test(input)) {
        try {
            return eval(input);
        } catch (e) {
            console.error("Invalid math expression:", input);
            return 0;
        }
    } else {
        console.warn("Rejected input:", input);
        return 0;
    }
}

// Function to update the price outputs dynamically
function updatePrices() {
    let inputValue = evaluateMath(document.getElementById("inputValue").value);
    let shippingValue = evaluateMath(document.getElementById("shippingValue").value);
    let sellingPrice = evaluateMath(document.getElementById("sellingPrice").value);

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
    let summaryText = `Input value exc. VAT = ${inputValue}
Shipping = ${shippingValue}
Correct price incl. VAT = ${correctPriceInclVAT}
We are making ${margin.toFixed(2)}% margin`;

    document.getElementById("summaryBox").value = summaryText;

    originalValues["comparePrice"] = comparePrice;
    originalValues["price"] = price;
}

// Function to Toggle Selling Price, Margin, and Summary on Button Click
function showMargin() {
    let elements = ["sellingPriceSection", "priceDifferenceSection", "marginSection", "summarySection"];
    elements.forEach(id => document.getElementById(id).classList.toggle("hidden"));
}

// Function to Evaluate Formulas Dynamically (x-based)
function evaluateFormula(formula, x) {
    if (!formula || formula.trim() === "") return 0;
    try {
        return eval(formula.replace(/x/g, x));
    } catch (error) {
        console.error("Error evaluating formula:", formula, error);
        return 0;
    }
}

// Function to Evaluate Formulas Dynamically (y-based)
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

    // Update the corresponding label
    let labelElement = document.getElementById(elementId + "Label");
    if (labelElement) {
        labelElement.innerText = isCurrentlyIncVAT 
            ? labelElement.innerText.replace("inc.", "excl.") 
            : labelElement.innerText.replace("excl.", "inc.");
    }
}

function resetFields() {
    document.getElementById("inputValue").value = "";
    document.getElementById("shippingValue").value = "";
    document.getElementById("sellingPrice").value = "";

    // Reset all outputs too, if you want
    document.getElementById("comparePrice").innerText = "0";
    document.getElementById("price").innerText = "0";
    document.getElementById("compareFormula").innerText = "-";
    document.getElementById("priceFormula").innerText = "-";
    document.getElementById("priceDifference").innerText = "0";
    document.getElementById("margin").innerText = "0";
    document.getElementById("summaryBox").value = "";

    // Reset originalValues cache
    originalValues = {};
}
