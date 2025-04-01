document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab-btn");
    const valueInput = document.getElementById("value");
    const fromUnitSelect = document.getElementById("fromUnit");
    const toUnitSelect = document.getElementById("toUnit");
    const convertBtn = document.getElementById("convertBtn");
    const resetBtn = document.getElementById("resetBtn");
    const resultCard = document.getElementById("resultCard");
    const resultText = document.getElementById("resultText");

    async function updateUnits(type) {
        try {
            const response = await fetch(`/api/converter/units/${type}`);
            if (!response.ok) {
                throw new Error("Failed to fetch units");
            }
            const units = await response.json();

            fromUnitSelect.innerHTML = "";
            toUnitSelect.innerHTML = "";

            Object.entries(units).forEach(([value, text]) => {
                fromUnitSelect.add(new Option(text, value));
                toUnitSelect.add(new Option(text, value));
            });
        } catch (error) {
            console.error("Error fetching units:", error);
            alert("Error loading units. Please try again.");
        }
    }

    async function performConversion(value, fromUnit, toUnit, type) {
        try {
            const response = await fetch(`/api/converter/convert/${type}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    value,
                    fromUnit,
                    toUnit,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Conversion failed");
            }

            return await response.json();
        } catch (error) {
            console.error("Error converting:", error);
            throw error;
        }
    }

    // Event Listeners
    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");
            updateUnits(tab.dataset.type);
            resultCard.style.display = "none";
        });
    });

    convertBtn.addEventListener("click", async () => {
        const value = parseFloat(valueInput.value);
        if (isNaN(value)) {
            alert("Please enter a valid number");
            return;
        }

        try {
            const fromUnit = fromUnitSelect.value;
            const toUnit = toUnitSelect.value;
            const activeTab = document.querySelector(".tab-btn.active");
            const type = activeTab.dataset.type;

            const result = await performConversion(
                value,
                fromUnit,
                toUnit,
                type
            );
            resultText.textContent = `${result.originalValue} ${result.fromUnit} = ${result.result} ${result.toUnit}`;
            resultCard.style.display = "block";
        } catch (error) {
            alert(error.message || "Conversion failed. Please try again.");
        }
    });

    resetBtn.addEventListener("click", () => {
        valueInput.value = "";
        resultCard.style.display = "none";
        fromUnitSelect.selectedIndex = 0;
        toUnitSelect.selectedIndex = 0;
    });

    // Initialize with length units
    updateUnits("length");
});
