importScripts('https://www.gstatic.com/firebasejs/7.2.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.2.3/firebase-messaging.js');


firebase.initializeApp({
    'messagingSenderId': '164107643204'
 });
// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();


// messaging.setBackgroundMessageHandler(function (payload) {
//     console.log('[firebase-messaging-sw.js] Received background message ', payload);
//     // Customize notification here
//     const notificationTitle = 'Background Message Title';
//     const notificationOptions = {
//         body: 'Background Message body.',
//         icon: '/itwonders-web-logo.png'
//     };

//     return self.registration.showNotification(notificationTitle,
//         notificationOptions);
// });