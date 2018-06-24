export const countDays = (startDate, endDate) => {
  // note: timestamps from API are in seconds, not milliseconds
  return (endDate - startDate) / (24 * 60 * 60);
};

export const formatDateFromTimestamp = timestamp => {
  // note: timestamps from API are in seconds, not milliseconds
  const date = new Date(timestamp * 1000);
  return `${(date.getMonth() % 12) + 1}/${date.getDate()}/${String(
    date.getFullYear()
  ).slice(-2)}`;
};

export const createNewDateTimeString = () => {
  let d = new Date();
  return `${d.toLocaleDateString('en-US')} at ${d.toLocaleTimeString('en-US')}`;
};

export const formatPrice = price =>
  price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const utils = {
  countDays,
  formatDateFromTimestamp,
  createNewDateTimeString,
  formatPrice,
};

export default utils;
