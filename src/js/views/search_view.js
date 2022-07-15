import View from "../views/view.js";
class SearchView extends View {
	_parentEl = document.querySelector("form.search");
	get searchQuery() {
		const queryValue = this._parentEl.querySelector("input").value;
		this._parentEl.querySelector("input").value = "";
		// console.log(queryValue)
		return queryValue;
	}
	addHandlerRender(handler) {
		this._parentEl.addEventListener("submit", function (e) {
			e.preventDefault();
			handler();
		});
	}
}
export default new SearchView();
