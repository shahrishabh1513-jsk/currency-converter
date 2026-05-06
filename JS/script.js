// DOM Elements
const toolInterface = document.getElementById("toolInterface");
const toolTitle = document.getElementById("toolTitle");
const toolSubtitle = document.getElementById("toolSubtitle");
const navBtns = document.querySelectorAll(".nav-btn");
let activeTool = "currency";

// Currency country names mapping for better display
const currencyNames = {
    USD: "US Dollar", EUR: "Euro", GBP: "British Pound", JPY: "Japanese Yen", INR: "Indian Rupee",
    AUD: "Australian Dollar", CAD: "Canadian Dollar", CHF: "Swiss Franc", CNY: "Chinese Yuan",
    SEK: "Swedish Krona", NZD: "New Zealand Dollar", MXN: "Mexican Peso", SGD: "Singapore Dollar",
    HKD: "Hong Kong Dollar", NOK: "Norwegian Krone", KRW: "South Korean Won", TRY: "Turkish Lira",
    RUB: "Russian Ruble", BRL: "Brazilian Real", ZAR: "South African Rand", AED: "UAE Dirham",
    SAR: "Saudi Riyal", THB: "Thai Baht", MYR: "Malaysian Ringgit", PHP: "Philippine Peso",
    IDR: "Indonesian Rupiah", VND: "Vietnamese Dong", PKR: "Pakistani Rupee", BDT: "Bangladeshi Taka",
    NGN: "Nigerian Naira", KES: "Kenyan Shilling", EGP: "Egyptian Pound", ILS: "Israeli Shekel",
    PLN: "Polish Zloty", CZK: "Czech Koruna", HUF: "Hungarian Forint", DKK: "Danish Krone"
};

