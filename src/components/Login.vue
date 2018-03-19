<template>
    <div class="login-container col-sm-offset-3 col-sm-6">
        <form class="form-horizontal" :id="this.signUp ? 'signUpForm' : 'signInForm'" @submit.prevent="onSubmit">
            <div class="form-group">
                <label class="col-sm-2 control-label">Email</label>
                <div class="col-sm-10">
                    <input type="email" class="form-control" id="email" v-model="email" placeholder="Email">
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">Password</label>
                <div class="col-sm-10">
                    <input type="password" class="form-control" id="password" v-model="password" placeholder="Password">
                </div>
            </div>
            <div v-if="signUp" class="form-group">
                <label class="col-sm-2 control-label">Confirm</label>
                <div class="col-sm-10">
                    <input type="password" class="form-control" id="confirmPassword" v-model="confirmPassword" placeholder="Confirm password">
                    <span id="helpBlockPassword" class="help-block">
                        <small class="text-danger">{{comparePasswords}}</small>
                    </span>
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-offset-2 col-sm-10">
                    <button v-if="signUp" type="submit" class="btn btn-default">Create your account</button>
                    <button v-else type="submit" class="btn btn-default">Sign in</button>
                </div>
            </div>
            <span class="text-danger">{{errorMessage}}</span>
        </form>
        <hr/>
        <div class="login-external-container">
            <h5 v-if="signUp" class="text-center">Already have an account ?
                <small>
                    <a @click="toggleSignUp()">Sign in</a>
                </small>
            </h5>
            <h5 v-else class="text-center">You don't have an account ?
                <small>
                    <a @click="toggleSignUp()">Create an account now</a>
                </small>
            </h5>
        </div>
    </div>
</template>

<script>
import * as firebase from "firebase";

// DB Refs initialize
let db = firebase.database()
const usersRef = db.ref("usr_users")

export default {
  name: "Login",

  store: ["user"],

  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      signUp: false,
      errorMessage: ""
    };
  },

  methods: {
    onSubmit(e) {
      this.errorMessage = "";
      if (e.target.id === "signInForm") {
        firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(user => {
              // Nothing
          })
          .catch(error => {
            this.errorMessage = error.message;
          });
      } else {
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(user => {
            // Nothing
              usersRef.child(user.uid).set({
                  role: 1000,
                  mail: this.email, // User role
              })
          })
          .catch(error => {
            console.log(error);
            this.errorMessage = error.message;
          });
      }
    },
    toggleSignUp() {
      this.signUp = !this.signUp;
    }
  },

  mounted() {},

  computed: {
    comparePasswords() {
      return this.password !== this.confirmPassword
        ? "Password do not match"
        : "";
    }
  },

  watch: {
    user(value) {
      if (value !== null && value !== undefined) {
        this.$router.push("/account");
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
