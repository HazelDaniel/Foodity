import { API_URL, TIMEOUT_SEC, START_PAGE, NUM_PER_PAGE, KEY } from "./config.js";
import { AJAX } from "./helpers.js";

export const state = {
	recipe: {},
	search: {
		query: "",
		recipes: [],
		page: START_PAGE,
		numPerPage: NUM_PER_PAGE,
	},
	bookmarks: JSON.parse(localStorage.getItem("bookmarks")) ? JSON.parse(localStorage.getItem("bookmarks")) : [],
};
const timeout = function (s) {
	return new Promise(function (_, reject) {
		setTimeout(function () {
			reject(new Error(`Request took too long! Timeout after ${s} second`));
		}, s * 1000);
	});
};

const createRecipeObj = function (recipe) {

	return {
		cookingTime: recipe.cooking_time,
		id: recipe.id,
		imageUrl: recipe.image_url,
		ingredients: recipe.ingredients,
		publisher: recipe.publisher,
		servings: recipe.servings,
		sourceUrl: recipe.source_url,
		title: recipe.title,
		...(recipe.key && { key: recipe.key }),
	};
}

export async function loadRecipe(id) {
	try {
		
		let recipeJson = await AJAX(`${API_URL}${id}?key=${KEY}`);
		let { recipe } = recipeJson.data;
		

		recipe = createRecipeObj(recipe);
		recipe.bookmarked = (function () {
			if (state.bookmarks.some((bookmark) => bookmark.id === id)) return true;
			else return false;
		})();

		state.recipe = recipe;
	} catch (err) {
		throw err;
	}
}

export const loadSearchResults = async function (query) {
	try {
		state.search.query = query;

		const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
		

		state.search.recipes = data.data.recipes.map((rec) => {
			return {
				id: rec.id,
				title: rec.title,
				publisher: rec.publisher,
				imageUrl: rec.image_url,
				...(rec.key && { key: rec.key }),
			};
		});
		state.search.page = 1;
	} catch (err) {
		console.error(`${err} 💥💥💥💥`);
		throw err;
	}
};

export const getPaginationPages = function (page = state.search.page) {
	state.search.page = page;
	let start = (page - 1) * NUM_PER_PAGE;
	let end = page * NUM_PER_PAGE;
	
	return state.search.recipes.slice(start, end);
};

export const updateServings = function (newServings) {
	state.recipe.ingredients.forEach((ing) => {
		ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
	});
	state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
	state.bookmarks.push(recipe);
	recipe.bookmarked = true;
	saveBookmarks();
};

export const removeBookmark = function (id) {
	const index = state.bookmarks.findIndex((b) => b.id === id);
	if (state.bookmarks.some((bookmark) => bookmark.id === id)) {
		state.recipe.bookmarked = false;
		state.bookmarks.splice(index, 1);
		saveBookmarks();
	}
};

export const uploadForm = async function (data) {
	try {
		const entryData = Object.entries(data);
		const ingredients = entryData
			.filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
			.map((ing) => {
				if (ing[1]
					.trim()
					.split(",")
					.map((ent) => ent.trim()).length !== 3) throw new Error("Recipe ingredient(s) not correctly provided!");
					const [quantity, unit, description] = ing[1]
					.trim()
					.split(",")
					.map((ent) => ent.trim());
				return {
					quantity: quantity ? +quantity : null,
					unit,
					description,
				};
			});
		const recipe = {
			title: undefined,
			source_url: undefined,
			image_url: undefined,
			publisher: undefined,
			cooking_time: undefined,
			servings: undefined,
		};
		const entrySorted = entryData.filter((entry) => entry[1] !== "" && !entry[0].startsWith("ingredient"));
		entrySorted.forEach((es, i) => {
			recipe[Object.keys(recipe)[i]] = !Number.isNaN(+es[1]) ? +es[1] : es[1];
		});
		recipe.ingredients = ingredients;

		
		const dataRes = await Promise.race([
			fetch(`${API_URL}?key=${KEY}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(recipe),
			}),
			timeout(TIMEOUT_SEC),
		]);

		let recipeRes = await dataRes.json();
		recipeRes.data.recipe = createRecipeObj(recipeRes.data.recipe);
		state.recipe = recipeRes.data.recipe;
		return recipeRes.data.recipe;
	} catch (err) {
		throw err;
		
	}
};


const saveBookmarks = function () {
	localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};
const clearBookmarks = function () {
	localStorage.clear("bookmarks");
};
// clearBookmarks()
console.log("cleaned up code")
