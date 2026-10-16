const getBuyRentAdvice = ({
  buyPrice,
  rentPerDay,
  durationDays,
  maintenanceCost = 0,
  rentalDeposit = 0,
}) => {
  const buy = Number(buyPrice);
  const rent = Number(rentPerDay);
  const days = Number(durationDays);
  const maintenance = Number(maintenanceCost);
  const deposit = Number(rentalDeposit);

  if (
    !Number.isFinite(buy) ||
    !Number.isFinite(rent) ||
    !Number.isFinite(days) ||
    !Number.isFinite(maintenance) ||
    !Number.isFinite(deposit) ||
    buy <= 0 ||
    rent <= 0 ||
    days <= 0 ||
    maintenance < 0 ||
    deposit < 0
  ) {
    return {
      success: false,
      message:
        "Enter valid positive buy price, rental price and duration. Optional costs cannot be negative.",
    };
  }

  const totalRent = rent * days;
  const totalRentCost = totalRent + maintenance;
  const totalBuyCost = buy + maintenance;
  const savings = Math.abs(totalBuyCost - totalRentCost);

  let recommendation;

  if (totalBuyCost < totalRentCost) {
    recommendation = "BUY";
  } else if (totalRentCost < totalBuyCost) {
    recommendation = "RENT";
  } else {
    recommendation = "EQUAL";
  }

  const breakEvenDays = buy / rent;

  return {
    success: true,
    recommendation,
    input: {
      buyPrice: buy,
      rentPerDay: rent,
      durationDays: days,
      maintenanceCost: maintenance,
      rentalDeposit: deposit,
    },
    comparison: {
      totalBuyCost,
      totalRentCost,
      rentalDepositRefundable: deposit,
      costDifference: savings,
      breakEvenDays: Math.ceil(breakEvenDays),
    },
    explanation:
      recommendation === "BUY" ? "Buying costs less for the selected duration."
      : recommendation === "RENT" ?
        "Renting costs less for the selected duration."
      : "Buying and renting have the same estimated cost.",
    note: "This is a cost-based estimate. It does not account for resale value, refundable-deposit conditions, or all ownership costs.",
  };
};

module.exports = { getBuyRentAdvice };
