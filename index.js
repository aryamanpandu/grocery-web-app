
// Imports the important functions to use from firebase for the database to work properly
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Url of the actual database in firebase
const appSettings = {
    databaseURL: "https://realtime-database-a820a-default-rtdb.firebaseio.com/"
}

// initialises everything so that the database can be used in the javascript file
const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

const toggleThemeBtnEl = document.getElementById("toggle-theme-btn");

// The function listens in on the addButton element and pushes the value inside the input using another function 
// and clears the input button so that the user does not have to clear it themselves
addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value;
    push(shoppingListInDB, inputValue);
    
    clearInputFieldEl();
})

// The onValue function is responsible for checking the values in the database through the snapshot and then appending them to an array and 
onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());
    
        clearShoppingListEl(); // We have to clear the shopping list element otherwise it adds the old elements again with the new elements.
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            let currentItemID = currentItem[0];
            let currentItemValue = currentItem[1];
            
            appendItemToShoppingListEl(currentItem);
        }    
    } else {
        shoppingListEl.innerHTML = "<p style = ' font-size: 20px; '>No items here... yet <p> ";
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
    inputFieldEl.value = "";
}


function appendItemToShoppingListEl(item) {
    //adds the element into the list of items shown
    let itemID = item[0];
    let itemValue = item[1];
    
    let newEl = document.createElement("li");
    
    newEl.textContent = itemValue;
    
    //if the list element button is clicked then it asks if you wish to delete the item and then removes it if the user presses yes
    newEl.addEventListener("click", function() {
        
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);

        let deleteConfirm = window.confirm("would you like to delete this item?");
        
        if (deleteConfirm) {
            remove(exactLocationOfItemInDB);
        }
       
    })
    
    shoppingListEl.append(newEl);
}

//this function sets the theme by using local storage so that it stores the theme and sets it using the function
function setTheme(themeName) {
    localStorage.setItem("theme", themeName);
    document.documentElement.className = themeName;
}

//this function toggles the theme and sets it to the primaryTheme if it was on secondaryTheme
function toggleTheme() {
    if (localStorage.getItem("theme") === "secondaryTheme") {
        setTheme("primaryTheme");
    } else {
        setTheme("secondaryTheme");
    }
}

//this function checks if the toggle button is clicked
toggleThemeBtnEl.addEventListener("click", function() {
    toggleTheme();
})


//this checks what the value is stored in the Local Storage
if (localStorage.getItem("theme") === "primaryTheme") {
    setTheme("primaryTheme");
} else {
    setTheme("primaryTheme");
}