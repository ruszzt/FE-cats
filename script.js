const container = document.querySelector("main");

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

    card.append(img, name);
    parent.append(card);
}

fetch("https://sb-cats.herokuapp.com/api/2/ruszzt/show")
    .then(res => res.json())
    .then(result => {
        if (result.message === "ok") {
            console.log(result.data);
            result.data.forEach(function(el) {
                createCard(el, container);
            })
        }
    })

const cat = {
    id: 4,
    name: "Бандит",
    img_link: "https://chudo-prirody.com/uploads/posts/2021-08/1628781927_144-p-kot-bandit-foto-167.jpg"
}   

const addCat = function(e) {
    fetch("https://sb-cats.herokuapp.com/api/2/ruszzt/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cat)
    })
        .then(res => res.json())
        .then(data => {
            if(data.message === "ok") {
                createCard(cat, container);
            }
        })
}

document.querySelector("#add").addEventListener("click", function(e) {
    e.preventDefault();
    addCat();
})