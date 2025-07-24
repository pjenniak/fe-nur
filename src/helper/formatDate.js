export const formatDate = (
  dateInput,
  isFullDate = false,
  isWithTime = false
)=> {
  const listMonth = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  let date

  if (typeof dateInput === "string") {
    date = new Date(dateInput);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    return "-";
  }

  const year = date.getFullYear();
  const month = date.getMonth();
  const monthName = listMonth[month];

  if (isWithTime) {
    return `${("0" + date.getDate()).slice(-2)} ${monthName}, ${year} ${(
      "0" + date.getHours()
    ).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}`;
  }
  if (isFullDate) {
    return `${("0" + date.getDate()).slice(-2)} ${monthName}, ${year}`;
  } else {
    return `${monthName} ${year}`;
  }
};

export default formatDate;
