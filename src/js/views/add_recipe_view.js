
import View from "../views/view.js";
class AddRecipeView extends View {
	_parentEl = document.querySelector(".upload");
	_uploadWindow = document.querySelector(".add-recipe-window");
	_overlayWindow = document.querySelector(".overlay");
	_modalCloseBtn = document.querySelector(".btn--close-modal");
	_addRecipeBtn = document.querySelector(".nav__btn--add-recipe");
	_recipeUploadBtn = this._parentEl.querySelector(".upload__btn");
	_data;
	_errorMessage = "this is an error message";
	constructor() {
		super();
		this.init();
	}

	toggleModal(e) {
		e?.preventDefault();
		this._overlayWindow.classList.toggle("hidden");
		this._uploadWindow.classList.toggle("hidden");
	}
	_addHandlerOpenModal() {
		this._addRecipeBtn.addEventListener("click", this.toggleModal.bind(this));
	}
	_addHandlerCloseModal() {
		this._overlayWindow.addEventListener("click", this.toggleModal.bind(this));
		this._modalCloseBtn.addEventListener("click", this.toggleModal.bind(this));

		this._modalCloseBtn.addEventListener("click", this.clearInputs.bind(this));
		this._overlayWindow.addEventListener("click", this.clearInputs.bind(this));
	}
	_addHandlerUploadRecipe(handler) {
		this._parentEl.addEventListener("submit", (e)=> {
			e.preventDefault();
			const formData = [...new FormData(this._parentEl)];
			const data = Object.fromEntries(formData);
			handler(data);
		})
	}
	clearInputs() {
		Array.from(this._parentEl.querySelectorAll("input")).forEach(el => {
			el.value = "";
		})
	}
	init() {
		this._addHandlerCloseModal();
		this._addHandlerOpenModal();
	}
}
export default new AddRecipeView();

