
import * as model from "../js/model.js";
import recipeView from "./views/recipe_view.js";

import searchView from "./views/search_view.js";
import searchResultView from "./views/search_results_view.js";
import paginationView from "./views/pagination_view.js";
import bookmarkView from "./views/bookmark_view.js";
import addRecipeView from "./views/add_recipe_view.js";




const controlRecipes = async function () {
	const id = window.location.hash.slice(1);
	if (!id) return;
	try {
		recipeView.renderSpinner();
		await model.loadRecipe(id);
		recipeView.render(model.state.recipe);

		// console.log(model.state.recipe,model.state.bookmarks);

		try {
			searchResultView.update(model.getPaginationPages());
		} catch (err) {
			// IGNORE THE ERROR . IT SEEMS PRETTY NORMAL FOR IT TO THROW AN ERROR WHEN SEARCH HAS NOT BEEN MADE YET
		}
		try {
			bookmarkView.update(model.state.bookmarks);
		} catch (err) {
			// IGNORE THE ERROR . IT SEEMS PRETTY NORMAL FOR IT TO THROW AN ERROR WHEN TRYING TO CLEAR A NON-EXISTING DIV
			// console.log(err.message)
		}

	} catch (err) {
		console.log(err);
		recipeView.renderError();
	}
};

const controlSearch = async function () {
	try {
		searchResultView.renderSpinner();
		await model.loadSearchResults(searchView.searchQuery);
		// console.log(model.state.search.recipes);
		if (!model.state.search.query || (Array.isArray(model.state.search.recipes) && model.state.search.recipes.length === 0)) return searchResultView.renderError();

		searchResultView.render(model.getPaginationPages());
		paginationView.render(model.state.search);
	} catch (err) {
		console.log(err);
		searchResultView.renderError(err.message);
	}
};

const controlPagination = function (goto) {
	searchResultView.render(model.getPaginationPages(goto));
	paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
	model.updateServings(newServings);
	recipeView.update(model.state.recipe);
};
const updateBookmarks = function () {

	if (!model.state.recipe.bookmarked) {
		model.addBookmark(model.state.recipe);
	} else {
		model.removeBookmark(model.state.recipe.id);
	}
	recipeView.update(model.state.recipe);
	controlBookmarksRender();

};
const controlBookmarksRender = function () {
	try {
		bookmarkView.render(model.state.bookmarks);
	} catch (err) {
		console.log(err);
	}
};


const controlRecipeFormUpload = async function (recipeData) {
	// TODO: REMEMBER TO IMPLEMENT WAIT CORRECTLY SO THE MODAL GIVES YOU A NOTION OF BEING LOADED WHILE REQUEST IS HAPPENING AND TO DISPLAY A SPINNER IN THE PROCESS
	try {
		const receivedData = await model.uploadForm(recipeData);
		addRecipeView.renderSpinner();
		// await wait(2);
		model.addBookmark(receivedData);
		window.history.pushState(null, "", `#${receivedData.id}`);
		recipeView.render(model.state.recipe);
		bookmarkView.render(model.state.bookmarks);
		searchResultView.update(model.getPaginationPages());
		addRecipeView.clearInputs();
		addRecipeView.toggleModal();
	} catch (err) {
		addRecipeView.renderError(err.message);
	}
};

const init = function () {
	recipeView.addHandlerRender(controlRecipes);
	recipeView.addHandlerUpdateBookmark(updateBookmarks);
	addRecipeView._addHandlerUploadRecipe(controlRecipeFormUpload);
	bookmarkView.addHandlerRender(controlBookmarksRender);
	recipeView.addHandlerUpdateServings(controlServings);
	searchView.addHandlerRender(controlSearch);
	paginationView.addHandlerClick(controlPagination);
};
init();

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
