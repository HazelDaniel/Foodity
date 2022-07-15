// import icons from "../../img/icons.svg";
import View from "../views/view.js";
class PaginationView extends View {
	_parentEl = document.querySelector(".pagination");

	get _generateMarkup() {
		let currentPage = this._data.page;
		let numPages = Math.ceil(this._data.recipes.length / this._data.numPerPage);

		function getNextBtnMarkup() {
			return `
					<button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
							<span>Page ${currentPage + 1}</span>
							<svg class="search__icon">
								<use href="../../src/img/icons.svg#icon-arrow-right"></use>
							</svg>
          </button>
			`;
		}
		function getPrevBtnMarkup() {
			return `
					<button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
							<svg class="search__icon">
								<use href="../../src/img/icons.svg#icon-arrow-left"></use>
							</svg>
							<span>Page ${currentPage - 1}</span>
					</button>
			`;
		}

		// 1. page one and there are other pages
		if (currentPage === 1 && numPages > 1) {
			return `
					${getNextBtnMarkup()}
			`;
		}
		// 2. page one and there are no other pages
		if (currentPage === 1 && currentPage === numPages) {
			return ``;
		}
		// 3. last page
		if (currentPage > 1 && currentPage === numPages) {
			return `
				${getPrevBtnMarkup()}
			`;
		}
		// 4. other page
		if (currentPage > 1 && currentPage < numPages) {
			return `
					${getPrevBtnMarkup()}
					${getNextBtnMarkup()}
			`;
		}
	}
	addHandlerClick(handler) {
		this._parentEl.addEventListener("click", function (e) {
			e.preventDefault();
			const btn = e.target.closest(".btn--inline");
			if (!btn) return;
			handler(+btn.dataset.goto);
		});
	}
}
export default new PaginationView();
