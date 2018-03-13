import toastr from "toastr"
import firebase from "firebase"

toastr.options.closeButton = true;

let db = firebase.database();
let changesRef = db.ref("db_pending_changes");

export const editableMixin = {
  data() {
    return {
      isEditing: false,
      oldData: {},
      currentData: {},
    };
  },

  methods: {

    toggleEditing: function () {
      this.isEditing = !this.isEditing;
      if (this.isEditing) {
        this.oldData = JSON.parse(JSON.stringify(this.currentData));
        toastr.warning(
          "Any changes will be submitted to review. Click on save button to send or discard.",
          "Editing mode", {
            timeOut: 5000
          }
        );
      } else {
        toastr.clear();
        if (
          this.$lodash.isEqual(
            JSON.stringify(this.oldData),
            JSON.stringify(this.currentData)
          )
        ) {
          toastr.success("No changes to submit.");
        } else {

          // Find only changes
          let changes = {
            new: this.$lodash.omitBy(
              this.$lodash.toPlainObject(this.currentData),
              (v, k) => this.oldData[k] === v
            ),
            old: this.$lodash.omitBy(
              this.oldData,
              (v, k) => this.$lodash.toPlainObject(this.currentData)[k] === v
            ),
            key: this.oldData.key,
            target: this.target
          };



          if (this.selfEditable) { // SelfEditable
            if (this.key) {
              db.ref(changes.target).child(this.key).update(changes.new)
              toastr.success("Changes submitted.");
            } else if (this.redirectUrl) {
                const newItem = db.ref(changes.target).push(changes.new)
                this.key = newItem.key 
                this.$router.push(this.redirectUrl + this.key );
                toastr.success("Changes submitted.");
            }
          } else { // Validation Process
            console.log(changes);
            toastr.success("Changes submitted.");
            changesRef.push(changes);
            this.currentData = this.oldData;
          }
        }
      }
    }
  }
}
