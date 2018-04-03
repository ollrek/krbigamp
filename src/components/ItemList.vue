<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">Add New Item</h3>
      </div>
      <div class="panel-body">
         <form id="form" class="form-horizontal" v-on:submit.prevent="addItem">
          <div class="form-group">
            <label for="itemName" class="col-sm-1 control-label">Name</label>
            <div class="col-sm-5">
              <input type="text" id="itemName" class="form-control" v-model="newItem.name">
            </div>
          </div>
          <div class="form-group">
            <label for="itemType" class="col-sm-1 control-label">Type</label>
            <div class="col-sm-5">
            <select id="itemType" class="form-control" v-model="newItem.type">
              <option v-for="t in type">{{t}}</option>
            </select>
            </div>
          </div>
          <div class="form-group">
            <label for="itemChar" class="col-sm-1 control-label">Char.</label>
            <div class="col-sm-5">
            <select id="itemChar" class="form-control" v-model="newItem.char">
              <option v-for="ch in chars">{{ch['name']}}</option>
            </select>
            </div>
          </div>
          <div class="form-group">
            <label for="itemText" class="col-sm-1 control-label">Text</label>
            <div class="col-sm-11">
            <input type="text" id="itemText" class="form-control" v-model="newItem.text">
            </div>
          </div>
          <div class="form-group">
            <label for="itemValues" class="col-sm-1 control-label">Values</label>
            <div class="col-sm-11">
            <textarea id="itemText" class="form-control" rows="3" v-model="newItem.values"></textarea>
            </div>
          </div>
          <input type="submit" class="btn btn-primary" value="Add Item">
        </form>
      </div>
    </div>
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">Item List</h3>
      </div>
      <div class="panel-body">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Text</th>
              <th>Char</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items">
              <td><a :href="'#/item/' + item.slugName">{{item.name}}</a></td>
              <td>{{item.type}}</td>
              <td v-html="processText(item)"></td>
              <td>{{item.char}}</td>
              <td><span class="glyphicon glyphicon-trash" aria-hidden="true" v-on:click="removeItem(item)"></span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import toastr from "toastr"
import firebase from "firebase"
import { itemMixin } from '../mixins/item'

let db = firebase.database();
let itemsRef = db.ref("db_items");
let charsRef = db.ref("db_chars");
let type = ["Unique Weapon", "Artifact", "Treasure"];

export default {
  name: "ItemList",

  mixins: [itemMixin],

  firebase: {
    items: itemsRef,
    chars: charsRef
  },

  data() {
    return {
      newItem: {
        name: "",
        char: "",
        text: "",
        type: "",
        values: ""
      },
      type: type
    };
  },

  methods: {
    addItem: function() {
      this.newItem.values = JSON.parse(this.newItem.values);

      itemsRef.push(this.newItem);
      this.newItem.name = "";
      this.newItem.char = "";
      this.newItem.type = "";
      this.newItem.text = "";
      this.newItem.values = "";
      toastr.success("Item added successfully");
    },

    removeItem: function(item) {
      itemsRef.child(item[".key"]).remove();
      toastr.success("Item removed successfully");
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
</style>
