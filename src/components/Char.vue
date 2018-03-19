<template>
    <div>
        <!-- Editable Button -->
        <button @click="toggleEditing" type="button" class="close" aria-label="Edit">
            <i v-if="!isEditing" class="glyphicon glyphicon-pencil"></i>
            <i v-else class="glyphicon glyphicon-save"></i>
        </button>
        <!-- Template -->
        <div v-if="!isEditing" class="char-container">
            <h1 class="title">{{currentData.name}}
                <small>{{currentData.subname}}</small>
                <img class="class-img" v-if="currentData.class" :src="currentData.class.image" />
            </h1>
            <div class="char-img" v-if="currentData.img">
                <img :src="currentData.img" />
            </div>
            <div class="hero-container">
                <h3>Hero Information</h3>
                <div class="row">
                    <div class="col-md-2">
                        <strong>Class</strong>
                    </div>
                    <div v-if="currentData.class" class="col-md-3">{{currentData.class.name}}</div>
                    <div class="col-md-2">
                        <strong>Native</strong>
                    </div>
                    <div class="col-md-3">{{currentData.star}}</div>
                </div>
                <div class="row">
                    <div class="col-md-2">
                        <strong>DMG. Type</strong>
                    </div>
                    <div class="col-md-3">{{currentData.dmgType}}</div>
                    <div class="col-md-2">
                        <strong>Position</strong>
                    </div>
                    <div class="col-md-3">{{currentData.position}}</div>
                </div>
                <div class="row">
                    <div class="col-md-2">
                        <strong>Unique Weapon</strong>
                    </div>
                    <div class="col-md-5">
                        <a :href="'#/item/' + weapon.name">{{weapon.name}}</a>
                    </div>
                </div>
                <div v-if="currentData.tags" class="row">
                    <div class="col-md-2">
                        <strong>Tags</strong>
                    </div>
                    <div class="col-md-5">
                        <span v-for="tag in currentData.tags" class="label label-default">{{tag.name}}</span>
                    </div>
                </div>
            </div>
            <h3>Skills</h3>
            <ul class="nav nav-pills">
                <li v-if="Object.keys(skill).length" :class="{ 'active' : skillIndex === 's'+1}" v-for="(skill, skillIndex) in currentData.skills" :key="skillIndex">
                    <a :href="'#s' + (skillIndex)" data-toggle="tab">Skill {{skillIndex}}</a>
                </li>
            </ul>
            <div class="tab-content clearfix">
                <div class="panel panel-default">
                    <div v-if="Object.keys(skill).length" :class="{ 'active' : skillIndex === 's'+1}" v-for="(skill, skillIndex) in currentData.skills" class="tab-pane panel-body skill-container" :id="'s'+skillIndex" :key="skillIndex">
                        <h4>{{skill.name}}</h4>
                        <div class="char-img" v-if="skill.img">
                            <img :src="skill.img" />
                        </div>
                        <div class="skill-mana">
                            <span class="mana" :style="'width:'+skill.mana*18+'px;'"></span>
                            <span>
                                <strong>({{skill.mana}})</strong> mana</span>
                        </div>
                        <div class="skill-cooldown">
                            <img style="vertical-align:middle" src="@/assets/icons/cooldown.png">
                            <span style="">
                                <strong>{{skill.cooldown}}</strong> sec. cooldown
                            </span>
                        </div>
                        <div class="skill-text">
                            {{skill.text}}
                        </div>
                        <div class="skill-books">
                            <span class="label label-default">Book1</span> {{skill.book1}} <br/>
                            <span class="label label-default">Book2</span> {{skill.book2}} <br/>
                            <span class="label label-default">Book3</span> {{skill.book3}} <br/>
                        </div>
                    </div>
                </div>
            </div>
            <h3>Transcendence</h3>
            <div title="_" class="row trans-container">
                <div data-title="one" v-for="(trans, transIndex) in currentData.trans" :key="transIndex" :id="transIndex" class="trans-perk col-sm-3">
                    <img class="trans-perk-image" v-if="trans.img" :src="trans.img">
                    <img v-else src="http://placehold.it/50x50&text=TBC">
                    <div class="tooltip-template">
                        <p>
                            <strong>{{trans.name}}</strong>
                        </p>
                        <p>{{trans.text}}</p>
                    </div>
                </div>
            </div>
        </div>
        <!-- Editing -->
        <div class="form-horizontal" v-else>
            <h4>Hero Information</h4>
            <div class="form-group">
                <label for="charName" class="col-sm-1 control-label">Name</label>
                <div class="col-sm-5">
                    <input type="text" id="charName" class="form-control" v-model="currentData.name">
                </div>
            </div>
            <div class="form-group">
                <label for="charSubname" class="col-sm-1 control-label">Subname</label>
                <div class="col-sm-5">
                    <input type="text" id="charSubname" class="form-control" v-model="currentData.subname">
                </div>
            </div>
            <div class="form-group">
                <label for="charImg" class="col-sm-1 control-label">Image</label>
                <div class="col-sm-5">
                    <uploadable v-model="currentData.img" :parent-key="currentData.key" prefix="char" db-ref="chars"></uploadable>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-1 control-label" for="charClass">Class</label>
                <div class="col-sm-5">
                    <select id="charClass" class="form-control" v-model="currentData.class">
                        <option v-for="cl in classes" :value="$lodash.omit(cl,'.key')">{{cl.name}}</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-1 control-label" for="charStar">Star</label>
                <div class="col-sm-5">
                    <select id="charStar" class="form-control" v-model="currentData.star">
                        <option v-for="i in 3" :key="i">{{i}}*</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="charType" class="col-sm-1 control-label">Damage Type</label>
                <div class="col-sm-5">
                    <select id="charType" class="form-control" v-model="currentData.dmgType">
                        <option v-for="t in damageTypes" :key="t">{{t}}</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="charPosition" class="col-sm-1 control-label">Position</label>
                <div class="col-sm-5">
                    <select id="charPosition" class="form-control" v-model="currentData.position">
                        <option v-for="p in positions" :key="p">{{p}}</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="charTags" class="col-sm-1 control-label">Tags</label>
                <div class="col-sm-5">
                    <multiselect v-model="tagsValues" tag-placeholder="Add this as new tag" placeholder="Search or add a tag" track-by=".key" label="name" :options="tags" :multiple="true" :taggable="true" @tag="addTag">
                    </multiselect>
                </div>
            </div>

            <h4>Skills Information</h4>

            <ul class="nav nav-pills">
                <li :class="{ 'active' : i === 1}" v-for="i in 4" :key="i">
                    <a :href="'#s' + (i)" data-toggle="tab">Skill {{i}}</a>
                </li>
            </ul>

            <div class="tab-content clearfix">
                <div :class="{ 'active' : i === 1}" v-for="i in 4" class="tab-pane" :id="'s'+i" :key="i">

                    <div class="form-group">
                        <label v-bind:for="'charSkills.s'+i+'.name'" class="col-sm-1 control-label">Name</label>
                        <div class="col-sm-5">
                            <input type="text" v-bind:id="'charSkills.s'+i+'.name'" class="form-control" v-model="currentData.skills['s'+i].name">
                        </div>
                    </div>

                    <div class="form-group">
                        <label v-bind:for="'charSkills.s'+i+'.mana'" class="col-sm-1 control-label">Mana Cost</label>
                        <div class="col-sm-5">
                            <input type="text" v-bind:id="'charSkills.s'+i+'.mana'" class="form-control" v-model="currentData.skills['s'+i].mana">
                        </div>
                    </div>

                    <div class="form-group">
                        <label v-bind:for="'charSkills.s'+i+'.cooldown'" class="col-sm-1 control-label">Cooldown</label>
                        <div class="col-sm-5">
                            <input type="text" v-bind:id="'charSkills.s'+i+'.cooldown'" class="form-control" v-model="currentData.skills['s'+i].cooldown">
                        </div>
                    </div>

                    <div class="form-group">
                        <label v-bind:for="'charSkills.s'+i+'.text'" class="col-sm-1 control-label">Text</label>
                        <div class="col-sm-5">
                            <input type="text" v-bind:id="'charSkills.s'+i+'.text'" class="form-control" v-model="currentData.skills['s'+i].text">
                        </div>
                    </div>

                    <div class="form-group">
                        <label v-bind:for="'charSkills.s'+i+'.img'" class="col-sm-1 control-label">Image</label>
                        <div class="col-sm-5">
                            <uploadable v-model="currentData.skills['s'+i].img" :parent-key="currentData.key" :prefix="'s'+i" db-ref="chars"></uploadable>
                        </div>
                    </div>

                    <div class="form-group">
                        <label v-bind:for="'charSkills.s'+i+'.book1'" class="col-sm-1 control-label">Book 1</label>
                        <div class="col-sm-5">
                            <input type="text" v-bind:id="'charSkills.s'+i+'.book1'" class="form-control" v-model="currentData.skills['s'+i].book1">
                        </div>
                    </div>
                    <div class="form-group">
                        <label v-bind:for="'charSkills.s'+i+'.book2'" class="col-sm-1 control-label">Book 2</label>
                        <div class="col-sm-5">
                            <input type="text" v-bind:id="'charSkills.s'+i+'.book2'" class="form-control" v-model="currentData.skills['s'+i].book2">
                        </div>
                    </div>
                    <div class="form-group">
                        <label v-bind:for="'charSkills.s'+i+'.book3'" class="col-sm-1 control-label">Book 3</label>
                        <div class="col-sm-5">
                            <input type="text" v-bind:id="'charSkills.s'+i+'.book3'" class="form-control" v-model="currentData.skills['s'+i].book3">
                        </div>
                    </div>
                </div>
            </div>
            <h4>Transcendence Information</h4>
            <div class="dropup">
                <button class="btn btn-default dropdown-toggle" type="button" id="transMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" href="#">
                    <span id="transMenuLabel">Trans Perk</span>
                    <span class="caret"></span>
                </button>
                <ul class="dropdown-menu" aria-labelledby="transMenu">
                    <template v-for="i in 5">
                        <li class="dropdown-header">Tier {{i}}</li>
                        <li  v-if="!(i === 5 && j > 2)" :class="{ 'active' : i === 1 && j === 1 }" v-for="j in 4">
                            <a v-on:click="dropdownProcess($event)" :href="'#t'+i+'-'+j" data-toggle="tab">Perk {{i}}-{{j}}</a>
                        </li>
                    </template>
                </ul>
            </div>

            <div class="tab-content clearfix">
                <template v-for="i in 5">
                    <div v-if="!(i === 5 && j > 2)" :class="{ 'active' : i === 1 && j === 1 }" v-for="j in 4" class="tab-pane" :id="'t'+i+'-'+j" :key="'t'+i+'-'+j">
                        <div class="form-group">
                            <label v-bind:for="'charTrans.t'+i+'-'+j+'.name'" class="col-sm-1 control-label">Name</label>
                            <div class="col-sm-5">
                                <input type="text" v-bind:id="'charTrans.t'+i+'-'+j+'.name'" class="form-control" v-model="currentData.trans['t'+i+'-'+j].name" />
                            </div>

                        </div>

                        <div class="form-group">
                            <label v-bind:for="'charTrans.t'+i+'-'+j+'.text'" class="col-sm-1 control-label">Text</label>
                            <div class="col-sm-5">
                                <input type="text" v-bind:id="'charTrans.t'+i+'-'+j+'.text'" class="form-control" v-model="currentData.trans['t'+i+'-'+j].text" />
                            </div>

                        </div>

                        <div class="form-group">
                            <label v-bind:for="'charTrans.t'+i+'-'+j+'.img'" class="col-sm-1 control-label">Image</label>
                            <div class="col-sm-5">
                                <uploadable v-model="currentData.trans['t'+i+'-'+j].img" :parent-key="currentData.key" :prefix="'t'+i+'-'+j" db-ref="chars"></uploadable>
                            </div>

                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from "firebase";
