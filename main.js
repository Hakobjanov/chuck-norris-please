const getJokesBtn = document.querySelector(".getJokesBtn");
const joke = document.querySelector(".joke");
const update = document.querySelector(".update");
const jokeId = document.querySelector(".jokeId");
const jokeCategory = document.querySelector(".joke-category");
const likeBtn = document.querySelector(".likeBtn");
let jokeContainer = document.querySelector(".joke-container");
const categories = document.querySelector(".categories");
//const categoriesBtn = document.querySelector(".categoriesBtn");
const like = document.querySelector(".liked");
const randomRadio = document.querySelector('[value="random"]');
const categoriesRadio = document.querySelector('[value="categories"]');
const searchRadio = document.querySelector('[value="search"]');
const searchField = document.querySelector(".searchField");
//const [randomRadio, categoriesRadio, searchRadio] = document.querySelectorAll('[name="mode"]');

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

like.addEventListener("click", () => {
  like.classList.toggle("active");
});

getJokesBtn.addEventListener("click", () => {
  getJokes();
});

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
      if (mode === "search") {
        data = data.result[Math.floor(Math.random() * data.total)];
        joke.innerHTML = highlightQuery(data.value, searchField.value);
      } else {
        joke.innerText = data.value;
      }
      likeBtn.classList.remove("hidden");
      jokeId.innerText = `ID: ${data.id}`;
      update.innerText = data.updated_at;
      jokeCategory.innerText = data.categories[0] || "";
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
