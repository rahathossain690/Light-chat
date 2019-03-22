const firstPage = document.getElementById("first");
const signInPage = document.getElementById("login");
const signUpPage = document.getElementById("signup");
const mainPage = document.getElementById("main");
const upEmail = document.getElementById("signupemail");
const upPass = document.getElementById("signuppassword");
const inEmail = document.getElementById("signinemail");
const inPass = document.getElementById("signinpassword");
const errorIn = document.getElementById("errorIn");
const errorUp = document.getElementById("errorUp");
const database = firebase.database();
const auth = firebase.auth();
const textarea = document.getElementById("text");
const messageBody = document.getElementById("msg");
const confirm = document.getElementById("confirm");
var user = ""; 
var totalMessage = 1;

function firstPageSignUp(){
	firstPage.classList.add("hide");
	signUpPage.classList.remove("hide");
}

function firstPageSignIn(){
	firstPage.classList.add("hide");
	signInPage.classList.remove("hide");
}

function signIn(){
	const email = inEmail.value.trim();
	const pass = inPass.value.trim();
	var promise = firebase.auth().signInWithEmailAndPassword(email, pass);
	var done = 1;
	promise.catch( e => {
		errorIn.innerHTML = e.message;
		done = 0;
	});
	if(done) inEmail.value = "", inPass.value = "", errorIn.innerHTML = "";
}

function back(){
	signInPage.classList.add("hide");
	signUpPage.classList.add("hide");
	firstPage.classList.remove("hide");
	upEmail.value = "", upPass.value = "";
	inEmail.value = "", inPass.value = "";
}

function signUp(){
	const email = upEmail.value.trim();
	const pass = upPass.value.trim();
	var repass = confirm.value.trim();
	if(pass != repass) {
		errorUp.innerHTML = "Passwords not matched.";
		return;
	}
	var promise = firebase.auth().createUserWithEmailAndPassword(email, pass);
	var done = 1;
	promise.catch( e => {
		errorUp.innerHTML = e.message;
		done = 0;
	});
	if(done) upEmail.value = "", upPass.value = "", errorUp.innerHTML = "";
}

function logOut(){
	auth.signOut();
	mainPage.classList.add("hide");
	firstPage.classList.remove("hide");
}
firebase.auth().onAuthStateChanged(fireUser => {
	if(fireUser){
		signInPage.classList.add("hide");
		signUpPage.classList.add("hide");
		firstPage.classList.add("hide");
		mainPage.classList.remove("hide");
		user = fireUser.email;
	}
	else{
		signInPage.classList.add("hide");
		signUpPage.classList.add("hide");
		firstPage.classList.remove("hide");
		mainPage.classList.add("hide");
	}
});

function Input(i){
	database.ref("message/" + i + "").on('value', snap => {
		if(snap.val().sender != user)textarea.innerHTML += '<div class="message"><p class="hayre"><i>' + snap.val().sender + '</i> : </p>' + snap.val().msgText + '</div><br>';
		else textarea.innerHTML += '<div class="messageMe"><p class= "hayre"><i>' + snap.val().sender + '</i> : </p>' + snap.val().msgText + '</div><br>';
	});
}

database.ref("totalMessages").on('value', snap => {
	textarea.innerHTML = "";
	totalMessage = snap.val() - "0";
	for(var i = 1; i <= totalMessage; i++){
		Input(i);
	}
});

function send(){
	var textToSend = messageBody.value.trim();
	if(textToSend != ""){
	var k = totalMessage + 1;
	firebase.database().ref('message/' + k + "").set({
    	msgText: textToSend,
    	sender: user
  		});
		firebase.database().ref("totalMessages").set(k);
	}
	messageBody.value = "";
}