<template>
    <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#">
                    <img width="20px" alt="Brand" src="https://www.logaster.com/static/images/not_allowed.png" />
                </a>
                <a class="navbar-brand" href="/#/">King's raid</a>
            </div>
            <div class="collapse navbar-collapse">
                <ul class="nav navbar-nav">
                    <li class="">
                        <a href="/#/admin">Admin</a>
                    </li>
                    <li class="">
                        <a href="/#/chars">Chars</a>
                    </li>
                    <li class="">
                        <a href="/#/items">Items</a>
                    </li>
                    <li v-for="menu in main_menu">
                        <!-- main_menu -->
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">{{menu._title}}
                            <b class="caret"></b>
                        </a>
                        <ul class="dropdown-menu multi-level">
                            <template v-for="sub1 in menu.menus" v-if="sub1">
                                <!-- sub1 -->
                                <template v-if="sub1.menus">
                                    <li class="dropdown-submenu">
                                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">{{sub1._title}}</a>
                                        <ul class="dropdown-menu">
                                            <template v-for="sub2 in sub1.menus" v-if="sub2">
                                                <!-- sub2 -->
                                                <template v-if="sub2.menus">
                                                    <li class="dropdown-submenu">
                                                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">{{sub2._title}}</a>
                                                        <ul class="dropdown-menu">
                                                            <template v-for="sub3 in sub2.menus" v-if="sub3">
                                                                <!-- sub3 -->
                                                                <li>
                                                                    <a href="#">{{sub3._title}}</a>
                                                                </li>
                                                            </template>
                                                        </ul>
                                                    </li>
                                                </template>
                                                <template v-else>
                                                    <li>
                                                        <a href="#">{{sub2._title}}</a>
                                                    </li>
                                                </template>
                                            </template>
                                        </ul>
                                    </li>
                                </template>
                                <template v-else>
                                    <li>
                                        <a href="#">{{sub1._title}}</a>
                                    </li>
                                </template>
                            </template>
                        </ul>
                    </li>
                    <!-- </template> -->
                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <li>
                        <a v-if="user" href="/#/account">
                            <span class="glyphicon glyphicon-user" aria-hidden="true"></span> {{user.pseudo || user.email}}</a>
                        <a v-else href="/#/login">Login</a>
                    </li>
                </ul>
            </div>
            <!--/.nav-collapse -->
        </div>
    </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Header",

  store: ["user"],

  data() {
    return {
      main_menu: {}
    };
  },

  methods: {},

  mounted() {
    // let db = firebase.database();
    // let menuRef = db.ref("menu/main_menu");
    // this.$bindAsArray("main_menu", menuRef);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dropdown-menu {
  border-radius: 0px;
  -webkit-box-shadow: none;
  box-shadow: none;
}

.dropdown-submenu {
  position: initial;
}

.dropdown-submenu > .dropdown-menu {
  top: 0;
  left: 100%;
  margin-top: -1px;
  margin-left: -1px;
  -webkit-border-radius: 0;
  -moz-border-radius: 0;
  border-radius: 0;
  min-height: 101%;
}

.dropdown-submenu:hover > .dropdown-menu {
  display: block;
}

.dropdown-submenu > a:after {
  display: block;
  content: " ";
  float: right;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  border-width: 5px 0 5px 5px;
  border-left-color: #ccc;
  margin-top: 5px;
  margin-right: -10px;
}

.dropdown-submenu:hover > a:after {
  border-left-color: #fff;
}

.dropdown-submenu.pull-left {
  float: none;
}

.dropdown-submenu.pull-left > .dropdown-menu {
  left: -100%;
  margin-left: 10px;
  -webkit-border-radius: 6px 0 6px 6px;
  -moz-border-radius: 6px 0 6px 6px;
  border-radius: 6px 0 6px 6px;
}
</style>
