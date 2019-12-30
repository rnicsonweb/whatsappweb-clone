const firebase = require('firebase');
require('firebase/firestore');


export class Firebase {

    constructor(){

        this._config = {
            apiKey: "AIzaSyA7Ck4cv1N6MGtvu-1Tvl-abBMsYCVOKek",
            authDomain: "whatsapp-clone-799f8.firebaseapp.com",
            databaseURL: "https://whatsapp-clone-799f8.firebaseio.com",
            projectId: "whatsapp-clone-799f8",
            storageBucket: "gs://whatsapp-clone-799f8.appspot.com",
            messagingSenderId: "892668592187"
          };

        this.init();
    }

    init(){

        if(!window._initializedFirebase) {

            firebase.initializeApp(this._config);

            firebase.firestore().settings({

                timestampsInSnapshots: true

            });

            window._initializedFirebase = true;
        }


    }

    static db(){
        return firebase.firestore();
    }

    static hd(){
        return firebase.storage();
    }

    initAuth(){

        return new Promise((s, f)=>{

            let provider = new firebase.auth.GoogleAuthProvider();


            firebase.auth().signInWithPopup(provider)
            .then(result=>{
                let token = result.credential.accessToken;
                let user = result.user;

                s({
                    user,
                    token
                });
            })
            .catch(err=>{
                f(err);
            });

        });

    }


}