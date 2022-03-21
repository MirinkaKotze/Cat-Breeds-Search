// POINTERS
const searchBlock = document.getElementById('searchBlock');
const favouriteBlock = document.getElementById('favouriteBlock');
const favouriteAddedMessageBlock = document.getElementById('favouriteAddedMessageBlock');
const detailsBlock = document.getElementById('detailsBlock');

// ADD ITEMS TO DOM
function addNodes() {
  const addSearch = searchArea();
  searchBlock.appendChild(addSearch);
  
  if (localStorage.getItem('favouriteBreed').length > 2) {            // add favourite list if there is items in storage
    favouriteListContainer()
  }
}

// CREATE SEARCH SECTION
function searchArea() {
  const searchContianer = document.createElement('div');
  searchContianer.classList.add('search__container');

  const searchHeader = document.createElement('h1');
  searchHeader.classList.add('search__header');
  searchHeader.innerHTML = ' Search for a cat breed...!';

  const searchWrapper = document.createElement('div');
  searchWrapper.classList.add('search__wrapper');

  const searchInput = document.createElement('input');
  searchInput.setAttribute('placeholder', 'Enter a cat breed...');    
  searchInput.classList.add('search__input');
  searchInput.addEventListener('keydown', function (event) {
    if (event.key == "Enter") {
      event.preventDefault;
      startSearch(searchInput.value);                     // function sending input breed to the createURL function
    }
  });  

  const searchButton = document.createElement('button');
  searchButton.classList.add('search__button');
  searchButton.innerText = 'SEARCH';  
  searchButton.addEventListener('click', function()  { 
    startSearch(searchInput.value);                       // function sending input breed to the createURL function
  });

  searchWrapper.appendChild(searchInput);
  searchWrapper.appendChild(searchButton);

  searchContianer.appendChild(searchHeader);   
  searchContianer.appendChild(searchWrapper); 
  
  return searchContianer
}

// START SEARCH + CHECK FOR PREVIOUS DATA
function startSearch(searchBreed) {  
  if (favouriteAddedMessageBlock.firstChild) {
    removeFavouriteAddedMessage()
  }
  if (detailsBlock.firstChild) {      // if there is already data added, clear data before adding new cards
    removePreviousBreeds()      
  }  
  createURL(searchBreed);     
}

// REMOVE PREVIOUS LOADED BREEDS
function  removePreviousBreeds() {
  detailsBlock.innerHTML = '';
  detailsBlock.className = '';
  detailsBlock.classList.add('slider__container');
  detailsBlock.classList.add('slider');
}

// CREATE URL
function createURL(searchBreed) {
  const searchURL = `https://api.thecatapi.com/v1/breeds/search?q=${searchBreed}`
  fetchCb(searchURL, showBreeds)
}

// FETCH URL & CALL FUNCTION WITH DATA
function fetchCb(url, loadBreeds) {
  fetch(url,  {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': '06c19bd0-c9a6-410b-a3be-5d0a1450e1d9'
    },
  })
    .then((response) => response.json())
    .then((data) => {
      loadBreeds(data);    
  });
}

// CHECKING DATA LENGTH FOR --> NO BREEDS MESSAGE & ADD SLIDER
function showBreeds(data) {
  if (data.length == 0) {
    noBreedsMesage();
  }  
  data.forEach(createBreed)
  if (data.length > 1) {    // if data longer than 1, call function to add slick slider
    addSlickSlider();  
  }    
}

// DISPLAY MESSAGE IF NO BREED WAS FOUND
function noBreedsMesage() {
  const errorMessageWrapper = document.createElement('div');
  errorMessageWrapper.classList.add('no-breeds-message__container');

  const errorMessageTitle = document.createElement('h2');
  errorMessageTitle.classList.add('no-breeds-message__text');
  errorMessageTitle.innerText = 'No breeds found for your search. Please try again!';

  errorMessageWrapper.appendChild(errorMessageTitle);
  detailsBlock.appendChild(errorMessageWrapper);
}

// CREATE CATS BREED SECTION
function createBreed(breed) { 
  const catInfoContainer = document.createElement('div');
  catInfoContainer.classList.add('info__container');            
      
  const catsTitle = document.createElement('h4');
  catsTitle.classList.add('info__title');  
  catsTitle.innerText = `Title: ${breed.name}`;

  const catDescription = document.createElement('p');
  catDescription.classList.add('info__details'); 
  catDescription.innerText = `Description: ${breed.description}`;

  const catAdaptability = document.createElement('p');
  catAdaptability.classList.add('info__details'); 
  catAdaptability.innerText = `Adaptability: ${breed.adaptability}`;

  const catAffectionlevel = document.createElement('p');
  catAffectionlevel.classList.add('info__details'); 
  catAffectionlevel.innerText = `Affectionlevel: ${breed.affectionlevel}`;

  const catTemperament = document.createElement('p');
  catTemperament.classList.add('info__details'); 
  catTemperament.innerText = `Temperament: ${breed.temperament}`;

  const catLink = document.createElement('a');
  catLink.classList.add('info__details'); 
  catLink.textContent = 'More information';
  catLink.href = `${breed.vcahospitals_url}`;

  const addFavouriteButtonContainer = document.createElement('div');
  addFavouriteButtonContainer.classList.add('info__button--container');      

  const addFavouriteButton = document.createElement('button');
  addFavouriteButton.classList.add('info__button--favourite');
  addFavouriteButton.innerText = 'ADD TO FAVOURITES';  
  addFavouriteButton.addEventListener('click', function() {      // calling function to add breed to local storage
    saveFavouriteBreeds(`${breed.name}`);
  }) 
  
  addFavouriteButtonContainer.appendChild(addFavouriteButton)
        
  catInfoContainer.appendChild(addFavouriteButtonContainer); 
  catInfoContainer.appendChild(catsTitle);   
  catInfoContainer.appendChild(catDescription);
  catInfoContainer.appendChild(catAdaptability);
  catInfoContainer.appendChild(catAffectionlevel);
  catInfoContainer.appendChild(catTemperament);
  catInfoContainer.appendChild(catLink);  

  createBreedImage(breed, catInfoContainer)
  
  return catInfoContainer   // Return to showBreeds function to check length & add slick slider
}  

