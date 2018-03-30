<template>
  <div id="app" class="container">
    <div class="page-header">
      <Header/>
    </div>
    <router-view />
    <div class="page-footer">
      <Footer/>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import Header from "./components/Header";
import Footer from "./components/Footer";

import store from "./store";

let config = {
  apiKey: "AIzaSyAlhg987VMlTrMG05h0ndLQg2ls7d7pqHQ",
  authDomain: "king-s-raid-db.firebaseapp.com",
  databaseURL: "https://king-s-raid-db.firebaseio.com",
  projectId: "king-s-raid-db",
  storageBucket: "gs://king-s-raid-db.appspot.com"
};

// Initialize DB
firebase.initializeApp(config);
const db = firebase.database();
const usersRef = db.ref("usr_users");

export default {
  name: "app",

  store: ["user"],

  data() {
    return {
      hasLoaded: false
    };
  },

  methods: {},

  components: {
    Header,
    Footer
  },

  mounted() {
    // Initialize Auth
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        let initUser = {};
        // initUser.firebase = user
        initUser.email = user.email;
        initUser.key = user.uid;

        usersRef
          .child(user.uid)
          .once("value")
          .then(function(snapshot) {
            initUser = Object.assign({}, initUser, snapshot.val());
            return initUser;
          })
          .then(initUser => {
            this.user = initUser;
            this.hasLoaded = true;
          });
      } else {
        this.user = null;
      }
    });
  },

  beforeMount: function() {
    document.title = "Big Amp";
  }
};
</script>
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 20px;
}

.page-header {
  border: none;
}
</style>