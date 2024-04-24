const generateTransactionNumber = (number) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
  const day = currentDate.getDate().toString().padStart(2, '0');
  const paddedNumber = number.toString().padStart(8, '0');

  const formattedString = `${year}${month}${day}-${paddedNumber}`;
  return formattedString;
}

export default generateTransactionNumber