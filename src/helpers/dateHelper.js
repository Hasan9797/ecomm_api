export const dateHelper = (date) => {
  // Sana va vaqtni formatlash
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() 0-indexed, so +1
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  // Formatlangan vaqt
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
