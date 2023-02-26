import { defineStore } from "pinia"
import { doc, getFirestore, collection, query, where, onSnapshot, getDoc, getDocs, orderBy, limit } from 'firebase/firestore'
import { useStorage } from '@vueuse/core'

const db = getFirestore()

export const useStoreUser = defineStore({
  id: "user",
  state: () => ({
    user: useStorage('user', {}),
    userID: null,
    userUnsub: null,
    theme: useStorage('theme', 'light'),
    yourUsername: useStorage('yourUsername', ''),
  }),
  getters: {
    // getUserList: (state) => state.counter * 2,
  },
  actions: {
    async getUsername(userID) {
      const q = query(collection(db, 'Username'), where('userID', '==', userID), limit(1))
      const querySnapshot = await getDocs(q)
      if (querySnapshot.docs.length == 0) {
        console.log('username not exist')
        return null
      } else {
        const doc = querySnapshot.docs[0]
        console.log('found username')
        return doc.id
      }
    },
    async getUserID(username) {
      const ref = doc(db, 'Username', username)
      const docSnap = await getDoc(ref)
      if (docSnap.exists()) {
        return docSnap.data().userID
      }
      return null
    },
    getUser(userID) {
      this.userID = userID
      if (this.userUnsub) {
        this.userUnsub()
      }
      console.log('onSnapshot User', userID)
      this.userUnsub = onSnapshot(doc(db, 'User', userID), (doc) => {
        this.user = doc.data()
        console.log(this.user)
      })
    }
  },
})
