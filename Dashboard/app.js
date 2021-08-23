var userUID = "";
var userName = "";
var items = ""

// Idhar se UID ani ha or verify kr nah ke user apna ha ya nai

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log("user is signed in at Todo");
        userUID = user.uid;
    } else {
        alert(
            "Your login session has expired or you have logged out, login again to continue"
        );
        location = "../index.html";
    }
});

// yahn se user ki UID Leni or us name show kr nah

firebase.auth().onAuthStateChanged((user) => {
    const username = document.getElementById("username");
    if (user) {
        firebase.firestore().collection("users")
            .doc(user.uid)
            .get()
            .then((snapshot) => {
                // console.log(snapshot.data().Name);
                username.innerText = snapshot.data().userFullName;
            });
    } else {
        // console.log('user is not signed in to retrive username');
    }
});

function logout() {
    firebase
        .auth()
        .signOut()
        .then(() => {
            location.href = "../auth/index.html";
        })
        .catch((error) => {
            // An error happened.
        });
    return false;
}

//yahn pe mene saman firebase me dala ha

function addItem(ev) {
    ev.preventDefault();
    itemName = document.getElementById("itemName").value;
    price = document.getElementById("price").value;
    category = document.getElementById("category").value;
    delivery = document.getElementById("delivery").value;

    var date = new Date().toLocaleDateString();
    // var uid = Date.now().toString(36) + Math.random().toString(36).substr(2)
    var item = {
        itemName,
        price,
        category,
        delivery,
        // uid: uid
    };
    console.log(item)
        // saving to db
    var db = firebase.firestore().collection(`items`);
    db.add(item)
        .then(() => {
            console.log("todo added!");
            getTodos()
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    return false;
};


// yahn se itmes laon ga me


function getTodos() {
    items = [];
    todoKeys = [];
    var docRef = firebase
        .firestore()
        .collection(`items`);

    docRef
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
                document.getElementById("addedItems").innerHTML = "";
                console.log(items);
                items.forEach((item, index) => {
                    document.getElementById("addedItems").innerHTML += `
                     <div class="card" style="width: 18rem;">
                                <div class="card-body">
                                <h5 class="card-title">${index + 1}</h5>
                                <h5 class="card-title">${item.itemName}</h5>
                                <h6 class="card-title">${item.price}</h6>
                                </div>
                     </div>
                     
                     `;

                });
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}