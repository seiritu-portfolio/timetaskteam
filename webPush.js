import 'firebase/messaging';
import firebase from 'firebase/app';
import localforage from 'localforage';

const firebaseCloudMessaging = {
  tokenInlocalstorage: async () => {
    return localforage.getItem('fcm_token');
  },
  init: async function () {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        messagingSenderId: '498542936471',
      });
      try {
        const messaging = firebase.messaging();
        const tokenInLocalForage = await this.tokenInlocalforage();

        if (tokenInLocalForage !== null) {
          return tokenInLocalForage;
        }
        const status = await Notification.requestPermission();
        if (status && status === 'granted') {
          // getting token from FCM
          const fcm_token = await messaging.getToken();

          if (fcm_token) {
            localforage.setItem('fcm_token', token);

            return token;
          }
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  },
};

export { firebaseCloudMessaging };
