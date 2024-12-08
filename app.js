const BASE_URL = "https://open.er-api.com/v6/latest"; // New API Base URL

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency options
for (let select of dropdowns) {
  Object.keys(countryList).forEach((currCode) => {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  });

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Fetch and update exchange rates
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }
  const URL = `${BASE_URL}/${fromCurr.value}`;
  try {
    let response = await fetch(URL);
    if (!response.ok) throw new Error("Failed to fetch exchange rate");
    let data = await response.json();
    let rate = data.rates[toCurr.value];
    if (!rate) throw new Error("Exchange rate not found");

    let finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    console.error(error);
    msg.innerText = "Error fetching exchange rate. Please try again.";
  }
};

// Update flag images based on selected currency
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = countryCode
    ? `https://flagsapi.com/${countryCode}/flat/64.png`
    : "default-flag.png"; // Provide a default flag image URL
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", () => {
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
