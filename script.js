const container = document.querySelector("main");
const addForm = document.forms.addForm;
const popupBlock = document.querySelector(".popup-wrapper");

let user = "ruszzt";
// let user = localStorage.getItem("ruszzt");
// if (!user) {
//     user = prompt("Введите имя пользователя")
//     localStorage.setItem("ruszzt", user)
// }

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

    card.append(img, name, del);
    parent.append(card);
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


popupBlock.querySelector(".popup__close").addEventListener("click", function() {
    popupBlock.classList.remove("active");
});

document.querySelector("#add").addEventListener("click", function(e) {
    e.preventDefault();
    popupBlock.classList.add("active");
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