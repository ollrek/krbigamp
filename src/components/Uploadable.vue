<template>
  <div class="uploadable">
    <input class="form-control" v-model="inputValue"/>
    <button type="button" class="btn btn-default" @click="onPickFile">Pick</button>
    <button v-if="fileUrl && changed" type="button" class="btn btn-default" @click="uploadData">Upload</button>
    <input id="uploadable-form" @change="onFilePicked" type="file" ref="fileInput" accept="image/*">
    <div v-if="fileUrl || inputValue" class="uploadable-img-container">
      <img :src="fileUrl || inputValue" />
    </div>
  </div>
</template>

<script>
import toastr from "toastr";
import firebase from "firebase";

let storage = firebase.storage();

export default {
  name: "Uploadable",

  props: ["parent-key", "db-ref", "prefix", "value"],

  data() {
    return {
      fileUrl: '',
      changed: false,
      file: null
    };
  },

  methods: {
    onPickFile() {
      this.$refs.fileInput.click();
    },
    onFilePicked(event) {
      const files = event.target.files;
      let filename = files[0].name;

      if (filename.lastIndexOf(".") <= 0) {
        return alert("Please add a valid file!");
      }

      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.fileUrl = fileReader.result;
      });
      fileReader.readAsDataURL(files[0]);
      this.file = files[0];

      this.changed = true;
    },
    uploadData(key) {
      const filename = this.file.name;
      const ext = filename.slice(filename.lastIndexOf("."));
      firebase
        .storage()
        .ref(
          this.dbRef +
            "/" +
            this.parentKey +
            "/" +
            (this.prefix ? this.prefix + "_" : "") +
            this.parentKey +
            ext
        )
        .put(this.file)
        .then(fileData => {
          this.fileUrl = fileData.metadata.downloadURLs[0];
          this.inputValue = this.fileUrl

          toastr.success("File uploaded successfully");
        });
    }
  },

  computed: {
    inputValue: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit("input", newValue);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.uploadable #uploadable-form {
  display: none;
}

.uploadable img {
  max-height: 150px;
  border: 1px solid;
  margin: 5px 0px;
}

.uploadable .uploadable-img-container {
  border: 1px;
}

.uploadable button {
  margin: 5px 0 0 0;
}
</style>
