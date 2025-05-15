import {loadComponents} from "./load-components.js";
import {loadSliders} from "./slider.js"
import { auth, onAuthStateChanged, signOut, getDoc, doc, db} from "./firebase-init.js";

loadComponents()
loadSliders()

const url = 'https://shopnest-7577a-default-rtdb.asia-southeast1.firebasedatabase.app/'
async function fetchCategoriesMenu() {
    try {
        let response = await fetch(`${url}/categories.json`)
        let dataJson = await response.json()
        let data = Object.entries(dataJson || {}).map(([id, item]) => ({ id, ...item }))

        displayCategoriesMenu(data, 8)
    } catch (error) {
        console.log('Error fetching data:', error)
    }
}

function displayCategoriesMenu(data, limit) {
    const list = document.getElementById('navbar-menu')
    list.innerHTML = ''

    data.forEach(item => {
        if (limit) {
            const li = document.createElement('li')
            li.classList.add("nav-link")
            li.addEventListener('click',()=>{
                window.location = `product-listing.html`
            })
            li.innerText = item.category
            list.appendChild(li)
            limit--
        }
    })
}

fetchCategoriesMenu()