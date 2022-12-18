const container = document.querySelector("main");
const addForm = document.forms.addForm;
const updForm = document.forms.updForm;
const popupBlock = document.querySelector(".popup-wrapper");
const popupAdd = popupBlock.querySelector(".popup-add");
const popupUpd = popupBlock.querySelector(".popup-upd");
const cardShowBlock = document.querySelector(".cardShowBlock");

// let user = "ruszzt";
let user = localStorage.getItem("UserCat");
if (!user) {
    user = prompt("Введите имя пользователя")
    localStorage.setItem("UserCat", user)
}

const createCard = function(cat, parent) {
    const card = document.createElement("div");
    card.className = "card";


    const img = document.createElement("div");
    img.className = "card-pic";
    if (cat.img_link) {
        img.style.backgroundImage = `url(${cat.img_link})`;
    } else {
        img.style.backgroundImage = `url(img/default3.png)`;
        img.style.backgroundSize = "contain";
        img.style.backgroundColor = "transparent";
    }

    const name = document.createElement("h3");
    name.innerText = cat.name;
    

    const del = document.createElement("button");
    del.innerText = "аннигилировать";
    del.id = cat.id;
    del.addEventListener("click", function(e) {
        let id = e.target.id;
        deleteCat(id, card);
    });

    const upd = document.createElement("button");
    upd.innerText = "изменить";
    upd.addEventListener("click", function(e) {
        popupUpd.classList.add("active");
        popupBlock.classList.add("active");
        showForm(cat);
        updForm.setAttribute("data-id", cat.id);
    });

    card.append(img, name, del, upd);
    parent.append(card);

    let catCard = document.querySelectorAll(".card-pic");
    
    for (let i = 0; i < catCard.length; i++) {
        
        catCard[i].addEventListener("click", function() {
            cardShowBlock.classList.add("active");
        })
        
    }
}

const showForm = function(data) {
    for (let i = 0; i < updForm.elements.length; i++) {
        let el = updForm.elements[i];
        if (el.name) {
            if (el.type !== "checkbox") {
                el.value = data[el.name] ? data[el.name] : "";
            } else {
                el.checked = data[el.name];
            }
        }
    }
}

fetch(`https://sb-cats.herokuapp.com/api/2/${user}/show`)
    .then(res => res.json())
    .then(result => {
        if (result.message === "ok") {
            console.log(result.data);
            result.data.forEach(function(el) {
                createCard(el, container);
            })
        }
    })

// const cat = {
//     id: 4,
//     name: "Бандит",
//     img_link: "https://chudo-prirody.com/uploads/posts/2021-08/1628781927_144-p-kot-bandit-foto-167.jpg"
// }   

const addCat = function(cat) {
    fetch(`https://sb-cats.herokuapp.com/api/2/${user}/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cat)
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if(data.message === "ok") {
                createCard(cat, container);
                addForm.reset();
                popupBlock.classList.remove("active");
            }
        })
}

const deleteCat = function(id, tag) {
    fetch(`https://sb-cats.herokuapp.com/api/2/${user}/delete/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
        if(data.message === "ok") {
            tag.remove();
        }
    })
}


popupBlock.querySelectorAll(".popup__close").forEach(function(btn) {
    btn.addEventListener("click", function() {
        popupBlock.classList.remove("active");
        btn.parentElement.classList.remove("active");
        if (btn.parentElement.classList.contains("popup-upd")) {
            updForm.dataset.id = "";
        }
    });
});

document.querySelector("#add").addEventListener("click", function(e) {
    e.preventDefault();
    popupBlock.classList.add("active");
    popupAdd.classList.add("active");
});



addForm.addEventListener("submit", function(e) {
    e.preventDefault();
    let body = {};

    for (let i = 0; i < addForm.elements.length; i++) {
        let el = addForm.elements[i];
        if (el.name) {
            body[el.name] = el.name === "favourite" ? el.checked : el.value
        }
    }
    addCat(body);
});

updForm.addEventListener("submit", function(e) {
    e.preventDefault();
    let body = {};

    for (let i = 0; i < this.elements.length; i++) {
        let el = this.elements[i];
        if (el.name) {
            body[el.name] = el.name === "favourite" ? el.checked : el.value
        }
    }
    delete body.id;
    updCat(body, updForm.dataset.id);
});

const updCat = async function(obj, id) {
    let res = await fetch(`https://sb-cats.herokuapp.com/api/2/${user}/update/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "appLication/json",
        },
        body: JSON.stringify(obj)
    })
    let answer = await res.json();
    if (answer.message === "ok") {
        updForm.reset();
        updForm.dataset.id = "";
        popupUpd.classList.remove("active");
        popupBlock.classList.remove("active");
    }
}

cardShowBlock.querySelector(".cardShow__close").addEventListener("click", function() {
    cardShowBlock.classList.remove("active");
});

// document.querySelector(".card").addEventListener("click", function(e) {
//     e.preventDefault();
//     cardShowBlock.classList.add("active");
// })