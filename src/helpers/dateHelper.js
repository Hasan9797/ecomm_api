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

export const dateHelperForExcel = (date) => {

  const arrayDate = date.split('_');
  
  if (arrayDate.length === 2) {
    const fromDate = new Date(arrayDate[0] + 'T00:00:00Z');
    const toDate = new Date(arrayDate[1] + 'T23:59:59Z');

    const fromTimestamp = Math.floor(fromDate.getTime() / 1000);
    const toTimestamp = Math.floor(toDate.getTime() / 1000);

    return {
      from: fromTimestamp,
      to: toTimestamp,
    };
  }

  switch (date) {
    case 'today': {
      const from = new Date();
      from.setHours(0, 0, 0, 0);

      const to = new Date();
      to.setHours(23, 59, 59, 999);

      return {
        from: Math.floor(from.getTime() / 1000),
        to: Math.floor(to.getTime() / 1000),
      };
    }

    case 'yesterday': {
      const from = new Date();
      from.setDate(from.getDate() - 1);
      from.setHours(0, 0, 0, 0);

      const to = new Date();
      to.setDate(to.getDate() - 1);
      to.setHours(23, 59, 59, 999);

      return {
        from: Math.floor(from.getTime() / 1000),
        to: Math.floor(to.getTime() / 1000),
      };
    }

    case 'week': {
      const from = new Date();
      from.setDate(from.getDate() - 7);
      from.setHours(0, 0, 0, 0);

      const to = new Date();
      to.setHours(23, 59, 59, 999);

      return {
        from: Math.floor(from.getTime() / 1000),
        to: Math.floor(to.getTime() / 1000),
      };
    }

    default:
      throw new Error('Noto‘g‘ri date kalit so‘zi: ' + date);
  }
}