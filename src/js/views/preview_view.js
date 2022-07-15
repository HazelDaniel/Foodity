// import icons from "../../img/icons.svg";
import View from "../views/view.js";
class PreviewView extends View {
	get _generateMarkup() {

		const id = window.location.hash.slice(1);
		// console.log(this._data)
		const markUp = `
		${this._data
			.map((rec) => {
				// console.log(rec)
				
				return `
				<li class="preview">
				<a class="preview__link ${rec.id === id ? "preview__link--active" : ""}" href="#${rec.id}">
					<figure class="preview__fig">
						<img src="${rec.imageUrl}" alt="${rec.title}" />
					</figure>
					<div class="preview__data">
						<h4 class="preview__title">${rec.title}</h4>
						<p class="preview__publisher">${rec.publisher}</p>
						<div class="preview__user-generated ${rec.key ? "" : "hidden"}">
							<svg>
								<use href="../../src/img/icons.svg#icon-user"></use>
								</svg>
						</div>
						</div>
				</a>
				</li>
				`;
			})
			.join("\n")}
		`;
		return markUp;
	}
}
export default new PreviewView();
