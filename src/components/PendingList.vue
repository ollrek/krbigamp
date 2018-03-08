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
              <td>{{JSON.stringify(change.old, null, 2)}}</td>
              <td>{{JSON.stringify(change.new, null, 2)}}</td>
              <td>
                <span class="glyphicon glyphicon-ok" aria-hidden="true" v-on:click="validChange(change)"></span>
                <span class="glyphicon glyphicon-remove" aria-hidden="true" v-on:click="rejectChange(change)"></span>
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
// let charsRef = db.ref('db_chars')
// let classesRef = db.ref('db_enum_classes')

export default {
  name: "PendingList",

  firebase: {
    changes: changesRef
  },

  data() {
    return {}
  },

  methods: {
    validChange: function(change) {
      let currentRef = db.ref(change.target)
      currentRef.child(change['key']).update(change.new)
      changesRef.child(change['.key']).remove()
      toastr.success("Change accepted");
    },
    rejectChange: function(change) {
      changesRef.child(change['.key']).remove()
      toastr.error("Change rejected");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
