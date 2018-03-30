<template>
  <div class="commentable">
    {{ id }}
  </div>
</template>

<script>
import toastr from "toastr";
import firebase from "firebase";

let storage = firebase.storage();

export default {
  name: "Commentable",

  props: ["db-ref", "id", "selfish"],

  data() {
    return {
    };
  },

  methods: {
    
  },

  computed: {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