// Helper: Update currency flag
function updateCurrencyFlag(selectId, imgId) {
    const select = document.getElementById(selectId);
    const img = document.getElementById(imgId);
    if (select && img && countryList[select.value]) {
        img.src = `https://flagsapi.com/${countryList[select.value]}/flat/64.png`;
        img.alt = `${select.value} flag`;
    }
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ========== CURRENCY CONVERTER (with country names & slider) ==========
async function renderCurrency() {
    const apiKey = "99a0aec004527b1a155623da";
    toolInterface.innerHTML = `
        <div class="converter-group">
            <div class="slider-container">
                <div class="slider-label">
                    <span><i class="fas fa-coins"></i> Amount</span>
                    <span class="slider-value" id="amountValue">1.00</span>
                </div>
                <input type="range" id="currSlider" min="0" max="10000" step="1" value="1">
                <input type="number" id="currAmount" value="1" step="any" style="margin-top: 12px; width:100%; padding:10px; border-radius:1rem; border:1px solid #ffe2b5; background:#fef9ef; font-weight:600;">
            </div>
            <div class="dual-selector">
                <div class="selector-box">
                    <img id="fromFlagCurr" class="flag-img" src="https://flagsapi.com/US/flat/64.png">
                    <select id="fromCurr"></select>
                    <i class="fas fa-chevron-down" style="color:#f5b041;"></i>
                </div>
                <div class="selector-box">
                    <img id="toFlagCurr" class="flag-img" src="https://flagsapi.com/IN/flat/64.png">
                    <select id="toCurr"></select>
                    <i class="fas fa-chevron-down" style="color:#f5b041;"></i>
                </div>
            </div>
            <div class="result-area" id="currResult">—</div>
            <button class="convert-action" id="convertCurrencyBtn">
                <i class="fas fa-sync-alt"></i> Convert Now
                <i class="fas fa-arrow-right"></i>
            </button>
            <div class="rate-badge" id="rateHint">
                <i class="fas fa-chart-line"></i> Fetching latest rates...
            </div>
        </div>
    `;
    
    const fromSelect = document.getElementById("fromCurr");
    const toSelect = document.getElementById("toCurr");
    const amountInput = document.getElementById("currAmount");
    const amountSlider = document.getElementById("currSlider");
    const amountValueSpan = document.getElementById("amountValue");
    
    // Populate currencies with names
    const currencies = Object.keys(countryList).sort();
    currencies.forEach(c => {
        const opt1 = document.createElement("option");
        opt1.value = c;
        opt1.textContent = `${c} - ${currencyNames[c] || c}`;
        const opt2 = document.createElement("option");
        opt2.value = c;
        opt2.textContent = `${c} - ${currencyNames[c] || c}`;
        fromSelect.appendChild(opt1);
        toSelect.appendChild(opt2);
    });
    
    fromSelect.value = "USD";
    toSelect.value = "INR";
    
    updateCurrencyFlag("fromCurr", "fromFlagCurr");
    updateCurrencyFlag("toCurr", "toFlagCurr");
    
    fromSelect.addEventListener("change", () => {
        updateCurrencyFlag("fromCurr", "fromFlagCurr");
        getRate();
    });
    toSelect.addEventListener("change", () => {
        updateCurrencyFlag("toCurr", "toFlagCurr");
        getRate();
    });
    
    // Slider and input sync
    amountSlider.addEventListener("input", (e) => {
        amountInput.value = e.target.value;
        amountValueSpan.textContent = parseFloat(e.target.value).toFixed(2);
        getRate();
    });
    amountInput.addEventListener("input", (e) => {
        let val = parseFloat(e.target.value) || 0;
        amountSlider.value = val;
        amountValueSpan.textContent = val.toFixed(2);
        getRate();
    });
    
    async function getRate() {
        const amount = parseFloat(amountInput.value) || 0;
        const from = fromSelect.value;
        const to = toSelect.value;
        const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${from}`;
        const resultDiv = document.getElementById("currResult");
        const rateHint = document.getElementById("rateHint");
        
        resultDiv.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Fetching live rate...`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            if(data.result === "success") {
                const rate = data.conversion_rates[to];
                const converted = (amount * rate).toFixed(2);
                resultDiv.innerHTML = `
                    <span style="font-size:1rem">${formatNumber(amount)} ${from} =</span>
                    <span style="font-size:1.5rem; display:block; margin-top:5px;">${formatNumber(converted)} ${to}</span>
                `;
                rateHint.innerHTML = `<i class="fas fa-chart-line"></i> 1 ${from} = ${rate.toFixed(4)} ${to} | 1 ${to} = ${(1/rate).toFixed(4)} ${from}`;
            } else {
                throw new Error();
            }
        } catch(e) {
            resultDiv.innerHTML = `⚠️ Unable to fetch rate. Check connection.`;
            rateHint.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Using demo mode`;
        }
    }
    
    document.getElementById("convertCurrencyBtn").addEventListener("click", getRate);
    getRate();
}

// ========== LENGTH CONVERTER WITH SLIDER ==========
function renderLength() {
    toolInterface.innerHTML = `
        <div class="converter-group">
            <div class="slider-container">
                <div class="slider-label">
                    <span><i class="fas fa-ruler"></i> Length Value</span>
                    <span class="slider-value" id="lengthValDisplay">1.00</span>
                </div>
                <input type="range" id="lengthSlider" min="0" max="1000" step="1" value="1">
                <input type="number" id="lengthVal" value="1" step="any" style="margin-top:12px; width:100%; padding:10px; border-radius:1rem; border:1px solid #ffe2b5;">
            </div>
            <div class="dual-selector">
                <select id="lengthFrom" class="selector-box" style="flex:1; padding:12px;">
                    <option value="meter">📏 Meter (m)</option>
                    <option value="km">🗺️ Kilometer (km)</option>
                    <option value="mile">🛣️ Mile (mi)</option>
                    <option value="foot">👣 Foot (ft)</option>
                    <option value="cm">📐 Centimeter (cm)</option>
                    <option value="mm">🔬 Millimeter (mm)</option>
                </select>
                <select id="lengthTo" class="selector-box" style="flex:1; padding:12px;">
                    <option value="meter">📏 Meter (m)</option>
                    <option value="km">🗺️ Kilometer (km)</option>
                    <option value="mile">🛣️ Mile (mi)</option>
                    <option value="foot">👣 Foot (ft)</option>
                    <option value="cm">📐 Centimeter (cm)</option>
                    <option value="mm">🔬 Millimeter (mm)</option>
                </select>
            </div>
            <div class="result-area" id="lengthResult">0</div>
            <button class="convert-action" id="calcLengthBtn"><i class="fas fa-arrows-left-right"></i> Convert Length</button>
        </div>
    `;
    
    const lengthVal = document.getElementById("lengthVal");
    const lengthSlider = document.getElementById("lengthSlider");
    const lengthDisplay = document.getElementById("lengthValDisplay");
    
    const units = { meter:1, km:1000, cm:0.01, mm:0.001, foot:0.3048, mile:1609.34 };
    
    lengthSlider.addEventListener("input", (e) => {
        lengthVal.value = e.target.value;
        lengthDisplay.textContent = parseFloat(e.target.value).toFixed(2);
        convert();
    });
    lengthVal.addEventListener("input", (e) => {
        let val = parseFloat(e.target.value) || 0;
        lengthSlider.value = val;
        lengthDisplay.textContent = val.toFixed(2);
        convert();
    });
    
    const convert = () => {
        const val = parseFloat(lengthVal.value) || 0;
        const from = document.getElementById("lengthFrom").value;
        const to = document.getElementById("lengthTo").value;
        const meters = val * units[from];
        const result = meters / units[to];
        document.getElementById("lengthResult").innerHTML = `${val} ${from} = <strong style="font-size:1.4rem;">${result.toFixed(6)}</strong> ${to}`;
    };
    
    document.getElementById("lengthFrom").addEventListener("change", convert);
    document.getElementById("lengthTo").addEventListener("change", convert);
    document.getElementById("calcLengthBtn").addEventListener("click", convert);
    convert();
}

// ========== AREA CONVERTER ==========
function renderArea() {
    toolInterface.innerHTML = `
        <div class="converter-group">
            <div class="slider-container">
                <div class="slider-label"><span><i class="fas fa-square"></i> Area</span><span class="slider-value" id="areaValDisplay">1</span></div>
                <input type="range" id="areaSlider" min="0" max="10000" step="1" value="1">
                <input type="number" id="areaVal" value="1" style="margin-top:12px; width:100%; padding:10px; border-radius:1rem;">
            </div>
            <div class="dual-selector">
                <select id="areaFrom"><option value="sq_meter">📐 Square Meter</option><option value="sq_km">🗺️ Square KM</option><option value="sq_foot">🏠 Square Foot</option><option value="acre">🌾 Acre</option><option value="hectare">🌳 Hectare</option></select>
                <select id="areaTo"><option value="sq_meter">📐 Square Meter</option><option value="sq_km">🗺️ Square KM</option><option value="sq_foot">🏠 Square Foot</option><option value="acre">🌾 Acre</option><option value="hectare">🌳 Hectare</option></select>
            </div>
            <div class="result-area" id="areaRes"></div>
            <button class="convert-action" id="areaBtn"><i class="fas fa-draw-polygon"></i> Convert Area</button>
        </div>
    `;
    const units = { sq_meter:1, sq_km:1e6, sq_foot:0.092903, acre:4046.86, hectare:10000 };
    const areaVal = document.getElementById("areaVal");
    const areaSlider = document.getElementById("areaSlider");
    const areaDisplay = document.getElementById("areaValDisplay");
    
    areaSlider.addEventListener("input", (e) => { areaVal.value = e.target.value; areaDisplay.textContent = e.target.value; convert(); });
    areaVal.addEventListener("input", (e) => { let v = parseFloat(e.target.value)||0; areaSlider.value = v; areaDisplay.textContent = v; convert(); });
    
    const convert = () => {
        let v = parseFloat(areaVal.value)||0;
        let f = document.getElementById("areaFrom").value, t = document.getElementById("areaTo").value;
        let res = v * units[f] / units[t];
        document.getElementById("areaRes").innerHTML = `${v} ${f} = <strong style="font-size:1.3rem;">${res.toFixed(6)}</strong> ${t}`;
    };
    document.getElementById("areaFrom").addEventListener("change", convert);
    document.getElementById("areaTo").addEventListener("change", convert);
    document.getElementById("areaBtn").addEventListener("click", convert);
    convert();
}

// ========== VOLUME CONVERTER ==========
function renderVolume() {
    toolInterface.innerHTML = `
        <div class="converter-group">
            <div class="slider-container">
                <div class="slider-label"><span><i class="fas fa-cube"></i> Volume</span><span class="slider-value" id="volValDisplay">1</span></div>
                <input type="range" id="volSlider" min="0" max="1000" step="1" value="1">
                <input type="number" id="volVal" value="1" style="margin-top:12px;">
            </div>
            <div class="dual-selector">
                <select id="volFrom"><option value="liter">💧 Liter (L)</option><option value="ml">🧪 Milliliter (mL)</option><option value="gallon">🛢️ Gallon (US)</option><option value="cubic_meter">📦 Cubic Meter</option></select>
                <select id="volTo"><option value="liter">💧 Liter (L)</option><option value="ml">🧪 Milliliter (mL)</option><option value="gallon">🛢️ Gallon (US)</option><option value="cubic_meter">📦 Cubic Meter</option></select>
            </div>
            <div class="result-area" id="volRes"></div>
            <button class="convert-action" id="volBtn"><i class="fas fa-fill-drip"></i> Convert Volume</button>
        </div>
    `;
    const units = { liter:1, ml:0.001, gallon:3.78541, cubic_meter:1000 };
    const volVal = document.getElementById("volVal"), volSlider = document.getElementById("volSlider"), volDisplay = document.getElementById("volValDisplay");
    volSlider.addEventListener("input", (e) => { volVal.value = e.target.value; volDisplay.textContent = e.target.value; convert(); });
    volVal.addEventListener("input", (e) => { let v = parseFloat(e.target.value)||0; volSlider.value = v; volDisplay.textContent = v; convert(); });
    const convert = () => { let v = parseFloat(volVal.value)||0; let f=document.getElementById("volFrom").value, t=document.getElementById("volTo").value; let res = v * units[f] / units[t]; document.getElementById("volRes").innerHTML = `${v} ${f} = <strong>${res.toFixed(6)}</strong> ${t}`; };
    document.getElementById("volFrom").addEventListener("change", convert);
    document.getElementById("volTo").addEventListener("change", convert);
    document.getElementById("volBtn").addEventListener("click", convert);
    convert();
}

// ========== WEIGHT CONVERTER ==========
function renderWeight() {
    toolInterface.innerHTML = `
        <div class="converter-group">
            <div class="slider-container">
                <div class="slider-label"><span><i class="fas fa-weight-hanging"></i> Weight</span><span class="slider-value" id="weightValDisplay">1</span></div>
                <input type="range" id="weightSlider" min="0" max="500" step="1" value="1">
                <input type="number" id="weightVal" value="1" style="margin-top:12px;">
            </div>
            <div class="dual-selector">
                <select id="weightFrom"><option value="kg">⚖️ Kilogram (kg)</option><option value="gram">🔬 Gram (g)</option><option value="lb">🏋️ Pound (lb)</option><option value="ounce">🥩 Ounce (oz)</option></select>
                <select id="weightTo"><option value="kg">⚖️ Kilogram (kg)</option><option value="gram">🔬 Gram (g)</option><option value="lb">🏋️ Pound (lb)</option><option value="ounce">🥩 Ounce (oz)</option></select>
            </div>
            <div class="result-area" id="weightRes"></div>
            <button class="convert-action" id="weightBtn"><i class="fas fa-balance-scale"></i> Convert Weight</button>
        </div>
    `;
    const units = { kg:1, gram:0.001, lb:0.453592, ounce:0.0283495 };
    const wVal = document.getElementById("weightVal"), wSlider = document.getElementById("weightSlider"), wDisplay = document.getElementById("weightValDisplay");
    wSlider.addEventListener("input", (e) => { wVal.value = e.target.value; wDisplay.textContent = e.target.value; convert(); });
    wVal.addEventListener("input", (e) => { let v = parseFloat(e.target.value)||0; wSlider.value = v; wDisplay.textContent = v; convert(); });
    const convert = () => { let v = parseFloat(wVal.value)||0; let f=document.getElementById("weightFrom").value, t=document.getElementById("weightTo").value; let res = v * units[f] / units[t]; document.getElementById("weightRes").innerHTML = `${v} ${f} = <strong>${res.toFixed(6)}</strong> ${t}`; };
    document.getElementById("weightFrom").addEventListener("change", convert);
    document.getElementById("weightTo").addEventListener("change", convert);
    document.getElementById("weightBtn").addEventListener("click", convert);
    convert();
}

// ========== TEMPERATURE CONVERTER ==========
function renderTemperature() {
    toolInterface.innerHTML = `
        <div class="converter-group">
            <div class="slider-container">
                <div class="slider-label"><span><i class="fas fa-thermometer-half"></i> Temperature</span><span class="slider-value" id="tempValDisplay">0</span></div>
                <input type="range" id="tempSlider" min="-100" max="200" step="1" value="0">
                <input type="number" id="tempVal" value="0" step="any" style="margin-top:12px;">
            </div>
            <div class="dual-selector">
                <select id="tempFrom"><option value="Celsius">🌡️ Celsius (°C)</option><option value="Fahrenheit">🔥 Fahrenheit (°F)</option><option value="Kelvin">❄️ Kelvin (K)</option></select>
                <select id="tempTo"><option value="Celsius">🌡️ Celsius (°C)</option><option value="Fahrenheit">🔥 Fahrenheit (°F)</option><option value="Kelvin">❄️ Kelvin (K)</option></select>
            </div>
            <div class="result-area" id="tempRes"></div>
            <button class="convert-action" id="tempBtn"><i class="fas fa-temperature-high"></i> Convert Temp</button>
        </div>
    `;
    const tVal = document.getElementById("tempVal"), tSlider = document.getElementById("tempSlider"), tDisplay = document.getElementById("tempValDisplay");
    tSlider.addEventListener("input", (e) => { tVal.value = e.target.value; tDisplay.textContent = e.target.value; convert(); });
    tVal.addEventListener("input", (e) => { let v = parseFloat(e.target.value)||0; tSlider.value = v; tDisplay.textContent = v; convert(); });
    const convert = () => {
        let val = parseFloat(tVal.value)||0;
        let from = document.getElementById("tempFrom").value, to = document.getElementById("tempTo").value;
        let celsius;
        if(from === "Celsius") celsius = val;
        else if(from === "Fahrenheit") celsius = (val - 32) * 5/9;
        else celsius = val - 273.15;
        let result;
        if(to === "Celsius") result = celsius;
        else if(to === "Fahrenheit") result = celsius * 9/5 + 32;
        else result = celsius + 273.15;
        document.getElementById("tempRes").innerHTML = `${val} ${from} = <strong style="font-size:1.3rem;">${result.toFixed(2)}</strong> ${to}`;
    };
    document.getElementById("tempFrom").addEventListener("change", convert);
    document.getElementById("tempTo").addEventListener("change", convert);
    document.getElementById("tempBtn").addEventListener("click", convert);
    convert();
}

// ========== NUMBER SYSTEM CONVERTER ==========
function renderNumberSystem() {
    toolInterface.innerHTML = `
        <div class="converter-group binary-group">
            <div class="input-field"><i class="fas fa-code"></i><input id="numSysVal" placeholder="Enter number (e.g., 1010, FF, 42)"></div>
            <div class="dual-selector">
                <select id="numFrom"><option value="Decimal">🔟 Decimal (0-9)</option><option value="Binary">💻 Binary (0-1)</option><option value="Hexadecimal">🔢 Hexadecimal (0-F)</option></select>
                <select id="numTo"><option value="Decimal">🔟 Decimal</option><option value="Binary">💻 Binary</option><option value="Hexadecimal">🔢 Hexadecimal</option></select>
            </div>
            <div class="result-area" id="numSysRes"></div>
            <button class="convert-action" id="numSysBtn"><i class="fas fa-exchange-alt"></i> Convert Base</button>
        </div>
    `;
    const convertBase = () => {
        let val = document.getElementById("numSysVal").value.trim().toUpperCase();
        let from = document.getElementById("numFrom").value, to = document.getElementById("numTo").value;
        try {
            let decimal;
            if(from === "Decimal") decimal = parseInt(val, 10);
            else if(from === "Binary") decimal = parseInt(val, 2);
            else decimal = parseInt(val, 16);
            if(isNaN(decimal)) throw new Error();
            let result;
            if(to === "Decimal") result = decimal.toString(10);
            else if(to === "Binary") result = decimal.toString(2);
            else result = decimal.toString(16).toUpperCase();
            document.getElementById("numSysRes").innerHTML = `📌 ${val} (${from}) = <strong style="font-size:1.2rem;">${result}</strong> (${to})`;
        } catch(e) { document.getElementById("numSysRes").innerHTML = "⚠️ Invalid input for selected base"; }
    };
    document.getElementById("numSysBtn").addEventListener("click", convertBase);
    document.getElementById("numSysVal").addEventListener("keypress", (e) => { if(e.key === "Enter") convertBase(); });
}

// ========== RENDER DISPATCH ==========
function renderTool(tool) {
    if(tool === "currency") { renderCurrency(); toolTitle.innerText="Currency Converter"; toolSubtitle.innerText="Live exchange · realtime rates with flags"; }
    else if(tool === "length") { renderLength(); toolTitle.innerText="Length Converter"; toolSubtitle.innerText="Meter, KM, Mile, Foot, CM, MM"; }
    else if(tool === "area") { renderArea(); toolTitle.innerText="Area Converter"; toolSubtitle.innerText="Sq Meter, Acre, Hectare & more"; }
    else if(tool === "volume") { renderVolume(); toolTitle.innerText="Volume Converter"; toolSubtitle.innerText="Liter, Gallon, ml, m³"; }
    else if(tool === "weight") { renderWeight(); toolTitle.innerText="Weight Converter"; toolSubtitle.innerText="Kg, Gram, Pound, Ounce"; }
    else if(tool === "temperature") { renderTemperature(); toolTitle.innerText="Temperature Converter"; toolSubtitle.innerText="Celsius, Fahrenheit, Kelvin"; }
    else if(tool === "numbersystem") { renderNumberSystem(); toolTitle.innerText="Number System Converter"; toolSubtitle.innerText="Decimal, Binary, Hexadecimal"; }
}

// Navigation event listeners
navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        navBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeTool = btn.getAttribute("data-tool");
        renderTool(activeTool);
    });
});

// Initial render
renderTool("currency");