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
export const FETCH_QUESTIONS_URL = (
  questId: string | number,
  search: string,
  page: number
) => {
  return `${DOMAIN}/portal/admin/quests/${questId}/questions/?search_questions=${search}&page=${page}`;
};
export const UPLOAD_QUESTIONS_FILE_URL = (questId: number | string) => {
  return `${DOMAIN}/portal/admin/quests/${questId}/questions/upload/bulk/`;
};
export const SAVE_QUESTION_INSTANCE_URL = (questId: number | string) => {
  return `${DOMAIN}/portal/admin/quests/${questId}/questions/upload/single/`;
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
export const FETCH_BOOK_CHAPTERS_URL = (bookId: string | number) => {
  return `${DOMAIN}/portal/admin/library/view/${bookId}/chapters/`;
};
export const UPLOAD_BOOK_CHAPTER_URL = (bookId: string | number) => {
  return `${DOMAIN}/portal/admin/library/view/${bookId}/chapters/upload/`;
};
export const DELETE_BOOK_CHAPTER_URL = (chapterId: string | number) => {
  return `${DOMAIN}/portal/admin/library/chapter/delete/${chapterId}/`;
};

// ==================================================
// SUBSCRIPTION URLS
// ==================================================
export const GET_SUBSCRIPTIONS_URL = `${DOMAIN}/portal/admin/subscription-plans/`;
export const SAVE_SUBSCRIPTION_INSTANCE_URL = `${DOMAIN}/portal/admin/subscription-plans/save-instance/`;
