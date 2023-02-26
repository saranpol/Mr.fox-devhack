import { defineStore } from "pinia"
import { doc, getFirestore, collection, query, where, onSnapshot, getDoc, getDocs, orderBy, limit } from 'firebase/firestore'
import { useStorage } from '@vueuse/core'
import { useStoreUser } from '@/stores/user'

const db = getFirestore()
const storeUser = useStoreUser()

const tradeDiaryObjBlank = {
  symbol: '',
  priceEntry: '',
  priceSL: '',
  priceTP: '',
  ratioReward: '',
  percentRiskOfRune: '',
  sizePosition: '',
  sizePositionCoin: '',
  leverage: '',
  margin: '',
  note: '',
  status: 1,
  timeOpen: null,
  timeClose: null,
  timeCreate: null,
  timeUpdate: null,
  sizePNL: 0,
  imageList: [],
}

export const useStoreTradeDiary = defineStore({
  id: "tradeDiary",
  state: () => ({
    tradeDiaryObj: JSON.parse(JSON.stringify(tradeDiaryObjBlank)),
    tradeDiaryList: useStorage('tradeDiaryList', []),
    tradeDiaryListUnsub: null,
    tradeDiaryListLastUserID: null,
    tradeDiaryInfoList: useStorage('tradeDiaryInfoList', []),
    tradeDiaryInfoListUnsub: null,
    tradeDiaryInfoListLastUserID: null,
    tradeStatusList: [{ title: 'Open', value: 1 }, { title: 'Closed', value: 2 }],
  }),
  actions: {
    listenTradeDiaryList(forceUserID) {
      const userID = forceUserID || storeUser.userID
      if (this.tradeDiaryListLastUserID == userID) {
        return // no need to sub again because same userID
      }
      this.tradeDiaryListLastUserID = userID
      console.log(`onSnapshot User/${userID}/TradeDiary`)
      const q = query(collection(db, `User/${userID}/TradeDiary`), orderBy('timeOpen', 'desc'))
      if (this.tradeDiaryListUnsub) {
        this.tradeDiaryListUnsub()
      }
      this.tradeDiaryListUnsub = onSnapshot(q, (snap) => {
        this.tradeDiaryList = []
        snap.forEach((doc) => {
          const d = doc.data()
          d.tradeDiaryID = doc.id
          this.tradeDiaryList.push(d)
        })
      })
    },
    listenTradeDiaryInfoList(forceUserID) {
      const userID = forceUserID || storeUser.userID
      if (this.tradeDiaryInfoListLastUserID == userID) {
        return // no need to sub again because same userID
      }
      this.tradeDiaryInfoListLastUserID = userID
      console.log(`onSnapshot User/${userID}/TradeDiaryInfo`)
      const q = query(collection(db, `User/${userID}/TradeDiaryInfo`))
      if (this.tradeDiaryInfoListUnsub) {
        this.tradeDiaryInfoListUnsub()
      }
      this.tradeDiaryInfoListUnsub = onSnapshot(q, (snap) => {
        this.tradeDiaryInfoList = []
        snap.forEach((doc) => {
          const d = doc.data()
          d.tradeDiaryInfoID = doc.id
          this.tradeDiaryInfoList.push(d)
        })
      })
    },
    getTradeDiaryObjBlank() {
      return JSON.parse(JSON.stringify(tradeDiaryObjBlank))
    }
  },
})
