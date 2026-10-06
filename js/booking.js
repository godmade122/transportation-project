// GET PRICES FROM BACKEND
async function loadPrices() {
  try {
    const response = await fetch(
      `${API_URL}/api/prices`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to load prices"
      );
    }

    prices = data.prices || data;

    console.log("Prices loaded:", prices);

  } catch (error) {
    console.error("Error loading prices:", error);
  }
}