// CREATE BREED IMAGE 
function createBreedImage(breedInfo, catInfoDiv) {
  const imageId = breedInfo.reference_image_id;

  const catImageContainer = document.createElement('div');
  catImageContainer.classList.add('info__image--container');           

  const catImage = document.createElement("img");
  catImage.classList.add("info__image--cat");

  if (imageId) {
    fetch(`https://api.thecatapi.com/v1/images/${imageId}`)
      .then((response) => response.json())
      .then((catImg) => {        
        catImage.setAttribute("src", catImg.url);    
        catImageContainer.appendChild(catImage);    
      });      
  } 
  catInfoDiv.appendChild(catImageContainer)
  detailsBlock.appendChild(catInfoDiv);
}

// ADD SLICK SLIDER
function addSlickSlider() {
  $(document).ready(() => {
      $('.slider__container').slick({
        arrows: true,
        // dots: true,
        infinite: true,
        speed: 300,
        centerMode: true,       
      })
    });
}

// SAVE FAVOURITE ITEMS TO LOCAL STORAGE
function saveFavouriteBreeds(favBreedTitle) {  
  if (favouriteAddedMessageBlock.firstChild) {
    removeFavouriteAddedMessage()
  }
  let favourites = [];
  if (localStorage.getItem('favouriteBreed') != null) {             // if no items in local storage, don't get 
    const previousSaved = JSON.parse(localStorage.favouriteBreed);  // ['aaa']
    previousSaved.forEach((item) => {                               // remove elements from array and push into new array
      favourites.push(item)
    });

    for (let i = 0; i < favourites.length; i++) {
      if (favourites[i] === favBreedTitle) {    // if user wants to save same favourite twice
        alreadySaved(favBreedTitle);
        return
      }
    }
  }  
  const newFavourite = favourites.push(favBreedTitle)
  localStorage.setItem('favouriteBreed', JSON.stringify(favourites));   

  favouriteListContainer()
}

// ADDING FAVOURITE LIST
function favouriteListContainer()  {
  if (favouriteBlock.firstChild) {    // if already favourites - remove to add new block
    favouriteBlock.innerHTML = ''; 
  }

  const favouriteWrapper = document.createElement('div');
  favouriteWrapper.classList.add('favourite__wrapper');            
      
  const favouriteTitle = document.createElement('h4');
  favouriteTitle.classList.add('favourite__title');  
  favouriteTitle.innerText = 'FAVOURITES:';
 
  const favouriteList = createFavouriteList();

  favouriteWrapper.appendChild(favouriteTitle);
  favouriteWrapper.appendChild(favouriteList);

  favouriteBlock.appendChild(favouriteWrapper);  
}

// CREATE FAVOURITE LIST ITEMS
function createFavouriteList() {     
  const favouriteList = document.createElement('ul');
  favouriteList.classList.add('favourite__details--list'); 
  
  const favouriteSaved = JSON.parse(localStorage.favouriteBreed);

  for (let i = 0; i < favouriteSaved.length; i++) {
    const favouriteListItem = document.createElement('li');
    favouriteListItem.classList.add('favourite__details--list-item');

    const removeItemButton = document.createElement('button');
    removeItemButton.classList.add('favourite__details--remove-button');
    removeItemButton.innerText = 'X';  
    removeItemButton.addEventListener('click', function (){
      removingFavouriteBreed(favouriteSaved[i])
    })

    favouriteListItem.appendChild(removeItemButton);
    favouriteListItem.appendChild(document.createTextNode(favouriteSaved[i]));    

    favouriteList.appendChild(favouriteListItem);
  }
  return favouriteList
}

// REMOVING ITEMS FROM FAVOURITE LIST
function removingFavouriteBreed (removeBreed) {
  const savedBreeds = JSON.parse(localStorage.favouriteBreed); 

  for (let i =0; i < savedBreeds.length; i++) {
    if (savedBreeds[i] === removeBreed) {
      savedBreeds.splice([i], 1);
      localStorage.setItem('favouriteBreed', JSON.stringify(savedBreeds));  
    }
  }
  favouriteListContainer()
}

// SAVING SAME FAVOURITE TWICE
function alreadySaved() {
  const alreadySavedWrapper = document.createElement('div');
  alreadySavedWrapper.classList.add('already-saved-message__container');

  const alreadySavedTitle = document.createElement('h2');
  alreadySavedTitle.classList.add('already-saved-message__text');
  alreadySavedTitle.innerText = 'This breed is already added to your favourites!';

  alreadySavedWrapper.appendChild(alreadySavedTitle);
  favouriteAddedMessageBlock.appendChild(alreadySavedWrapper);
}

// REMOVE ALREADY ADDED MESSAGE
function removeFavouriteAddedMessage() {
  favouriteAddedMessageBlock.innerHTML = '';
  favouriteAddedMessageBlock.className = '';
}

// ADD SEARCH FUNCTION AS SOON AS PAGE IS LOADED
window.addEventListener('DOMContentLoaded', addNodes);
 