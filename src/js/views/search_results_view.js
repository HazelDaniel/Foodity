
import previewView from "./preview_view.js";
import View from "../views/view.js";
class SearchResultView extends View {
	_errorMessage = "could not get results for your query!";
	_parentEl = document.querySelector(".search-results > .results");


	get _generateMarkup() {
		// console.log(this._data)
		const markUp = `${previewView.render(this._data,false)}`;
		return markUp;
	}
}
export default new SearchResultView();