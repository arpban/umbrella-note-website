'use strict';

var landingPage = $('.landing');
var dashboardPage = $('.dashboard');
var spinner = $('.loader');

function toggleSpinner() {
    spinner.toggleClass('active');
}

function postman() {
    $('.postman').toggleClass('open');
}

function showMessage(message) {
    $('.postman .body').html(message);
    postman();
    setTimeout(function () {
        $('.postman').removeClass('open');
    }, 7000);
}

function updateSpinnerMessage(message) {
    $('.loader .text').text(message);
}

function scrollpage(str) {
    $('html,body').animate({
        scrollTop: $(str).offset().top
    }, 'slow');
}

function activateInput() {
    console.log(event.target);
    $('.signup-form label').animate({ 'top': '0' });
    // $('.input-box input').css({"height": "auto"})
}

//SIGNUP
function signup(event) {
    console.log('signup init');
    event.preventDefault();
    updateSpinnerMessage('Thank you');
    toggleSpinner();
    var name = $('#signup-name').val();
    var email = $('#signup-email').val();
    var password = $('#signup-password').val();
    axios({
        method: 'post',
        url: pikachu + '/api/signup',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: {
            'name': name,
            'email': email,
            'password': password
        }
    }).then(function (response) {
        toggleSpinner();
        console.log(response);
        if (response.data == 'success') {
            $('.signin.modal input.email').val(email);
            $('.signin.modal input.password').val(password);
            signin(event);
            toggleModal('.signin.modal');
        }
        if (response.data == 'user exists') {
            showMessage('A user with that email address already exists.');
        }
    });
}

function signin(event) {
    updateSpinnerMessage('');
    toggleSpinner();
    event.preventDefault();
    var email = $('.signin.modal input.email').val();
    var password = $('.signin.modal input.password').val();
    // console.log(email, password)
    axios({
        method: 'post',
        url: pikachu + '/oauth/token',
        data: {
            grant_type: 'password',
            client_id: client_id,
            client_secret: client_secret,
            username: email,
            password: password,
            scope: ''
        }
    }).then(function (response) {
        if (response.status == 200) {
            localStorage.access_token = response.data.access_token;
            console.log(response.data.access_token);
            showMessage('😊 Welcome back');
            updateSpinnerMessage('Welcome');
            toggleModal('.signin.modal');
            toggleLanding();
            localStorage.signedIn = 'true';
            getUser();
            changeSignInStatus();
            // createLocalDbFromRemoteDb()            
        }
        toggleSpinner();
    }).catch(function (error) {
        showMessage('Unable to login 😢');
        toggleSpinner();
    });
}

function logout() {
    toggleSpinner();
    updateSpinnerMessage("Bye‍");
    axios({
        method: 'post',
        url: pikachu + '/api/logout',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.access_token
        },
        data: {
            client_id: client_id
        }
    }).then(function (response) {
        console.log(response.data);
        localStorage.signedIn = 'false';
        localStorage.access_token = ' ';
        showMessage('Logged Out');
        changeSignInStatus();
        updateUserDetailsView();
        toggleLanding();
        toggleSpinner();
    });
}

//GETTING USER INFORMATION
function getUser() {
    axios({
        method: 'get',
        url: pikachu + '/api/user',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.access_token
        }
    }).then(function (response) {
        console.log(response.data);
        localStorage.name = response.data.name;
        localStorage.premium = response.data.premium;
        localStorage.email = response.data.email;
        localStorage.id = response.data.id;
        updateUserDetailsView();
    });
}

function changeSignInStatus() {
    if (localStorage.signedIn == 'true') {
        $('header .login-signup-wrap').hide();
        $('.signout-buttons').show();
    } else {
        $('header .login-signup-wrap').show();
        $('.signout-buttons').hide();
    }
}

function updateUserDetailsView() {
    if (localStorage.signedIn == 'false') {
        $('.username').html('');
        $('.useremail').html('');
    } else {
        $('.username').html(localStorage.name);
        $('.useremail').html(localStorage.email);
    }
}

function toggleModal(x) {
    $(x).toggleClass('open');
}

function toggleLanding() {
    $('.landing').toggle();
    $('.dashboard').toggle();
}

function subscribe(e) {
    e.preventDefault();
    updateSpinnerMessage('');
    toggleSpinner();
    var email = $('#subscribe-email').val();
    axios({
        method: 'post',
        url: '/subscribe',
        data: {
            email: email
        }
    }).then(function (response) {
        if (response.status == 200) {
            showMessage('Thank you');
            updateSpinnerMessage('Thank you');
        }
        toggleSpinner();
    }).catch(function (error) {
        showMessage('Try again later');
        toggleSpinner();
    });
}

function download(e) {
    console.log('download');
    axios({
        method: 'post',
        url: '/download',
        data: {}
    }).then(function (response) {
        console.log('download init');
    });
}

function initUmbrella() {
    if (localStorage.signedIn == 'true') {
        toggleLanding();
        showMessage('Welcome back! 😊');
        updateUserDetailsView();
        changeSignInStatus();
    }

    setTimeout(function () {
        $('.buy-popup').addClass('open');
    }, 15000);
}

initUmbrella();