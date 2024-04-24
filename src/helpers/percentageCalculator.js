const calculatePercentage = (previousValue, currentValue) => {
  // Calculate the percentage increase
  const difference = currentValue - previousValue;
  const percentage = (difference / Math.abs(previousValue)) * 100;

  // Determine if it's positive or negative
  let changeType = "no change";
  if (percentage > 0) {
    changeType = "positive";
  } else if (percentage < 0) {
    changeType = "negative";
  }

  console.log(percentage);

  return {
    value: percentage === Infinity ? 0 : percentage,
    type: changeType,
  };
}

export default calculatePercentage;