import ReactPaginate from "react-paginate";
import "../Style/pagination.css";

function AppPagination({ page = 0, pageCount = 0, onPageChange }) {
  const total = Number(pageCount) || 0;
  if (total <= 1) return null;

  const safePage = Math.min(Math.max(Number(page) || 0, 0), total - 1);

  return (
    <ReactPaginate
      previousLabel="←"
      nextLabel="→"
      pageCount={total}
      forcePage={safePage}
      onPageChange={onPageChange}
      activeClassName="active"
      activeLinkClassName="pagination-link-active"
      breakClassName="item break-me"
      breakLabel="..."
      containerClassName="pagination"
      disabledClassName="disabled-page"
      marginPagesDisplayed={1}
      nextClassName="item next"
      pageClassName="item pagination-page"
      pageLinkClassName="pagination-link"
      pageRangeDisplayed={2}
      previousClassName="item previous"
    />
  );
}

export default AppPagination;
