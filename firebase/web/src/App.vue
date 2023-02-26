<template>
  <div>
    <v-card>
      <v-layout>
        <v-app-bar color="rgb(251, 162, 42)" dark prominent>
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          <v-toolbar-title>SRISIAM</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="toggleTheme()">
            <v-icon v-if="theme.global.name.value != 'dark'">mdi-moon-waxing-crescent</v-icon>
            <v-icon v-if="theme.global.name.value == 'dark'">mdi-white-balance-sunny</v-icon>
          </v-btn>
          <!-- <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-filter</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn> -->
        </v-app-bar>
        <v-navigation-drawer v-model="drawer">
          <v-list density="compact" nav>
            <template v-if="isLoggedIn">
              <v-list-item to="/" prepend-icon="mdi-home" title="Home" value="Home"></v-list-item>
              <v-list-item to="/trade-diary" prepend-icon="mdi-lead-pencil" title="Trade Diary" value="Trade Diary"></v-list-item>
              <v-list-item to="/funding-diary" prepend-icon="mdi-bank" title="Funding Diary" value="Funding Diary"></v-list-item>
              <v-list-item to="/port-life" prepend-icon="mdi-dice-d4" title="Port Life" value="Port Life"></v-list-item>
              <v-list-item to="/about" prepend-icon="mdi-information" title="About" value="About"></v-list-item>
            </template>
            <template v-else>
              <v-list-item to="/sign-up" prepend-icon="mdi-account-plus" title="Sing Up" value="Sign Up"></v-list-item>
              <v-list-item to="/sign-in" prepend-icon="mdi-login" title="Sign In" value="Sign In"></v-list-item>
            </template>
          </v-list>
          <v-divider></v-divider>
          <v-list density="compact" nav>
            <span v-if="isLoggedIn">
              <!-- <v-list-item  prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg" :title="userEmail" :subtitle="userID"></v-list-item> -->
              <v-list-item :title="userEmail" :subtitle="userID"></v-list-item>
              <!-- <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img> -->
              <!-- <v-img aspect-ratio="1" src="https://randomuser.me/api/portraits/women/85.jpg"></v-img> -->
              <v-list-item @click="signOut" prepend-icon="mdi-logout" title="Sign Out" value="Sign Out"></v-list-item>
            </span>
          </v-list>
        </v-navigation-drawer>
        <v-main>
          <router-view></router-view>
        </v-main>
      </v-layout>
    </v-card>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { storeToRefs } from 'pinia'
import { useStoreUser } from '@/stores/user'

const router = useRouter()
const theme = useTheme()

const isLoggedIn = ref(false)
const userEmail = ref('')
const userID = ref('')
const drawer = ref(true)
const storeUser = useStoreUser()

const auth = getAuth()
onAuthStateChanged(auth, (user) => {
  if (user) {
    userID.value = user.uid
    userEmail.value = user.email
    isLoggedIn.value = true
    storeUser.getUser(userID.value)
  } else {
    isLoggedIn.value = false
  }
})

const signOut = () => {
  auth.signOut()
  router.push('/')
}

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  storeUser.theme = theme.global.name.value
}

theme.global.name.value = storeUser.theme
</script>
<style>
a {
  cursor: pointer;
  text-decoration: underline;
}
.content {
  padding-top: 10px;
  padding-bottom: 40px;
  padding-left: 20px;
  padding-right: 20px;
}
</style>
