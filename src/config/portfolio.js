/** Project IDs and tag IDs only — all display text lives in locales */
export const projects = [
  { id: "kapperszaak", tagId: "Design" },
  { id: "loodgieter",  tagId: "Development" },
  { id: "horeca",      tagId: "Fullstack" },
];

/** Internal tag IDs used for filtering — display labels come from t("portfolio.tags.*") */
export const tagIds = ["All", "Design", "Development", "Fullstack"];
