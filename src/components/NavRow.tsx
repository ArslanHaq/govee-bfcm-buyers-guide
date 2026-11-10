import { AddressBar, ChevronLeft, ChevronRight, SearchIcon, TitleSquare } from "./icons";

/** The window's title-bar squares and browser nav row. Decorative. */
export function NavRow() {
  return (
    <>
      <TitleSquare className="nav-square" style={{ left: 252.2 }} />
      <TitleSquare className="nav-square" style={{ left: 287.9 }} />
      <TitleSquare className="nav-square" style={{ left: 322.5 }} />
      <ChevronLeft className="nav-prev" />
      <ChevronRight className="nav-next" />
      <SearchIcon className="nav-search" />
      <AddressBar className="nav-address" />
    </>
  );
}
