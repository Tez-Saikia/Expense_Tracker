export type DateRange = "daily" | "weekly" | "monthly" | "yearly";

const getDateRange = (range: DateRange) => {
  const now = new Date();

  let start: Date;
  let end: Date;

  switch (range) {
    case "daily":
      start = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0
      );

      end = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999
      );
      break;

    case "weekly":
      start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);

      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;

    case "monthly":
      start = new Date(now.getFullYear(), now.getMonth(), 1);

      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;

    case "yearly":
      start = new Date(now.getFullYear(), 0, 1);

      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
  }

  return { start, end };
};

export default getDateRange;
