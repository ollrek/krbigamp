<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">Add New Chars</h3>
      </div>
      <div class="panel-body">
        <form id="form" class="form-inline" v-on:submit.prevent="addChar">
          <div class="form-row">
            <div class="form-group col-md-3">
              <label for="charName">Name:</label>
              <input type="text" id="charName" class="form-control" v-model="newChar.name">
            </div>
            <div class="form-group col-md-2">
              <label for="charClass">Class:</label>
              <select id="charClass" class="form-control" v-model="newChar.class">
                <option v-for="cl in classes" :value="$lodash.omit(cl,'.key')">{{cl.name}}</option>
              </select>
            </div>
            <div class="form-group col-md-2">
              <label for="charStar">Star:</label>
              <select id="charStar" class="form-control" v-model="newChar.star">
                <option v-for="i in 2">{{i+1}}*</option>
              </select>
            </div>
            <input type="submit" class="btn btn-primary" value="Add Char">
          </div>
        </form>
      </div>
    </div>
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">Char List</h3>
      </div>
      <div class="panel-body">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Class</th>
              <th>Star</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="char in chars">
              <td>
                <a :href="'#/char/' + char.slugName">{{char.name}}</a>
              </td>
              <td>{{char.class.name}} <img class="class-img" :src="char.class.image"/></td>
              <td>{{char.star}}</td>
              <td>
                <span class="glyphicon glyphicon-trash" aria-hidden="true" v-on:click="removeChar(char)"></span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import toastr from "toastr";
import firebase from "firebase";

let db = firebase.database();
let charsRef = db.ref("db_chars");
let classesRef = db.ref("db_enum_classes");

export default {
  name: "CharList",

  firebase: {
    chars: charsRef,
    classes: classesRef
  },

  data() {
    return {
      newChar: {
        name: "",
        class: "",
        star: ""
      }
      // books: {},
    };
  },

  methods: {
    addChar: function() {
      charsRef.push(this.newChar);
      this.newChar.name = "";
      this.newChar.class = "";
      this.newChar.star = "";
      toastr.success("Char added successfully");
    },

    removeChar: function(char) {
      charsRef.child(char[".key"]).remove();
      toastr.success("Char removed successfully");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.class-img {
  height: 20px;
}
</style>
