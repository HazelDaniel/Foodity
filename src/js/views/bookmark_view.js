// import icons from "../../img/icons.svg";
import View from "../views/view.js";
import previewView from "./preview_view.js";
class BookmarkView extends View {
	_errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it :)";
	_parentEl = document.querySelector(".bookmarks__list");

	get _generateMarkup() {
		const markUp = `${previewView.render(this._data, false)}`;
		return markUp;
	}
	addHandlerRender(handler) {
		window.addEventListener("load", handler);
	}
}
export default new BookmarkView();
