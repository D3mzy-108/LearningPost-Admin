export const DOMAIN = "http://localhost:2002";
// export const DOMAIN = "https://api.learningpost.ng";
export const LOGIN_URL = `${DOMAIN}/portal/login/`;
export const GET_QUESTS_URL = (search: string, page: number) => {
  return `${DOMAIN}/portal/admin/quests/?search_quest=${search}&page=${page}`;
};
export const GET_BOOKS_URL = (search: string, page: number) => {
  return `${DOMAIN}/portal/admin/library/?search_books=${search}&page=${page}`;
};
