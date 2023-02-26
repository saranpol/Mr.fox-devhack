<template>
  <v-form>
    <v-container fluid>
      <h1>Sign Up</h1>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field v-model="email" label="Email"></v-text-field>
          <v-text-field
            v-model="password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            @click:append="showPassword = !showPassword"
            v-on:keyup.enter="signUp"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col><v-btn @click="signUp" color="success">Submit</v-btn></v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

import { useRouter } from 'vue-router'
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const router = useRouter()
const auth = getAuth()
const db = getFirestore()

let isSigningUp = false
const signUp = async () => {
  if (isSigningUp) return
  isSigningUp = true
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user
    const userData = {
      email: user.email,
    }
    await setDoc(doc(db, 'User', user.uid), userData)
    router.push('/')
  } catch(e) {
    console.log(e)
    alert(e)
  } finally {
    isSigningUp = false
  }
}
</script>
