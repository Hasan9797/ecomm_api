export const dateHelper = (date) => {
  // Sana va vaqtni formatlash
  const parsedDate = new Date(date * 1000);
  const year = parsedDate.getFullYear(); //date.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0"); // getMonth() 0-indexed, so +1
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const hours = String(parsedDate.getHours()).padStart(2, "0");
  const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
  // Formatlangan vaqt
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
