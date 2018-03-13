<template>
    <div>
        <section id="about">
            <div class="container">
                <div class="row">
                    <div class="col-sm-8">
                        <h2>Welcome to <strong>Big Amp</strong></h2>
                        <p class="lead">Big Amp provides a generic platform to makes King's Raid players lifes' easier. The goal is to track your heroes and host easy-to-do builds for yourself and the community. The website is currently under development and will soon hit its beta stage. This site features:</p>
                        <ul>
                            <li>Simple and readable database for heroes and items</li>
                            <li>Easy platform to expose your roster to the community to ask help and find your priorities</li>
                            <li>Possibility to create and find builds for your favorites heroes</li>
                            <li>Interactive content providing upvotes and tips</li>
                            <li>And much more upcoming ...</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import firebase from "firebase";

let db = firebase.database();

export default {
  name: "Home",

  firebase: {},

  data() {
    return {};
  },

  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
