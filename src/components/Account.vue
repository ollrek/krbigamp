<template>
    <div>
        <!-- Disconnect Button -->
        <button @click="disconnect" v-if="!isEditing && isOwner" type="button" class="close disconnect" aria-label="Disconnect">
            <i class="glyphicon glyphicon-off"></i>
        </button>
        <!-- Editable Button -->
        <button @click="toggleEditing" v-if="isOwner" type="button" class="close" aria-label="Edit">
            <i v-if="!isEditing" class="glyphicon glyphicon-pencil"></i>
            <i v-else class="glyphicon glyphicon-save"></i>
        </button>
        <!-- Template -->
        <div v-if="!isEditing" class="account-container">
            <h1 class="title">{{currentData.name || currentData.email}}
                <small>{{roles[currentData.role - 1]}}</small>
            </h1>
            <div class="user-img" v-if="currentData.img">
                <img :src="currentData.img" />
            </div>
            <hr/>
            <div class="info-container">
                <h4>User Information</h4>
                <div class="row">
                    <div class="col-md-2">
                        <strong>Server</strong>
                    </div>
                    <div class="col-md-3">
                        <strong>EU</strong>
                    </div>
                    <div class="col-md-2">
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
                    </div>
                </div>
            </div>
            <div class="roster-container">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">Roster ({{rosterCount}})</h3>
                        <router-link to="/custom/roster/new" tag="button" v-if="!isEditing && isOwner" type="button" class="close" aria-label="Add">
                            <i class="glyphicon glyphicon-plus"></i>
                        </router-link>
                    </div>
                    <div class="panel-body">
                        <ul class="customs-list-small">
                            <li v-for="r in roster" :key="r.key">
                                    <div class="user-avatar">
                                        <a href="#">
                                            <img src="http://placehold.it/50x50&text=Avatar" width="48" alt="">
                                        </a>
                                    </div>
                                    <p class="user-name">
                                        <a href="">{{r.char || 'toto'}}</a>
                                        <span>Last seen on 27th Sep 2014</span>
                                    </p>

                                    <a class="delete" href="#">
                                       <i class="glyphicon glyphicon-remove"></i>
                                    </a>

                                </li>
                        </ul>
                        <!-- <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="r in roster" :key="r.key">
                                    <td>
                                        Toto
                                    </td>
                                </tr>
                            </tbody>
                        </table> -->
                    </div>
                </div>

            </div>
            <div class="builds-container">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">Builds ({{buildsCount}})</h3>
                    </div>
                    <div class="panel-body">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="b in builds" :key="b.key">
                                    <td>
                                        Toto
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

        </div>
        <!-- Editing -->
        <div class="form-horizontal" v-else>
            <div class="form-group">
                <label for="userName" class="col-sm-2 control-label">Nickname</label>
                <div class="col-sm-5">
                    <input type="text" id="userName" class="form-control" v-model="currentData.name">
                </div>
            </div>
            <div class="form-group">
                <label for="userImg" class="col-sm-2 control-label">Image</label>
                <div class="col-sm-5">
                    <uploadable v-model="currentData.img" :parent-key="currentData.key" prefix="user" db-ref="users"></uploadable>
                </div>
            </div>
            <div class="form-group">
                <label for="userGuild" class="col-sm-2 control-label">Guild</label>
                <div class="col-sm-5">
                    <input type="text" id="userGuild" class="form-control" v-model="currentData.guild">
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label" for="userWaifu">Waifu/Husbando</label>
                <div class="col-sm-5">
                    <select id="userWaifu" class="form-control" v-model="currentData.waifu">
                        <option v-for="c in chars" :value="c.name" :key="c['.key']">{{c.name}}</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import * as firebase from "firebase";
import { editableMixin } from "../mixins/editable";
import Uploadable from "./Uploadable.vue";
import { NO_COMPLETE_CHILD_SOURCE } from "@firebase/database/dist/esm/src/core/view/CompleteChildSource";

// DB Refs initialize
let db = firebase.database();
let usersRef = db.ref("usr_users");
const charsRef = db.ref("db_chars");
const buildsRef = db.ref("usr_builds");

const rolesEnum = ["Admin", "Moderator", "Editor", "Raider"];

export default {
  name: "Account",

  store: ["user"],

  firebase: {
    chars: charsRef,
    builds: buildsRef
  },

  mixins: [editableMixin],

  components: { Uploadable },

  props: ["id"],

  methods: {
    disconnect: function() {
      firebase
        .auth()
        .signOut()
        .then(function() {
          // Sign-out successful.
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },

  data() {
    return {
      target: "usr_users",
      selfEditable: true,
      roles: rolesEnum,
      roster: {},
      builds: {}
    };
  },

  mounted() {
    const self = this;

    // User Data
    if (this.id && !this.isOwner) {
      const self = this;
      usersRef
        .child(this.id)
        .once("value")
        .then(function(snapshot) {
          self.currentData = snapshot.val();
        });
    } else {
      this.currentData = this.user;
    }

    // Roster Data
    db
      .ref("usr_roster")
      .orderByChild("ownerId")
      .equalTo(this.currentData.key)
      .on("value", response => {
        self.roster = response.val();
      });

    // Builds Data
    db
      .ref("usr_builds")
      .orderByChild("ownerId")
      .equalTo(this.currentData.key)
      .on("value", response => {
        self.builds = response.val();
      });
  },

  computed: {
    isOwner() {
      if (this.id) {
        return !this.id || (this.user && this.id === this.user.key);
      } else {
        return true;
      }
    },
    rosterCount() {
      if (this.roster) return Object.keys(this.roster).length;
      return 0;
    },
    buildsCount() {
      if (this.builds) return Object.keys(this.builds).length;
      return 0;
    }
  },

  watch: {
    user(value) {
      if (!this.id) {
        if (value === null || value === undefined) {
          this.$router.push("/login");
        }
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.disconnect {
  color: red;
  margin-left: 7px;
}

.user-img {
  margin: 10px 0;
}

.roster-container,
.builds-container {
  margin-top: 20px;
}

.roster-container .close,
.builds-container .close {
  font-size: 16px;
}

.roster-container .panel-title,
.builds-container .panel-title {
  display: inline-block;
}

.customs-list-small {
  list-style: none;
  text-align: center;
  margin: 0 auto;
  max-width: 900px;
  padding: 0;
}

.customs-list-small li {
  display: inline-block;
  box-sizing: border-box;
  position: relative;

  text-align: left;
  font: normal 14px sans-serif;

  background-color: #f4f8fa;
  border: 1px solid #dbe3e7;
  box-shadow: 0 2px 3px #dbe3e7;

  width: 260px;
  margin: 12px;
}

.customs-list-small .user-avatar {
  float: left;
  padding: 10px 15px;
}

.customs-list-small .user-avatar img {
  border-radius: 50%;
  border: 0;
}

.customs-list-small .user-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 19px 0 0;
  max-width: 150px;
}

.customs-list-small .user-name a {
  color: #5d6569;
  text-decoration: none;
  font-weight: bold;
}

.customs-list-small .user-name span {
  display: block;
  font-size: 11px;
  color: #808d93;
  padding-top: 4px;
}

.customs-list-small .delete {
  background-color: #de4a4a;
  border-radius: 50%;
  color: #fff;
  font-size: 13px;
  line-height: 22px;
  width: 22px;
  height: 22px;
  position: absolute;
  top: -10px;
  right: -10px;
  text-align: center;
  text-decoration: none;
}
</style>

              
            