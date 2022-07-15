
export default class View {
	_parentEl;
	_data;
	_errorMessage;
	renderSpinner() {
		const markUp = `
		<div class="spinner">
		<svg>
		<use href="../../src/img/icons.svg#icon-loader"></use>
		</svg>
		</div>
		`;
		this.clearParent();
		this._parentEl.insertAdjacentHTML("afterbegin", markUp);
	}
	clearParent() {
		// console.log(this)
		this._parentEl.innerHTML = "";
	}
	render(data,render = true) {
		if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
		this._data = data;
		// console.log(this._data)
		const markup = this._generateMarkup;
		if (render === false) return markup;
		this.clearParent();
		// console.log(markup)
		this._parentEl.insertAdjacentHTML("afterbegin", markup);
	}
	get _generateMarkup() {

	}
	update(data) {
		this._data = data;
		const markup = this._generateMarkup;
		const currentElements = Array.from(this._parentEl.querySelectorAll("*"));
		const newElements = Array.from(new DOMParser().parseFromString(markup, "text/html").querySelector("body").querySelectorAll("*"));
		// console.log(currentElements);
		newElements.forEach((newEl, i) => {
			// console.log(newEl)
			const currEl = currentElements[i];
			// console.log(currEl,newEl)
			if (!newEl.isEqualNode(currEl) && currEl.firstChild?.nodeValue.trim() !== "") {
				currEl.textContent = newEl.textContent;
			}
			if (!newEl.isEqualNode(currEl)) {
				// console.log(Array.from(newEl.attributes), Array.from(currEl.attributes));
				Array.from(newEl.attributes).forEach((attr, i) => {
					// console.log
					currEl.setAttribute(attr.name, attr.value);
				})
			}
		})

	}
	renderError(message = this._errorMessage) {
		const markUp = `
		<div class="error">
		<div>
		<svg>
		<use href="../../src/img/icons.svg#icon-alert-triangle"></use>
		</svg>
		</div>
		<p>${message}</p>
		</div>
		`;
		this.clearParent();
		this._parentEl.insertAdjacentHTML("afterbegin", markUp);
	}
}