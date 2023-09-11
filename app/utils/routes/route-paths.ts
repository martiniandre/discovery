export const PATHS = {
  HOME: "/",
  SIGN_IN: "/auth/sign-in",
  SIGN_UP: "/auth/sign-up",
  SEARCH: "/search",
  SEARCH_BY: (searchBy: string) => `/search/${searchBy}`,
  ART_GALLERY: (artID: string) => `/gallery/${artID}`,
};
