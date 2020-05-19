const getJokesBtn = document.querySelector(".getJokesBtn");
const joke = document.querySelector(".joke");
const update = document.querySelector(".update");
const jokeId = document.querySelector(".jokeId");
const jokeCategory = document.querySelector(".joke-category");
const likeBtn = document.querySelector(".likeBtn");
const jokeContainer = document.querySelector(".joke-container");
const categories = document.querySelector(".categories");
//const categoriesBtn = document.querySelector(".categoriesBtn");
const like = document.querySelector(".liked");
const randomRadio = document.querySelector('[value="random"]');
const categoriesRadio = document.querySelector('[value="categories"]');
const searchRadio = document.querySelector('[value="search"]');
const searchField = document.querySelector(".searchField");
const favContainer = document.querySelector(".favourites");
//const [randomRadio, categoriesRadio, searchRadio] = document.querySelectorAll('[name="mode"]');
const likeSvg =
  '<svg id="Layer_1" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path class="fill" d="m446.51 84.39a134.8 134.8 0 0 1 0 190.65l-190.37 192.06-190.66-190.65a134.8 134.8 0 0 1 189.79-191.47l.59-.59a134.8 134.8 0 0 1 190.65 0z" fill="transparent"/><path d="m351.185 38.9a139.778 139.778 0 0 0 -95.969 37.773 140.782 140.782 0 0 0 -193.982 4.891c-54.89 54.891-54.89 144.221 0 199.133l190.666 190.647a6 6 0 0 0 4.242 1.757h.014a6 6 0 0 0 4.247-1.777l190.346-192.042a140.816 140.816 0 0 0 -99.564-240.382zm91.061 231.915-186.121 187.785-186.404-186.388c-50.213-50.232-50.214-131.95 0-182.162a128.771 128.771 0 0 1 181.346-.8 6 6 0 0 0 8.451-.034l.587-.588a128.808 128.808 0 1 1 182.141 182.186z" fill="#FF6767"/></svg>';

randomRadio.addEventListener("click", () => {
  categories.innerHTML = "";
  searchField.classList.add("hidden");
});

categoriesRadio.addEventListener("click", () => {
  searchField.classList.add("hidden");
  showCategories();
});

searchRadio.addEventListener("click", () => {
  categories.innerHTML = "";
  searchField.classList.remove("hidden");
});

getJokesBtn.addEventListener("click", () => {
  getJokes();
});

const favourites = JSON.parse(localStorage.favourites || "[]");
favContainer.append(...favourites.map(buildJoke));
function handleLike(event, data) {
  console.log(event.target.checked);
  if (event.target.checked) {
    favourites.push(data);
  } else {
    favourites.splice(
      favourites.findIndex((joke) => joke.id === data.id),
      1
    );
  }
  localStorage.favourites = JSON.stringify(favourites);
}

function getJokes(e) {
  let url = "https://api.chucknorris.io/jokes/";
  const mode = document.querySelector('[name="mode"]:checked').value;
  if (mode === "random") {
    url += "random";
  } else if (mode === "categories") {
    const category = document.querySelector('[name="cat"]:checked').value;
    url += `random?category=${category}`;
  } else {
    url += `search?query=${searchField.value}`;
  }
  fetch(url)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data.categories);
      jokeContainer.innerHTML = "";
      if (mode === "search") {
        jokeContainer.append(...data.result.map(buildJoke));
      } else {
        jokeContainer.append(buildJoke(data));
      }
      jokeContainer.classList.remove("hidden");
    })
    .catch(function (err) {
      console.log(err);
    });
}

function showCategories(e) {
  fetch("https://api.chucknorris.io/jokes/categories")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);
      let categories = "";
      data.forEach((category) => {
        categories += `<li><label class="cat"><input hidden type="radio" name="cat" value="${category}"><span>${category}</span></label></li>`;
      });
      document.querySelector(".categories").innerHTML = categories;
      //   const id = data.id;
      //   console.log(joke, id);

      //   jokeContainer.append(joke);
    })
    .catch(function (err) {
      console.log(err);
    });
}

function highlightQuery(string, query) {
  return string.replace(new RegExp(`(${query})`), "<b>$1</b>");
}

function buildJoke(data) {
  const wrapper = document.createElement("div");
  wrapper.className = "wrapper";
  const jokeId = document.createElement("div");
  jokeId.className = "jokeID";
  jokeId.innerText = `ID: ${data.id}`;
  const joke = document.createElement("div");
  joke.className = "joke";
  const mode = document.querySelector('[name="mode"]:checked').value;
  if (mode === "search") {
    joke.innerHTML = highlightQuery(data.value, searchField.value);
  } else {
    joke.innerText = data.value;
  }
  const like = document.createElement("label");
  like.className = "like";
  like.innerHTML = likeSvg;
  const likeBtn = document.createElement("input");
  likeBtn.type = "checkbox";
  likeBtn.hidden = true;
  if (favourites.some((joke) => joke.id === data.id)) {
    likeBtn.checked = true;
  }
  like.prepend(likeBtn);
  likeBtn.addEventListener("change", (e) => {
    handleLike(e, data);
  });
  const jokeUpdate = document.createElement("div");
  jokeUpdate.className = "update";
  jokeUpdate.innerText = data.updated_at;
  const jokeCategory = document.createElement("div");
  jokeCategory.className = "joke-category";
  jokeCategory.innerText = data.categories[0] || "";
  wrapper.append(jokeId, joke, like, jokeUpdate, jokeCategory);

  return wrapper;
}
