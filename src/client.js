import * as sapper from '@sapper/app';

sapper.start({
	target: document.querySelector('#sapper')
});

const firebaseConfig = {
	apiKey: "AIzaSyCXf3_vwT9Udj3zzPRk-GnHl2fZt6w9cDo",
	authDomain: "coderbucks-20c6e.firebaseapp.com",
	projectId: "coderbucks-20c6e",
	storageBucket: "coderbucks-20c6e.appspot.com",
	messagingSenderId: "848652540460",
	appId: "1:848652540460:web:07b193d30ac2ec451ecf89",
	measurementId: "G-K0PRJL5H96"
  };
firebase.initializeApp(firebaseConfig);