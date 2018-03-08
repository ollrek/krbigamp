<template>
  <div>
    <div>
      <!-- Editable Button -->
      <button @click="toggleEditing" type="button" class="close" aria-label="Edit">
        <i v-if="!isEditing" class="glyphicon glyphicon-pencil"></i>
        <i v-else class="glyphicon glyphicon-save"></i>
      </button>
      <!-- boo Template -->
      <div v-if="!isEditing" class="item-container">
        <h1 class="title">{{currentData.name}}
          <small>
            <a :href="'#/char/' + currentData.char">{{currentData.char}}</a>
          </small>
        </h1>
        <span class="">{{currentData.type}}</span>
        <div class="item-img" v-if="currentData.img">
          <img :src="currentData.img" />
        </div>
        <ul class="nav nav-pills">
          <li :class="{ 'active' : i === 1}" v-for="i in 6">
            <a :href="'#' + (i-1)" data-toggle="tab">{{i-1}}*</a>
          </li>
        </ul>

        <div class="tab-content clearfix">
          <div :class="{ 'active' : i === 1}" v-for="i in 6" class="tab-pane" :id="i-1">

            <h5 v-html="processText(currentData,i-1)"></h5>
          </div>

        </div>
      </div>
      <!-- Editing Template -->
      <div v-else>
        <form id="form" class="form-horizontal" v-on:submit.prevent="addItem">
          <div class="form-group">
            <label for="itemName" class="col-sm-1 control-label">Name</label>
            <div class="col-sm-5">
              <input type="text" id="itemName" class="form-control" v-model="currentData.name">
            </div>
          </div>
          <div class="form-group">
            <label for="itemType" class="col-sm-1 control-label">Type</label>
            <div class="col-sm-5">
              <select id="itemType" class="form-control" v-model="currentData.type">
                <option v-for="t in type">{{t}}</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="itemChar" class="col-sm-1 control-label">Char.</label>
            <div class="col-sm-5">
              <select id="itemChar" class="form-control" v-model="currentData.char">
                <option v-for="ch in chars">{{ch['name']}}</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="itemText" class="col-sm-1 control-label">Text</label>
            <div class="col-sm-11">
              <input type="text" id="itemText" class="form-control" v-model="currentData.text">
            </div>
          </div>
          <div class="form-group">
            <label for="itemImg" class="col-sm-1 control-label">Image</label>
            <div class="col-sm-11">
              <uploadable v-model="currentData.img" :parent-key="currentData.key" :prefix="item" db-ref="items"></uploadable>
            </div>
          </div>
          <div class="form-group">
            <label for="itemValues" class="col-sm-1 control-label">Values</label>
            <div class="col-sm-11">
              <textarea id="itemText" class="form-control" rows="3" v-model="valuesString"></textarea>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import { editableMixin } from "../mixins/editable";
import { itemMixin } from "../mixins/item";
import Uploadable from "./Uploadable.vue";

// DB Refs initialize
let db = firebase.database();
let itemsRef = db.ref("db_items");
let charsRef = db.ref("db_chars");

// Vars
let type = ["Unique Weapon", "Artifact"];

export default {
  name: "Item",

  components: { Uploadable },

  mixins: [editableMixin, itemMixin],

  props: ["name"],

  firebase: {
    item: itemsRef,
    chars: charsRef
  },

  data() {
    return {
      target: "db_items",
      type: type
    };
  },

  methods: {},

  mounted() {
    let self = this;

    itemsRef
      .orderByChild("name")
      .equalTo(this.name)
      .once("value", function(snapshot) {
        snapshot.forEach(function(child) {
          self.currentData = child.val();
          self.currentData.key = child.key;
        });
      });
  },

  computed: {
    valuesString: {
      get() {
        console.log(this.currentData.values);
        return JSON.stringify(this.currentData.values);
      },
      set(newVal) {
        console.log(newVal);
        this.currentData.values = JSON.parse(newVal);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.item-img {
  margin: 16px 0;
}

.tab-content {
  color: white;
  background-color: #337ab7;
  padding: 5px 15px;
  border-radius: 0 5px 5px;
}

.nav-pills > li > a {
  border-radius: 0;
}
</style>