import tippy from "tippy.js";
import Multiselect from "vue-multiselect";
import Uploadable from "./Uploadable.vue";
import { editableMixin } from "../mixins/editable";

// DB Refs initialize
let db = firebase.database();
let charsRef = db.ref("db_chars");
let itemsRef = db.ref("db_items");
let classesRef = db.ref("db_enum_classes");
let tagsRef = db.ref("db_char_tags");

export default {
  name: "Char",

  mixins: [editableMixin],

  components: { Multiselect, Uploadable },

  props: ["name"],

  firebase: {
    char: charsRef,
    classes: classesRef,
    tags: tagsRef
  },

  data() {
    return {
      target: "db_chars",
      weapon: {},
      positions: ["Front", "Middle", "Back"],
      damageTypes: ["Magical", "Physical"],
      flatChar: {
        skills: {
          s1: {},
          s2: {},
          s3: {},
          s4: {}
        },
        trans: {
          "t1-1": {},
          "t1-2": {},
          "t1-3": {},
          "t1-4": {},
          "t2-1": {},
          "t2-2": {},
          "t2-3": {},
          "t2-4": {},
          "t3-1": {},
          "t3-2": {},
          "t3-3": {},
          "t3-4": {},
          "t4-1": {},
          "t4-2": {},
          "t4-3": {},
          "t4-4": {},
          "t5-1": {},
          "t5-2": {}
        }
      }
    };
  },

  methods: {
    addTag(newTag) {
      let tag = {
        name: newTag
      };

      if (!this.currentData.tags) this.$set(this.currentData, "tags", []);
      this.currentData.tags.push(tag);
      tagsRef.push(JSON.parse(JSON.stringify(tag)));
      console.log(tag);
    },

    dropdownProcess($e) {
      let label = document.getElementById("transMenuLabel");
      label.innerHTML = $e.srcElement.innerHTML;
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

    // Charge data
    let self = this;

    charsRef
      .orderByChild("name")
      .equalTo(this.name)
      .once("value", function(snapshot) {
        snapshot.forEach(function(child) {
          self.currentData = self.$lodash.merge({}, self.flatChar, child.val());
          self.currentData.key = child.key;
        });
      });

    itemsRef
      .orderByChild("char")
      .equalTo(this.name)
      .once("value", function(snapshot) {
        snapshot.forEach(function(child) {
          self.weapon = child.val();
        });
      });
  },

  computed: {
    tagsValues: {
      get() {
        return this.currentData.tags;
      },
      set(newVal) {
        this.currentData.tags = this.$lodash.map(
          newVal,
          this.$lodash.partialRight(this.$lodash.pick, "name")
        );
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.char-container .char-img {
  margin: 16px 0;
}

.char-container .class-img {
  height: 25px;
}

.hero-container {
  background: black;
  color: white;
  padding: 10px 0 30px 30px;
}

.hero-container a {
  color: gold;
}

.skill-cooldown img {
  height: 24px;
}

.skill-mana {
  margin-bottom: 5px;
}

.mana {
  height: 18px;
  font-size: 1px; /* prevent IE height bug */
  background: url(../assets/icons/mana.png) top left repeat-x;
  background-size: 18px 18px;
}

.mana {
  display: inline-block;
  vertical-align: middle;
}

.skill-container {
  background-color: ghostwhite;
}

.skill-text {
  margin: 10px 0;
  font-size: 14px;
  font-weight: bold;
}

.skill-books {
  margin-bottom: 10px;
  line-height: 24px;
}

.dropdown-menu > .active > a {
  background-color: white;
  color: black;
}

.trans-perk {
  margin-bottom: 10px;
}
.trans-perk img {
  width: 50px;
  height: 50px;
}

.trans-container .tooltip-template {
  display: none;
}
.trans-container {
  width: 40%;
}

.dropup,
.nav-pills {
  margin-bottom: 10px;
}

.nav-pills li a {
  background-color: black;
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

