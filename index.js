import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://realtime-database-a820a-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

const toggleThemeBtnEl = document.getElementById("toggle-theme-btn");

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value;
    
    push(shoppingListInDB, inputValue);
    
    clearInputFieldEl();
})

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());
    
        clearShoppingListEl();
        
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
    let itemID = item[0];
    let itemValue = item[1];
    
    let newEl = document.createElement("li");
    
    newEl.textContent = itemValue;
    
    newEl.addEventListener("click", function() {
        
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);

        let deleteConfirm = window.confirm("would you like to delete this item?");
        
        if (deleteConfirm) {
            remove(exactLocationOfItemInDB);
        }
       
    })
    
    shoppingListEl.append(newEl);
}

function setTheme(themeName) {
    localStorage.setItem("theme", themeName);
    document.documentElement.className = themeName;
}

function toggleTheme() {
    if (localStorage.getItem("theme") === "secondaryTheme") {
        setTheme("primaryTheme");
    } else {
        setTheme("secondaryTheme");
    }
}

toggleThemeBtnEl.addEventListener("click", function() {
    toggleTheme();
})



if (localStorage.getItem("theme") === "primaryTheme") {
    setTheme("primaryTheme");
} else {
    setTheme("primaryTheme");
}