<template>
  <v-form>
    <v-container fluid>
      <h1>Sign In</h1>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field v-model="email" label="Email"></v-text-field>
          <v-text-field
            v-model="password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            @click:append="showPassword = !showPassword"
            v-on:keyup.enter="signIn"
          ></v-text-field>
        </v-col>
      </v-row>
      <p v-if="errMsg">{{ errMsg }}</p>
      <v-row>
        <v-col><v-btn @click="signIn" color="success">Submit</v-btn></v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-dialog v-model="dialog" persistent>
            <template v-slot:activator="{ props }">
              <v-btn size="small" color="info" v-bind="props">Reset Password</v-btn>
            </template>
            <v-card>
              <v-card-title class="text-h5">Send reset password email?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="black" @click="dialog = false">Cancel</v-btn>
                <v-btn color="success" @click="resetPassword">OK</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { useRouter } from 'vue-router'
const router = useRouter()

const email = ref('')
const password = ref('')
const errMsg = ref()
const showPassword = ref(false)
const dialog = ref(false)
const auth = getAuth()

const signIn = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user
    console.log('Successfully logged in!', user)
    router.push('/')
  } catch (e) {
    console.log(e.code)
    // case 'auth/invalid-email':
    // case 'auth/user-not-found':
    // case 'auth/wrong-password':
    errMsg.value = e.message
  }
}

const resetPassword = async () => {
  try {
    await sendPasswordResetEmail(auth, email.value)
    alert('Password reset email sent!')
    dialog.value = false
  } catch (e) {
    alert(error.message)
  }
}
</script>
