export const DOMAIN = "http://localhost:2002";
// export const DOMAIN = "https://api.learningpost.ng";
export const LOGIN_URL = `${DOMAIN}/portal/login/`;

export const LOAD_EXT_FORM_DATA_URL = () => {
  return `${DOMAIN}/portal/admin/ext-form-data/`;
};

// ==================================================
// QUESTS URLS
// ==================================================
export const GET_QUESTS_URL = (search: string, page: number) => {
  return `${DOMAIN}/portal/admin/quests/?search_quest=${search}&page=${page}`;
};
export const SAVE_QUEST_INSTANCE_URL = () => {
  return `${DOMAIN}/portal/admin/quests/save-instance/`;
};

// ==================================================
// BOOKEE URLS
// ==================================================
export const GET_BOOKS_URL = (search: string, page: number) => {
  return `${DOMAIN}/portal/admin/library/?search_books=${search}&page=${page}`;
};
export const SAVE_BOOK_INSTANCE_URL = () => {
  return `${DOMAIN}/portal/admin/library/save-instance/`;
};
