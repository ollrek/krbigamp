<template>
  <div>
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">Pending Changes</h3>
      </div>
      <div class="panel-body">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>DB</th>
              <th>Key</th>
              <th>From</th>
              <th>To</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="change in changes">
              <td>{{change.target}}</td>
              <td>{{change.key}}</td>
              <td>
                <tr v-for="(d, index) in change.diff" :key="index" v-html="beautifyDiff(d, 'from')"></tr>
              </td>
              <td>
                <tr v-for="(d, index) in change.diff" :key="index" v-html="beautifyDiff(d, 'to')"></tr>
              </td>
              <td>
                <span class="glyphicon glyphicon-ok" aria-hidden="true" v-on:click="validChange(change)"></span>
                <span class="glyphicon glyphicon-remove" aria-hidden="true" v-on:click="rejectChange(change)"></span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <hr/>
    <div v-if="user.role === 1" class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">Users</h3>
      </div>
      <div class="panel-body">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user['.key']">
              <td>{{user.name}}</td>
              <td>{{user.mail}}</td>
              <td><input @change="changeRole(user)" v-model="user.role" /></td>
              <td>{{user['.key']}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <hr v-if="user.role === 1" />
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">Char Tags</h3>
      </div>
      <div class="panel-body">
        <div class="form-group">
          <label class="col-sm-2 control-label">Add char tag</label>
          <div class="col-sm-4">
            <input type="text" class="form-control" v-model="newCharTag">
          </div>
          <button type="button" class="btn btn-default col-sm-1" @click="addElt('char_tags', newCharTag)">Add</button>
        </div>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Tag</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ct in charTags" :key="ct['.key']">
              <td>{{ct.name}}</td>
              <td>
                <span class="glyphicon glyphicon-trash" aria-hidden="true" v-on:click="removeElt('char_tags', ct)"></span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">Content Tags</h3>
      </div>
      <div class="panel-body">
        <div class="form-group">
          <label class="col-sm-2 control-label">Add content tag</label>
          <div class="col-sm-4">
            <input type="text" class="form-control" v-model="newContentTag">
          </div>
          <button type="button" class="btn btn-default col-sm-1" @click="addElt('content_tags', newContentTag)">Add</button>
        </div>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Tag</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cot in contentTags" :key="cot['.key']">
              <td>{{cot.name}}</td>
              <td>
                <span class="glyphicon glyphicon-trash" aria-hidden="true" v-on:click="removeElt('content_tags', cot)"></span>
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
let changesRef = db.ref("db_pending_changes");
let usersRef = db.ref("usr_users");
let charTagsRef = db.ref("db_char_tags");
let contentTagsRef = db.ref("db_content_tags");

export default {
  name: "PendingList",

  firebase: {
    changes: changesRef,
    users: usersRef,
    charTags: charTagsRef,
    contentTags: contentTagsRef
  },

  store: ["user"],

  data() {
    return {
      newCharTag: "",
      newContentTag: ""
    };
  },

  methods: {
    validChange: function(change) {
      let currentRef = db.ref(change.target);
      currentRef.child(change["key"]).update(change.new);
      changesRef.child(change[".key"]).remove();
      toastr.success("Change accepted");
    },
    rejectChange: function(change) {
      changesRef.child(change[".key"]).remove();
      toastr.error("Change rejected");
    },
    removeElt: function(target, elt) {
      db
        .ref("db_" + target)
        .child(elt[".key"])
        .remove();
    },
    addElt: function(target, elt) {
      db.ref("db_" + target).push({ name: elt });
      elt = "";
    },
    beautifyDiff(diff, target) {
      let text = "";
      const labels = { N: "New", D: "Deleted", E: "Edited", A: "Edited" };

      switch (target) {
        case "from":
          text +=
            "<small><u>" +
            diff.path.join(" ") +
            "</u></small> " +
            (diff.lhs || (diff.item && diff.item.lhs) || "");
          break;
        case "to":
          text +=
            "<strong>" +
            labels[diff.kind] +
            " </strong><small><u>" +
            diff.path.join(" ") +
            ' </u></small> <i class="glyphicon glyphicon-arrow-right"></i> ' +
            (diff.rhs || (diff.item && diff.item.rhs) || "");
          break;
      }

      return text;
    },
    changeRole: function(user) {
      const key = user[".key"];
      usersRef.child(key).update({ role: user.role });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
