// DOM Elements
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const amountInput = document.getElementById("amount");
const convertBtn = document.getElementById("convertBtn");
const exchangeRateEl = document.getElementById("exchangeRate");
const swapBtn = document.getElementById("swapBtn");
const fromFlag = document.getElementById("fromFlag");
const toFlag = document.getElementById("toFlag");
const converterForm = document.getElementById("converterForm");

// API Key
const apiKey = "99a0aec004527b1a155623da";

// Populate currency dropdowns
function populateCurrencies() {
    const currencies = Object.keys(countryList);
    
    currencies.forEach(currency => {
        // From dropdown
        const fromOption = document.createElement("option");
        fromOption.value = currency;
        fromOption.textContent = currency;
        if (currency === "USD") {
            fromOption.selected = true;
        }
        fromCurrency.appendChild(fromOption);
        
        // To dropdown
        const toOption = document.createElement("option");
        toOption.value = currency;
        toOption.textContent = currency;
        if (currency === "INR") {
            toOption.selected = true;
        }
        toCurrency.appendChild(toOption);
    });
}

// Load flag based on selected currency
function loadFlag(selectElement, imgElement) {
    const currencyCode = selectElement.value;
    const countryCode = countryList[currencyCode];
    if (countryCode) {
        imgElement.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
        imgElement.alt = `${currencyCode} flag`;
    }
}

// Update flags when currency changes
function setupFlagListeners() {
    fromCurrency.addEventListener("change", () => {
        loadFlag(fromCurrency, fromFlag);
        getExchangeRate();
    });
    
    toCurrency.addEventListener("change", () => {
        loadFlag(toCurrency, toFlag);
        getExchangeRate();
    });
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Get exchange rate from API
async function getExchangeRate() {
    let amount = parseFloat(amountInput.value);
    
    // Validation for amount
    if (isNaN(amount) || amount <= 0) {
        amountInput.value = "1";
        amount = 1;
    }
    
    const fromCurr = fromCurrency.value;
    const toCurr = toCurrency.value;
    
    // Show loading state
    exchangeRateEl.innerHTML = `
        <div class="loading-rate">
            <i class="fas fa-sync-alt fa-spin"></i>
            <span>Fetching live rates...</span>
        </div>
    `;
    
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurr}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.result === "success") {
            const rate = data.conversion_rates[toCurr];
            const convertedAmount = (amount * rate).toFixed(2);
            const formattedRate = rate.toFixed(4);
            
            // Display the exchange rate in a clean format
            exchangeRateEl.innerHTML = `
                <span style="font-weight: 600; color: #1a202c;">
                    ${formatNumber(amount)} ${fromCurr} = 
                </span>
                <span style="font-size: 1.4rem; font-weight: 800; color: #667eea; margin-left: 0.3rem;">
                    ${formatNumber(convertedAmount)} ${toCurr}
                </span>
                <div style="font-size: 0.7rem; color: #64748b; margin-top: 0.3rem;">
                    1 ${fromCurr} = ${formattedRate} ${toCurr}
                </div>
            `;
        } else {
            throw new Error(data["error-type"] || "Failed to fetch exchange rate");
        }
        
    } catch (error) {
        console.error("Exchange rate error:", error);
        exchangeRateEl.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Unable to fetch rate. Please try again.</span>
            </div>
        `;
    }
}

// Handle convert button click
function handleConversion(e) {
    if (e) e.preventDefault();
    getExchangeRate();
}

// Handle swap functionality
function swapCurrencies() {
    // Get current values
    const fromValue = fromCurrency.value;
    const toValue = toCurrency.value;
    const fromFlagSrc = fromFlag.src;
    const toFlagSrc = toFlag.src;
    
    // Add animation to swap button
    const swapCircle = document.querySelector(".swap-circle");
    swapCircle.style.transform = "scale(0.9)";
    setTimeout(() => {
        swapCircle.style.transform = "";
    }, 150);
    
    // Swap currency values
    fromCurrency.value = toValue;
    toCurrency.value = fromValue;
    
    // Swap flags
    setTimeout(() => {
        loadFlag(fromCurrency, fromFlag);
        loadFlag(toCurrency, toFlag);
    }, 50);
    
    fromFlag.src = toFlagSrc;
    toFlag.src = fromFlagSrc;
    
    // Get new exchange rate after swap
    setTimeout(() => {
        getExchangeRate();
    }, 100);
}

// Handle amount input with debounce
let debounceTimer;
function handleAmountChange() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        let amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0) {
            amountInput.value = "1";
        }
        getExchangeRate();
    }, 500);
}

// Initialize everything
function init() {
    populateCurrencies();
    
    // Set initial flags
    setTimeout(() => {
        loadFlag(fromCurrency, fromFlag);
        loadFlag(toCurrency, toFlag);
    }, 50);
    
    setupFlagListeners();
    
    // Add event listeners
    convertBtn.addEventListener("click", handleConversion);
    swapBtn.addEventListener("click", swapCurrencies);
    amountInput.addEventListener("input", handleAmountChange);
    
    // Handle form submission
    converterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        getExchangeRate();
    });
    
    // Keyboard shortcut - Enter key
    amountInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            getExchangeRate();
        }
    });
    
    // Initial fetch
    setTimeout(() => {
        getExchangeRate();
    }, 100);
}

// Start the application
document.addEventListener("DOMContentLoaded", init);