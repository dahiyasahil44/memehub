import {loadComponents} from "./load-components.js";
import {loadSliders} from "./slider.js"
import { auth, onAuthStateChanged, signOut, getDoc, doc, db} from "./firebase-init.js";

loadComponents()
loadSliders()

onAuthStateChanged(auth, (user)=>{
    if(user){
        document.getElementById('user-sidebar').classList.remove('hidden')
        document.getElementById('signupBtn').classList.add('hidden')
        document.getElementById('loginBtn').classList.add('hidden')
    }else{
        document.getElementById('user-sidebar').classList.add('hidden')
        document.getElementById('signupBtn').classList.remove('hidden')
        document.getElementById('loginBtn').classList.remove('hidden')
    }
})

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        signOut(auth)
            .then(() => {
                alert("Logout successfull!!")
            }).catch((err) => {
                console.log(err)
            })
    }
}
window.logout = logout


// const url = 'https://shopnest-7577a-default-rtdb.asia-southeast1.firebasedatabase.app/'
// async function fetchCategoriesMenu() {
//     try {
//         let response = await fetch(`${url}/categories.json`)
//         let dataJson = await response.json()
//         let data = Object.entries(dataJson || {}).map(([id, item]) => ({ id, ...item }))

//         displayCategoriesMenu(data, 8)
//     } catch (error) {
//         console.log('Error fetching data:', error)
//     }
// }

// function displayCategoriesMenu(data, limit) {
//     const list = document.getElementById('navbar-menu')
//     list.innerHTML = ''

//     data.forEach(item => {
//         if (limit) {
//             const li = document.createElement('li')
//             li.classList.add("nav-link")
//             li.addEventListener('click',()=>{
//                 window.location = `product-listing.html`
//             })
//             li.innerText = item.category
//             list.appendChild(li)
//             limit--
//         }
//     })
// }

// fetchCategoriesMenu()