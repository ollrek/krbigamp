<template>
    <div>
        <!-- Editable Button -->
        <button @click="toggleEditing" v-if="isOwner" type="button" class="close" aria-label="Edit">
            <i v-if="!isEditing" class="glyphicon glyphicon-pencil"></i>
            <i v-else class="glyphicon glyphicon-save"></i>
        </button>
        <!-- Template -->
        <div v-if="!isEditing" class="custom-container">
            <h1 class="custom-title">
                {{currentData.title}}
            </h1>
            <div class="custom-img" v-if="currentChar">
                <img :src="currentChar.img" />
            </div>
            <div class="info-container">
                <div class="row">
                    <div class="col-md-2">
                        <strong>
                            <span v-if="type === 'builds'">Recommended</span> UW
                        </strong>
                    </div>
                    <div class="col-md-3">
                        {{currentData.uw === '-1' ? 'No' : currentData.uw + '*'}}
                    </div>
                    <div class="col-md-2 col-md-offset-1">
                        <strong>
                            <span v-if="type === 'builds'">Recommended</span> UW
                        </strong>
                    </div>
                    <div class="col-md-3">
                        {{currentData.uw === '-1' ? 'No' : currentData.uw + '*'}}
                    </div>
                </div>
                <hr/>
                <div class="row">
                    <div class="col-md-4">
                        <h4>Runes</h4>
                        <ul class="custom-runes">
                            <li v-for="elt in Object.keys(runesRef)" :key="elt">
                                <img style="vertical-align:middle" :src="require('../assets/icons/runes/'+ elt+'.png')">
                                <span class="text-capitalize">
                                    <strong>{{elt}}</strong>
                                </span>
                                <span v-for="(r, index) in currentData.runes" v-if="elt === r.type" :key="index">{{r.value}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="col-md-4 custom-gear">
                        <h4>Gear</h4>
                        <!-- <ul class="custom-runes">
                            <li v-for="elt in Object.keys(runesRef)" :key="elt"> -->
                        <!-- <img style="vertical-align:middle" :src="require('../assets/icons/runes/'+ elt+'.png')"> -->
                        <div class="custom-acc">
                            <span class="text-capitalize">
                                {{currentData.acc}}
                            </span>
                        </div>
                        <div class="custom-sets">
                            <ul>
                                <li v-for="(s, index) in currentData.sets" :key="index">
                                    <!-- <img style="vertical-align:middle" :src="require('../assets/icons/runes/'+ elt+'.png')"> -->
                                    <span class="text-capitalize">
                                        {{s.type}} <strong>{{s.value}}p</strong>
                                    </span>
                                    <!-- <span v-for="(r, index) in currentData.runes" v-if="elt === r.type" :key="index">{{r.value}}</span> -->
                                </li>
                            </ul>
                        </div>
                        <!-- <span v-for="(r, index) in currentData.runes" v-if="elt === r.type" :key="index">{{r.value}}</span> -->
                        <!-- </li>
                        </ul> -->
                    </div>
                    <div class="col-md-4 custom-artifact">
                        <h4>Artifact</h4>
                        <!-- <ul class="custom-runes">
                            <li v-for="elt in Object.keys(runesRef)" :key="elt"> -->
                        <img style="vertical-align:middle" v-if="currentArtifact" :src="currentArtifact.img">
                        <span>
                            {{currentData.artifact}}
                        </span>
                        <!-- <span v-for="(r, index) in currentData.runes" v-if="elt === r.type" :key="index">{{r.value}}</span> -->
                        <!-- </li>
                        </ul> -->
                    </div>
                </div>
                <!-- <div class="col-md-2">
                        <strong>Guild</strong>
                    </div>
                    <div class="col-md-3">{{currentData.guild}}</div>
                </div>
                <div class="row">
                    <div class="col-md-2">
                        <strong>Waifu/Husbando
                            <span class="glyphicon glyphicon-heart" />
                        </strong>
                    </div>
                    <div class="col-md-3">
                        <a :href="'/#/char/' + currentData.waifu">{{currentData.waifu}}</a>
                    </div> -->

            </div>
        </div>
        <!-- Editing -->
        <div class="form-horizontal" v-else>
            <div class="form-group">
                <label for="customTitle" class="col-sm-2 control-label">Title</label>
                <div class="col-sm-5">
                    <span :disabled="true" v-if="type === 'roster'" class="form-control">{{currentData.title}}</span>
                    <input v-else type="text" id="customTitle" class="form-control" v-model="currentData.title">
                </div>
            </div>
            <div class="form-group">
                <label for="customChar" class="col-sm-2 control-label">Char</label>
                <div class="col-sm-5">
                    <select :disabled="type === 'roster'" id="customChar" class="form-control" v-model="currentData.char">
                        <option v-for="c in chars" :value="c.name" :key="c['.key']">{{c.name}}</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="customUW" class="col-sm-2 control-label">
                    <span v-if="type === 'builds'">Recommended</span> UW</label>
                <div class="col-sm-5">
                    <select id="customUW" class="form-control" v-model="currentData.uw">
                        <option value="-1">No</option>
                        <option v-for="c in 6" :value="c-1" :key="c-1">{{c-1}}*</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="customAcc" class="col-sm-2 control-label">Accessory</label>
                <div class="col-sm-5">
                    <select id="customAcc" class="form-control" v-model="currentData.acc">
                        <option v-for="c in accessoriesRef" :value="c" :key="c">{{c}}</option>
                    </select>
                </div>
            </div>
            <div class="form-inline form-group">
                <label for="customRunes" class="col-sm-2 control-label">Runes</label>
                <div class="col-sm-5">
                    <li v-for="(r, index) in currentData.runes" v-bind:key="index">
                        <select class="form-control text-capitalize" v-model="r.type">
                            <option :disabled="max === 0" v-for="(max, rt) in runesMax()" :value="rt" :key="rt">{{rt}}</option>
                        </select>
                        <select v-if="r.type" class="col-sm-offset-1 form-control" v-model="r.value">
                            <option v-for="rv in runesRef[r.type]" :value="rv" :key="rv">{{rv}}</option>
                        </select>
                        <button @click="removeElement('runes',index)" type="button" class="col-sm-offset-1 btn btn-default delete" aria-label="Delete Rune">
                            <i class="glyphicon glyphicon-trash"></i>
                        </button>
                    </li>
                    <button v-if="currentData.runes.length < 5" @click="addElement('runes')" type="button" class="close add" aria-label="Add Rune">
                        <i class="glyphicon glyphicon-plus"></i>
                    </button>
                </div>
            </div>
            <div class="form-inline form-group">
                <label for="customSets" class="col-sm-2 control-label">Sets</label>
                <div class="col-sm-5">
                    <li v-for="(s, index) in currentData.sets" :key="index">
                        <select class="form-control text-capitalize" v-model="s.type">
                            <option v-for="st in setsRef" :value="st" :key="st">{{st}}</option>
                        </select>
                        <select v-if="s.type" class="col-sm-offset-1 form-control" v-model="s.value">
                            <option v-if="(sv-1) % 2 === 0" :disabled="sv-1 > (setsMax() + s.value)" v-for="sv in 5" :value="sv-1" :key="sv-1">{{sv-1}}</option>
                        </select>
                        <button @click="removeElement('sets',index)" type="button" class="col-sm-offset-1 btn btn-default delete" aria-label="Delete Set">
                            <i class="glyphicon glyphicon-trash"></i>
                        </button>
                    </li>
                    <button v-if="currentData.sets.length < 2" @click="addElement('sets')" type="button" class="close add" aria-label="Add Set">
                        <i class="glyphicon glyphicon-plus"></i>
                    </button>
                </div>
            </div>
            <div class="form-inline form-group">
                <label for="customSets" class="col-sm-2 control-label">Statlines</label>
                <div class="col-sm-5">
                    <li v-for="(stat, index) in currentData.stats" :key="index">
                        <select class="form-control text-capitalize" v-model="stat.type">
                            <option v-for="statt in statsRef" :value="statt" :key="statt">{{statt}}</option>
                        </select>
                        <select v-if="stat.type" class="col-sm-offset-1 form-control" v-model="stat.value">
                            <option v-for="statv in 5" :value="statv-1" :key="statv-1">{{statv-1}}</option>
                        </select>
                        <button @click="removeElement('stats',index)" type="button" class="col-sm-offset-1 btn btn-default delete" aria-label="Delete Stat">
                            <i class="glyphicon glyphicon-trash"></i>
                        </button>
                    </li>
                    <button @click="addElement('stats')" type="button" class="close add" aria-label="Add Stat">
                        <i class="glyphicon glyphicon-plus"></i>
                    </button>
                </div>
            </div>
            <div class="form-group">
                <label for="customTrans" class="col-sm-2 control-label">Transcendence</label>
                <div class="col-sm-5">
                    <div title="_" class="row trans-container">
                        <div data-title="one" v-for="(t, transIndex) in transRef" :key="transIndex" :id="transIndex" @click="transToggle(transIndex)" :class="{active: currentData.trans && currentData.trans[transIndex] && currentData.trans[transIndex].active === true}" class="trans-perk col-sm-3">
                            <img class="trans-perk-image" v-if="t.img" :src="t.img">
                            <img v-else src="http://placehold.it/50x50&text=TBC">
                            <div class="tooltip-template">
                                <p>
                                    <strong>{{t.name}}</strong>
                                </p>
                                <p>{{t.text}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="type === 'builds'" class="form-group">
                <label for="customContents" class="col-sm-2 control-label">Contents</label>
                <div class="col-sm-5">
                    <multiselect v-model="contentValues" tag-placeholder="Add this as new content" placeholder="Search or add a content" track-by=".key" label="name" :options="contentTags" :multiple="true" :taggable="true" @tag="addContent">
                    </multiselect>
                </div>
            </div>
            <div v-if="type === 'builds'" class="form-group">
                <label for="customArtifacts" class="col-sm-2 control-label">Artifacts</label>
                <div class="col-sm-5">
                    <multiselect v-model="artifactValues" placeholder="Search or add an artifact" track-by=".key" label="name" :options="artifactTags" :multiple="true">
                    </multiselect>
                </div>
            </div>
            <div v-else class="form-group">
                <label for="customArtifact" class="col-sm-2 control-label">Artifact</label>
                <div class="col-sm-5">
                    <select id="customAcc" class="form-control" v-model="currentData.artifact">
                        <option v-for="a in artifactTags" :value="a.name" :key="a.name">{{a.name}}</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from "firebase";
import tippy from "tippy.js";
import Multiselect from "vue-multiselect";
import { editableMixin } from "../mixins/editable";

let db = firebase.database();
// Dbs
const charsRef = db.ref("db_chars");
const contentTagsRef = db.ref("db_content_tags");
const artifactTagsRef = db
  .ref("db_items")
  .orderByChild("type")
  .equalTo("Artifact");

// Enums
let accessories = ["Earrings", "Bracelet", "Necklace", "Ring"];
let runes = {
  weapon: ["ATK"],
  chest: ["Crit"],
  offpiece: ["Crit DMG"]
};
let sets = ["Black", "Ice", "Fire", "Poison", "Ancient", "Manticore"];
let statlines = ["ATK", "Max HP", "Crit", "Crit DMG"];

export default {
  name: "Custom",

  store: ["user"],

  mixins: [editableMixin],

  components: { Multiselect },

  props: ["type", "id", "targetChar"],

  firebase: {
    chars: charsRef,
    contentTags: contentTagsRef,
    artifactTags: artifactTagsRef
  },

  data() {
    return {
      target: "usr_" + this.type,
      selfEditable: true,
      key: "",
      redirectUrl: "/custom/" + this.type + "/",
      accessoriesRef: accessories,
      runesRef: runes,
      setsRef: sets,
      statsRef: statlines,
      transRef: []
    };
  },

  methods: {
    addElement: function(type) {
      this.currentData[type].push({
        type: "",
        value: ""
      });
    },
    removeElement: function(type, index) {
      this.currentData[type].splice(index, 1);
    },
    setsMax: function() {
      let max = 4;
      for (const s of this.currentData.sets) {
        max = s.value ? max - s.value : max;
      }

      return max;
    },
    runesMax: function() {
      let values = {
        weapon: 3,
        chest: 1,
        offpiece: 1
      };
      for (const r of this.currentData.runes) {
        if (r.type) values[r.type] = values[r.type] - 1;
      }

      return values;
    },
    transToggle: function(transIndex) {
      if (!this.currentData.trans) this.$set(this.currentData, "trans", {});
      if (!this.currentData.trans[transIndex])
        this.$set(this.currentData.trans, transIndex, { active: false });

      this.currentData.trans[transIndex].active = !this.currentData.trans[
        transIndex
      ].active;
    },
    addContent(newTag) {
      let tag = {
        name: newTag
      };

      if (!this.currentData.contents)
        this.$set(this.currentData, "contents", []);

      this.currentData.contents.push(tag);
      contentTagsRef.push(JSON.parse(JSON.stringify(tag)));
    }
  },

  computed: {
    isOwner() {
      return (
        this.id === "new" ||
        (this.user && this.currentData.ownerId === this.user.key)
      );
    },
    contentValues: {
      get() {
        return this.currentData.contents;
      },
      set(newVal) {
        this.currentData.contents = this.$lodash.map(
          newVal,
          this.$lodash.partialRight(this.$lodash.pick, "name")
        );
      }
    },
    artifactValues: {
      get() {
        return this.currentData.artifacts;
      },
      set(newVal) {
        this.currentData.artifacts = this.$lodash.map(
          newVal,
          this.$lodash.partialRight(this.$lodash.pick, "name")
        );
      }
    },
    currentChar() {
      return this.currentData.char
        ? this.chars.find(char => {
            return char.name === this.currentData.char;
          })
        : null;
    },
    currentArtifact() {
      return this.currentData.artifact
        ? this.artifactTags.find(art => {
            return art.name === this.currentData.artifact;
          })
        : null;
    }
  },

  watch: {
    "currentData.char": function(val) {
      const self = this;
      charsRef
        .orderByChild("name")
        .equalTo(this.currentData.char)
        .once("value", function(snapshot) {
          snapshot.forEach(function(child) {
            self.transRef = child.val().trans;
          });
        });
    }
  },

  beforeMount() {
    const self = this;

    if (this.id === "new") {
      if (!this.user || !this.user.key) {
        this.$router.push("/login");
      }
      this.toggleEditing();
      this.currentData.ownerId = this.user.key;
      this.$set(self.currentData, "runes", []);
      this.$set(self.currentData, "sets", []);
      this.$set(self.currentData, "stats", []);

      if (this.type === "roster" && this.targetChar) {
        this.currentData.char = this.targetChar;
        this.currentData.title =
          (this.user.pseudo || this.user.email) + "'s " + this.currentData.char;
      }
    } else if (this.id) {
      db
        .ref("usr_" + this.type)
        .child(this.id)
        .once("value")
        .then(function(snapshot) {
          self.currentData = snapshot.val();
          self.key = snapshot.key;

          if (!self.currentData.runes) self.$set(self.currentData, "runes", []);
          if (!self.currentData.sets) self.$set(self.currentData, "sets", []);
          if (!self.currentData.stats) self.$set(self.currentData, "stats", []);
        });
    }
  },

  mounted() {
    // Tooltips
    tippy(".trans-container", {
      target: ".trans-perk",
      appendTo: document.body.querySelector(".trans-container"),
      onShow(instance) {
        const content = this.querySelector(".tippy-content");
        content.innerHTML = document.body.querySelector(
          "#" + instance.reference.id + " .tooltip-template"
        ).innerHTML;
      }
    });
    window.tippy = tippy;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
li {
  list-style: none;
}

.close.add {
  margin-top: 2px;
  float: none;
}

.form-inline select {
  margin-bottom: 3px;
}

.trans-container .tooltip-template {
  display: none;
}

.trans-perk {
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
}

.trans-perk.active {
  -webkit-filter: grayscale(0%);
  filter: grayscale(0%);
}

.info-container {
  margin: 10px 0;
}

.custom-runes, .custom-gear ul {
  padding: 0;
}

.custom-gear .custom-acc {
    margin-bottom: 10px;
    line-height: 32px;
}

.custom-runes li {
  margin-bottom: 5px;
}

.custom-runes img,
.custom-artifact img {
  margin-right: 15px;
  max-height: 32px;
  max-width: 32px;
}

.custom-runes li span {
  margin-right: 5px;
}

.custom-runes li span.text-capitalize {
  display: inline-block;
  min-width: 60px;
}
</style>

<style>
.trans-container .tippy-tooltip .tippy-content {
  text-align: left;
  margin: 15px;
  font-size: 14px;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
