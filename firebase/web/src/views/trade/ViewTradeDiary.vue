<template>
  <div class="content">
    <v-row align="center">
      <v-col cols="auto">
        <h1>
          Trade Diary <template v-if="mUsername">of {{ mUsername }}</template>
        </h1>
      </v-col>
      <template v-if="!mUsername">
        <v-col>
          <v-btn v-if="mTradeDiaryID != null" flat @click="newTradeDiary()" color="success">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="yourUsername"
            @change="yourUsernameChange"
            @keydown="checkKeyDownAlphaNumeric($event)"
            label="Your Username"
            hide-details="auto"
          ></v-text-field>
          {{ hintYourUsername }}
        </v-col>
        <v-col cols="auto">
          <v-switch @change="isPublicTradeDiaryChange" label="public" v-model="user.isPublicTradeDiary" color="info" hide-details></v-switch>
        </v-col>
        <v-col cols="auto">
          <v-btn flat @click="copyToClipboard(`https://srisiam.app/${yourUsername}`)" color="grey">
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="2">
          <span class="link" @click="openURL(`https://srisiam.app/${yourUsername}`)">https://srisiam.app/{{ yourUsername }}</span>
        </v-col>
      </template>
    </v-row>
    <v-row align="center">
      <v-col cols="2">
        <v-text-field
          v-model="user.tradeSizeBalance"
          @input="sizeBalanceInput"
          @change="sizeBalanceChange"
          label="Start Balance $"
          type="number"
          hide-details="auto"
          :readonly="mUsername != undefined"
        ></v-text-field>
      </v-col>
      <v-col v-if="tradeDiaryInfoList.length > 0" cols="auto">
        <v-chip :color="getColorPNL(tradeDiaryInfoList[0].sizePNLTotal)">
          <h1>PNL {{ rd(tradeDiaryInfoList[0].sizePNLTotal, 2) }}</h1>
        </v-chip>
        &nbsp;
        <v-chip :color="getColorPNL(tradeDiaryInfoList[0].sizePNLTotal)">
          <h1>{{ getPNLPercent(tradeDiaryInfoList[0].sizePNLTotal) }}%</h1>
        </v-chip>
        &nbsp;
        <v-chip color="grey">
          <h1>Trade {{ tradeDiaryInfoList[0].tradeDiaryCount }}</h1>
        </v-chip>
        &nbsp;
        <v-chip color="grey">
          <h1>Win {{ tradeDiaryInfoList[0].winCount }}</h1>
        </v-chip>
        &nbsp;
        <v-chip color="grey">
          <h1>Lose {{ tradeDiaryInfoList[0].loseCount }}</h1>
        </v-chip>
        <v-chip color="grey">
          <h1>Win Rate {{ getWinRate() }}%</h1>
        </v-chip>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="1">
        <v-text-field
          v-model="tradeDiaryObj.symbol"
          label="Symbol"
          @input="tradeDiaryObj.symbol = tradeDiaryObj.symbol.toUpperCase()"
          @change="symbolChange"
          hide-details="auto"
          :readonly="mUsername != undefined"
        ></v-text-field>
      </v-col>
      <v-col cols="1">
        <v-text-field
          v-model="tradeDiaryObj.leverage"
          @input="leverageInput"
          label="Leverage X"
          type="number"
          hide-details="auto"
          :readonly="mUsername != undefined"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="tradeDiaryObj.priceEntry"
          @input="priceEntryInput"
          label="Entry Price $"
          type="number"
          hide-details="auto"
          :readonly="mUsername != undefined"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="tradeDiaryObj.priceSL"
          @input="priceSLInput"
          label="SL Price $"
          type="number"
          hide-details="auto"
          :readonly="mUsername != undefined"
        ></v-text-field>
      </v-col>
      <v-col cols="auto">
        <div class="side">Side</div>
        <v-chip v-if="tradeDiaryObj.priceSL == 0 || tradeDiaryObj.priceEntry == tradeDiaryObj.priceSL">&nbsp;&nbsp;</v-chip>
        <v-chip v-if="tradeDiaryObj.priceSL != 0 && tradeDiaryObj.priceEntry > tradeDiaryObj.priceSL" color="green">L</v-chip>
        <v-chip v-if="tradeDiaryObj.priceSL != 0 && tradeDiaryObj.priceEntry < tradeDiaryObj.priceSL" color="red">S</v-chip>
      </v-col>
      <v-col>
        <v-text-field
          v-model="tradeDiaryObj.priceTP"
          @input="priceTPInput"
          label="TP Price $"
          type="number"
          hide-details="auto"
          :readonly="mUsername != undefined"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="tradeDiaryObj.percentRiskOfRune"
          @input="percentRiskOfRuneInput"
          label="Risk of Rune %"
          type="number"
          hide-details="auto"
          :readonly="mUsername != undefined"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="tradeDiaryObj.sizePosition"
          @input="sizePositionInput"
          label="Position Size $"
          type="number"
          hide-details="auto"
          :readonly="mUsername != undefined"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="tradeDiaryObj.sizePositionCoin"
          @input="sizePositionCoinInput"
          label="Position Size (Coin)"
          type="number"
          hide-details="auto"
          :readonly="mUsername != undefined"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="tradeDiaryObj.margin"
          @input="marginInput"
          label="Margin $"
          type="number"
          hide-details="auto"
          :readonly="mUsername != undefined"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-chip color="red">
          <h2>{{ hintSL }}</h2>
        </v-chip>
        &nbsp;
        <v-chip color="green">
          <h2>{{ hintTP }}</h2>
        </v-chip>
        &nbsp;
        <v-chip color="orange">
          <h2>{{ hintRR }}</h2>
        </v-chip>
        &nbsp;
        <v-chip color="pink">
          <h2>{{ hintRiskOfRune }}</h2>
        </v-chip>
        &nbsp;
        <v-chip color="purple">
          <h2>{{ hintSizePosition }}</h2>
        </v-chip>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div id="price-graph" />
        <!-- <Chart :options="mTradingViewOption" /> -->
      </v-col>
      <v-col>
        <v-textarea v-model="tradeDiaryObj.note" rows="15" filled label="Note" :readonly="mUsername != undefined"></v-textarea>
      </v-col>
      <v-col cols="auto">
        <vue-draggable-next :list="tradeDiaryObj.imageList">
          <div v-for="(img, i) in tradeDiaryObj.imageList" :key="img.imageURL" class="drag-image">
            <v-img aspect-ratio="1" :src="`${img.imageURL}=w${mImageWidth}`" />
            <v-row align="center">
              <v-col cols="auto">
                <v-btn flat @click="showImage(img.imageURL)" size="xsmall"><v-icon>mdi-image</v-icon></v-btn>
              </v-col>
              <v-col v-if="!mUsername" cols="auto">
                <v-dialog v-model="dialogDeleteImage" persistent>
                  <template v-slot:activator="{ props }">
                    <v-btn flat v-bind="props" size="xsmall"><v-icon>mdi-delete</v-icon></v-btn>
                  </template>
                  <v-card>
                    <v-card-title class="text-h5">Delete Image?</v-card-title>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="grey" @click="dialogDeleteImage = false">Cancel</v-btn>
                      <v-btn color="error" @click="deleteImage(tradeDiaryObj.imageList, i)">Delete</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
          </div>
        </vue-draggable-next>
      </v-col>
      <v-col v-if="!mUsername" cols="auto">
        <v-btn icon @click="addImage(tradeDiaryObj)" color="grey"><v-icon>mdi-file-image</v-icon></v-btn>
        <v-file-input multiple id="uploader" style="display: none" accept="image/*" @change="didSelectImageList" />
      </v-col>
      <template v-if="mTradeDiaryID != null">
        <v-col cols="auto">
          <v-select v-model="tradeDiaryObj.status" :items="tradeStatusList" filled label="Status" :disabled="mUsername != undefined"></v-select>
        </v-col>
        <v-col v-if="tradeDiaryObj.status == 2" cols="auto">
          <v-text-field v-model="tradeDiaryObj.sizePNL" label="PNL $" type="number" :readonly="mUsername != undefined"></v-text-field>
        </v-col>
      </template>
      <v-col v-if="!mUsername" cols="auto">
        <v-btn v-if="mTradeDiaryID == null" @click="addTradeDiary" color="success">Add Trade Diary</v-btn>
        <template v-if="mTradeDiaryID != null">
          <v-row>
            <v-col><v-btn @click="updateTradeDiary" color="info">Update Trade Diary</v-btn></v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-dialog v-model="dialogDeleteTradeDiary" persistent>
                <template v-slot:activator="{ props }">
                  <v-btn size="small" color="grey" v-bind="props">Delete Trade Diary</v-btn>
                </template>
                <v-card>
                  <v-card-title class="text-h5">Delete Trade Diary?</v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" @click="dialogDeleteTradeDiary = false">Cancel</v-btn>
                    <v-btn color="error" @click="deleteTradeDiary">Delete</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
        </template>
      </v-col>
    </v-row>
    <v-table>
      <thead>
        <tr>
          <th width="1">Select</th>
          <th width="1">Open UTC</th>
          <th width="1">Close UTC</th>
          <th width="1">Side</th>
          <th class="text-left" width="1">Symbol</th>
          <th class="text-left" width="1">Entry/SL/TP</th>
          <th class="text-left" width="1">RR</th>
          <th class="text-left" width="1">Rune</th>
          <th class="text-left" width="1">Size</th>
          <th class="text-left" width="1">Coin</th>
          <th class="text-left" width="1">Margin</th>
          <th class="text-left" width="1">If&nbsp;Lose</th>
          <th class="text-left" width="1">If&nbsp;Win</th>
          <th class="text-left" width="1">PNL</th>
          <th class="text-left">Note</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="d in tradeDiaryList" :key="d.tradeDiaryID">
          <td>
            <v-btn flat @click="selectTradeDiary(d)" :color="mTradeDiaryID == d.tradeDiaryID ? 'info' : ''">
              <v-icon v-if="mTradeDiaryID != d.tradeDiaryID">mdi-circle-outline</v-icon>
              <v-icon v-if="mTradeDiaryID == d.tradeDiaryID">mdi-checkbox-marked-circle-outline</v-icon>
            </v-btn>
          </td>
          <td>{{ toDT(d.timeOpen) }}</td>
          <td>{{ toDT(d.timeClose) }}</td>
          <td>
            <v-chip v-if="d.priceSL != 0 && d.priceEntry > d.priceSL" color="green">L</v-chip>
            <v-chip v-if="d.priceSL != 0 && d.priceEntry < d.priceSL" color="red">S</v-chip>
          </td>
          <td class="link" @click="openTrandingView(d.symbol)">{{ d.symbol }}&nbsp;{{ d.leverage }}X</td>
          <td>{{ d.priceEntry }}/{{ d.priceSL }}/{{ d.priceTP }}</td>
          <td>{{ d.ratioReward }}</td>
          <td class="text-center">{{ d.percentRiskOfRune }}%</td>
          <td>{{ d.sizePosition }}</td>
          <td>{{ d.sizePositionCoin }}</td>
          <td>{{ d.margin }}</td>
          <td>{{ getIfLose(d) }}</td>
          <td>{{ getIfWin(d) }}</td>
          <td :class="getPNLColor(d.sizePNL)">{{ d.sizePNL ? d.sizePNL : '-' }}</td>
          <td>{{ d.note }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup>
import { getFirestore, doc, collection, getDoc, setDoc, serverTimestamp, deleteDoc, Timestamp } from 'firebase/firestore'
import { getStorage, ref as firebaseStorageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { getAuth, reload } from 'firebase/auth'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useStoreUser } from '@/stores/user'
import { useStoreTradeDiary } from '@/stores/tradeDiary'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
import { VueDraggableNext } from 'vue-draggable-next'
import axios from 'axios'
// import { Chart } from 'vue-tradingview-widgets'
import { useTheme } from 'vuetify'
import { createChart, LineStyle } from 'lightweight-charts'

const theme = useTheme()
const route = useRoute()
const router = useRouter()

const auth = getAuth()
const db = getFirestore()
const storage = getStorage()

const storeUser = useStoreUser()
const storeTradeDiary = useStoreTradeDiary()

const { user, yourUsername } = storeToRefs(storeUser)
const { tradeDiaryObj, tradeDiaryList, tradeDiaryInfoList, tradeStatusList } = storeToRefs(storeTradeDiary)

const hintRiskOfRune = ref('')
const hintSizePosition = ref('')
const hintSL = ref('')
const hintTP = ref('')
const hintRR = ref('')
const dialogDeleteTradeDiary = ref(false)
const dialogDeleteImage = ref(false)
const hintYourUsername = ref('')

let mUsername = route.params.username
console.log('mUsername', mUsername)
let mTradeDiaryID = ref(null)
let mImageList = null
const mImageWidth = Math.round(100 * window.devicePixelRatio)

// ############## db ##############
const sizeBalanceChange = async () => {
  const userID = storeUser.userID
  console.log(`setDoc User`, userID)
  const ref = doc(db, `User`, userID)
  const data = {
    tradeSizeBalance: user.value.tradeSizeBalance,
  }
  await setDoc(ref, data, { merge: true })
  console.log('setDoc Done')
}

const yourUsernameChange = async () => {
  const userID = storeUser.userID
  const username = yourUsername.value
  hintYourUsername.value = ''

  // delete old username
  const oldUsername = await storeUser.getUsername(userID)
  if (oldUsername) {
    const ref = doc(db, `Username/${oldUsername}`)
    await deleteDoc(ref)
  }

  if (!username) {
    return
  }
  // try to set new username
  try {
    const ref = doc(db, `Username`, username)
    const data = {
      userID: userID,
    }
    await setDoc(ref, data, { merge: true })
  } catch (e) {
    console.log(e)
    hintYourUsername.value = 'This username already used.'
  }
}

const isPublicTradeDiaryChange = async () => {
  const userID = storeUser.userID
  console.log(`setDoc User`, userID)
  const ref = doc(db, `User`, userID)
  const data = {
    isPublicTradeDiary: user.value.isPublicTradeDiary,
  }
  await setDoc(ref, data, { merge: true })
  console.log('setDoc Done')
}

const checkKeyDownAlphaNumeric = (event) => {
  if (!/[a-zA-Z0-9\s]/.test(event.key)) {
    // this.ignoredValue = event.key ? event.key : ''
    event.preventDefault()
  }
}

const addTradeDiary = async () => {
  const userID = storeUser.userID
  const ref = doc(collection(db, `User/${userID}/TradeDiary`))
  console.log(`setDoc User/${userID}/TradeDiary`, ref.id)
  const data = tradeDiaryObj.value
  data.timeOpen = serverTimestamp()
  data.timeCreate = serverTimestamp()
  data.timeUpdate = serverTimestamp()
  mTradeDiaryID.value = ref.id
  await setDoc(ref, data)
}

const updateTradeDiary = async () => {
  const userID = storeUser.userID
  const ref = doc(db, `User/${userID}/TradeDiary/${mTradeDiaryID.value}`)
  console.log(`setDoc User/${userID}/TradeDiary/${mTradeDiaryID.value}`)
  const data = tradeDiaryObj.value
  console.log(data)
  data.timeUpdate = serverTimestamp()

  if (!data.timeClose && data.status == 2) {
    // just close
    data.timeClose = serverTimestamp()
  } else if (data.timeClose && data.status == 1) {
    // just re open
    data.sizePNL = 0
    data.timeClose = null
  } else {
    delete data.timeClose
  }

  delete data.timeOpen
  delete data.timeCreate
  await setDoc(ref, data, { merge: true })
}

const deleteTradeDiary = async () => {
  const userID = storeUser.userID
  const ref = doc(db, `User/${userID}/TradeDiary/${mTradeDiaryID.value}`)
  await deleteDoc(ref)
  dialogDeleteTradeDiary.value = false
  newTradeDiary()
}

const selectTradeDiary = (d) => {
  if (mTradeDiaryID.value == d.tradeDiaryID) {
    newTradeDiary()
    return
  }
  mTradeDiaryID.value = d.tradeDiaryID
  tradeDiaryObj.value = JSON.parse(JSON.stringify(d))
  calRiskReward()
  calRiskOfRuneHint()

  updateTradingViewOption()
}

const clearHint = () => {
  hintRiskOfRune.value = ''
  hintSizePosition.value = ''
  hintSL.value = ''
  hintTP.value = ''
  hintRR.value = ''
}

const newTradeDiary = () => {
  tradeDiaryObj.value = storeTradeDiary.getTradeDiaryObjBlank()
  mTradeDiaryID.value = null
  clearHint()
}

const toDT = (t) => {
  if (!t) {
    return '-'
  }
  let d = null
  if (t.toDate) {
    d = t.toDate()
  } else {
    d = new Timestamp(t.seconds, t.nanoseconds).toDate()
  }
  return dayjs(d).utc().format('DD/MM/YY HH:mm')
}

// ############## calculation ##############

const priceEntryInput = () => {
  calRiskReward()
  calPositionSize()
  calRiskOfRuneHint()
  updateLine()
}

const priceSLInput = () => {
  calRiskReward()
  calPositionSize()
  calRiskOfRuneHint()
  updateLine()
}

const priceTPInput = () => {
  calRiskReward()
  calPositionSize()
  calRiskOfRuneHint()
  updateLine()
}

const percentRiskOfRuneInput = () => {
  calPositionSize()
  calRiskOfRuneHint()
}

const sizeBalanceInput = () => {
  calPositionSize()
  calRiskOfRuneHint()
}

const sizePositionInput = () => {
  calRiskOfRuneFromPositionSize()
  calPisitionCoinSize()
  calMargin()
  calRiskOfRuneHint()
}

const sizePositionCoinInput = () => {
  calPositionSizeFromCoin()
  calRiskOfRuneFromPositionSize()
  calRiskOfRuneHint()
}

const leverageInput = () => {
  calMargin()
}

const marginInput = () => {
  calPositionSizeFromMargin()
  calRiskOfRuneFromPositionSize()
  calPisitionCoinSize()
  calRiskOfRuneHint()
}

const calRiskOfRuneFromPositionSize = () => {
  const d = tradeDiaryObj.value
  const positionSize = d.sizePosition
  const balance = user.value.tradeSizeBalance
  const entry = d.priceEntry
  const sl = d.priceSL
  const risk = Math.abs(entry - sl) / entry
  const losePerTime = positionSize * risk
  const continueLost = balance / losePerTime
  d.percentRiskOfRune = rd(100 / continueLost, 2)
}

const calRiskOfRuneHint = () => {
  const d = tradeDiaryObj.value
  const riskOfRune = d.percentRiskOfRune
  const balance = user.value.tradeSizeBalance
  const continueLost = 100 / riskOfRune
  const losePerTime = rd(balance / continueLost, 2)
  hintRiskOfRune.value = `Can lose ${rd(continueLost, 2)} times`

  const entry = d.priceEntry
  const tp = d.priceTP
  const reward = Math.abs(entry - tp) / entry
  const winPerTime = rd(d.sizePosition * reward, 2)
  hintSizePosition.value = `Lose $${losePerTime} or Win $${winPerTime}`
}

const calRiskReward = () => {
  const d = tradeDiaryObj.value
  const entry = d.priceEntry
  const sl = d.priceSL
  const tp = d.priceTP
  const risk = Math.abs(entry - sl) / entry
  const reward = Math.abs(entry - tp) / entry
  d.ratioReward = rd(reward / risk, 2)
  hintSL.value = `SL ${rd(risk * 100, 2)} %`
  hintTP.value = `TP ${rd(reward * 100, 2)} %`
  hintRR.value = `RR ${d.ratioReward}`
}

const calPositionSize = () => {
  const d = tradeDiaryObj.value
  const riskOfRune = d.percentRiskOfRune
  const balance = user.value.tradeSizeBalance
  const continueLost = 100 / riskOfRune
  const losePerTime = balance / continueLost
  const entry = d.priceEntry
  const sl = d.priceSL
  const risk = Math.abs(entry - sl) / entry
  if (isNaN(risk)) {
    return
  }
  d.sizePosition = rd(losePerTime / risk, 2)
  calPisitionCoinSize()
  calMargin()
}

const calPisitionCoinSize = () => {
  const d = tradeDiaryObj.value
  d.sizePositionCoin = rd(d.sizePosition / d.priceEntry, 4)
}

const calPositionSizeFromCoin = () => {
  const d = tradeDiaryObj.value
  d.sizePosition = rd(d.sizePositionCoin * d.priceEntry, 2)
  calMargin()
}

const calPositionSizeFromMargin = () => {
  const d = tradeDiaryObj.value
  d.sizePosition = rd(d.margin * d.leverage, 2)
}

const calMargin = () => {
  const d = tradeDiaryObj.value
  if (d.leverage == 0) {
    return
  }
  d.margin = rd(d.sizePosition / d.leverage, 2)
}

const rd = (n, i) => {
  return Number(n.toFixed(i))
}

const getPNLColor = (v) => {
  if (v > 0) return 'pnl-plus'
  if (v < 0) return 'pnl-minus'
  return ''
}

const getIfLose = (d) => {
  const entry = d.priceEntry
  const sl = d.priceSL
  const risk = Math.abs(entry - sl) / entry
  return rd(d.sizePosition * risk, 2)
}

const getIfWin = (d) => {
  const entry = d.priceEntry
  const tp = d.priceTP
  const reward = Math.abs(entry - tp) / entry
  return rd(d.sizePosition * reward, 2)
}

const getPNLPercent = (pnl) => {
  const balance = user.value.tradeSizeBalance
  return rd((pnl / balance) * 100, 2)
}

const getColorPNL = (pnl) => {
  if (pnl > 0) {
    return 'blue'
  }
  return 'grey'
}

const getWinRate = () => {
  const win = tradeDiaryInfoList.value[0].winCount || 0
  const lose = tradeDiaryInfoList.value[0].loseCount || 0
  if (win + lose == 0) {
    return '-'
  }
  return rd((win / (win + lose)) * 100, 2)
}

// ##### images
const addImage = (obj) => {
  if (!obj.imageList) {
    obj.imageList = []
  }
  mImageList = obj.imageList
  document.getElementById('uploader').click()
}

const didSelectImageList = (e) => {
  const files = e.target.files
  console.log('files', files)
  for (const key of Object.keys(files)) {
    const file = files[key]
    uploadFile(file, mImageList)
  }
}

const uploadFile = (file, imageList) => {
  const user = auth.currentUser
  const userID = user.uid

  console.log('userID', userID)
  console.log('file', file)

  const metadata = {
    contentType: file.type,
  }

  const timestamp = new Date().getTime()
  const storageRef = firebaseStorageRef(storage, `User/${userID}/${timestamp}_${file.name}`)
  const gsPath = `gs://${storageRef.bucket}/${storageRef.fullPath}`
  console.log('gsPath', gsPath)

  const uploadTask = uploadBytesResumable(storageRef, file, metadata)

  uploadTask.on(
    'state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      console.log(file.name + 'Upload is ' + progress + '% done')
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused')
          break
        case 'running':
          console.log('Upload is running')
          break
      }
    },
    (error) => {
      console.log('error', error)
    },
    () => {
      callImageAPI(gsPath, imageList)
      // Upload completed successfully, now we can get the download URL
      // getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      //   console.log('File available at', downloadURL)
      // })
    }
  )
}

const callImageAPI = async (gsPath, imageList) => {
  const data = (await axios.get(`https://images-dot-srisiam.uc.r.appspot.com/image_url_get?storage_location=${gsPath}`)).data
  const image_url = data.image_url
  imageList.push({
    imageURL: image_url,
    gsPath: gsPath,
  })
}

const showImage = (imageURL) => {
  window.open(imageURL + '=s0', '_blank').focus()
}

const deleteImage = (list, i) => {
  // if (!confirm('Delete Image?')) {
  //   return
  // }
  list.splice(i, 1)
  dialogDeleteImage.value = false
}

// ###############

const openTrandingView = (symbol) => {
  openURL(`https://www.tradingview.com/chart/?symbol=${symbol}PERP&interval=1H`)
}

const openURL = (url) => {
  window.open(url, '_blank').focus()
}

const copyToClipboard = (s) => {
  navigator.clipboard.writeText(s)
}

const initWithUsername = async () => {
  const userID = await storeUser.getUserID(mUsername)
  storeTradeDiary.listenTradeDiaryList(userID)
  storeTradeDiary.listenTradeDiaryInfoList(userID)
  storeUser.getUser(userID)
}

const initWithUserID = async () => {
  storeTradeDiary.listenTradeDiaryList()
  storeTradeDiary.listenTradeDiaryInfoList()
  const userID = storeUser.userID
  const username = await storeUser.getUsername(userID)
  if (username) {
    yourUsername.value = username
  }
}

if (mUsername) {
  initWithUsername()
} else {
  initWithUserID()
}

// ###### TradingView
const symbolChange = () => {
  updateTradingViewOption()
}

let mSocket = null
let mSeries = null
let mChart = null
let mLineEntry = null
let mLineTP = null
let mLineSL = null

const updateTradingViewOption = async () => {
  // /fapi/v1/klines
  // https://fapi.binance.com/futures/data/topLongShortAccountRatio?symbol=BTCUSDT&period=5m&limit=1
  // https://fapi.binance.com/fapi/v1/klines?symbol=BTCUSDT&interval=1h&limit=1500

  const symbolUpper = tradeDiaryObj.value.symbol || 'BTCUSDT'
  const symbolLower = symbolUpper.toLowerCase()

  if (mSocket) {
    mSocket.close()
  }

  mSocket = new WebSocket(`wss://fstream.binance.com/ws/${symbolLower}@kline_1h`)
  // const x = new WebSocket('wss://fstream.binance.com/ws/btcusdt_perpetual@continuousKline_1h')
  mSocket.onmessage = (e) => {
    if (mSeries == null) {
      return
    }
    const d = JSON.parse(e.data)
    const k = d.k
    const timestamp = k.t / 1000
    const open = Number(k.o)
    const close = Number(k.c)
    const high = Number(k.h)
    const low = Number(k.l)

    mSeries.update({
      time: timestamp,
      open: open,
      high: high,
      low: low,
      close: close,
    })
  }

  const r = await axios.get(`https://fapi.binance.com/fapi/v1/klines?symbol=${symbolUpper}&interval=1h&limit=1500`)
  const dark = theme.global.name.value == 'dark'
  if (mChart) {
    mChart.remove()
    mLineEntry = null
    mLineTP = null
    mLineSL = null
  }
  mChart = createChart('price-graph', {
    theme: theme.global.name.value == 'dark' ? 'dark' : 'light',
    width: Math.round(document.documentElement.clientWidth * 0.4),
    height: Math.round(document.documentElement.clientHeight / 3),
    timeScale: {
      timeVisible: true,
      borderColor: '#D1D4DC',
    },
    rightPriceScale: {
      borderColor: '#D1D4DC',
    },
    layout: {
      backgroundColor: dark ? '#131722' : '#ffffff',
      textColor: dark ? '#d1d4dc' : '#000',
    },
    grid: {
      horzLines: {
        color: dark ? 'rgba(42, 46, 57, 0.6)' : '#F0F3FA',
      },
      vertLines: {
        color: dark ? 'rgba(42, 46, 57, 0.6)' : '#F0F3FA',
      },
    },
  })

  mSeries = mChart.addCandlestickSeries({
    upColor: 'rgb(38,166,154)',
    downColor: 'rgb(255,82,82)',
    wickUpColor: 'rgb(38,166,154)',
    wickDownColor: 'rgb(255,82,82)',
    borderVisible: false,
  })

  const samplePrice = r.data[0][1]
  const precision = samplePrice.substring(samplePrice.indexOf('.') + 1).length
  mSeries.applyOptions({
    priceFormat: {
      type: 'price',
      precision: precision,
      minMove: 1 / Math.pow(10, precision),
    },
  })

  const data = []
  for (const d of r.data) {
    const timestamp = d[0] / 1000
    const open = Number(d[1])
    const high = Number(d[2])
    const low = Number(d[3])
    const close = Number(d[4])
    data.push({
      time: timestamp,
      open: open,
      high: high,
      low: low,
      close: close,
    })
  }

  mSeries.setData(data)
  updateLine()
}

const updateLine = () => {
  // let datesForMarkers = [data[data.length - 39], data[data.length - 19]]
  // let indexOfMinPrice = 0
  // for (let i = 1; i < datesForMarkers.length; i++) {
  //   if (datesForMarkers[i].high < datesForMarkers[indexOfMinPrice].high) {
  //     indexOfMinPrice = i
  //   }
  // }

  const td = tradeDiaryObj.value

  const markers = []

  if (td.timeOpen && td.timeOpen.seconds) {
    const isLong = td.priceSL != 0 && td.priceEntry > td.priceSL
    markers.push({
      time: td.timeOpen.seconds,
      position: isLong ? 'belowBar' : 'aboveBar',
      color: '#2196F3', //isLong ? '#2196F3' : '#e91e63',
      shape: isLong ? 'arrowUp' : 'arrowDown',
      text: isLong ? 'Long' : 'Short',
    })
  }

  if (td.timeClose && td.timeClose.seconds) {
    const isLong = td.priceSL != 0 && td.priceEntry > td.priceSL
    markers.push({
      time: td.timeClose.seconds,
      position: isLong ? 'aboveBar' : 'belowBar',
      color: '#2196F3', //isLong ? '#2196F3' : '#e91e63',
      shape: isLong ? 'arrowDown' : 'arrowUp',
      text: 'Close', //isLong ? 'Close Long' : 'Close Short',
    })
  }

  // for (let i = 0; i < datesForMarkers.length; i++) {
  //   if (i !== indexOfMinPrice) {
  //     markers.push({
  //       time: datesForMarkers[i].time,
  //       position: 'aboveBar',
  //       color: '#e91e63',
  //       shape: 'arrowDown',
  //       text: 'Short @ ' + Math.floor(datesForMarkers[i].high + 2),
  //     })
  //   } else {
  //     markers.push({
  //       time: datesForMarkers[i].time,
  //       position: 'belowBar',
  //       color: '#2196F3',
  //       shape: 'arrowUp',
  //       text: 'Long @ ' + Math.floor(datesForMarkers[i].low - 2),
  //     })
  //   }
  // }
  mSeries.setMarkers(markers)

  const lineWidth = 2
  if (mLineEntry) {
    mSeries.removePriceLine(mLineEntry)
    mSeries.removePriceLine(mLineSL)
    mSeries.removePriceLine(mLineTP)
  }

  mLineEntry = mSeries.createPriceLine({
    price: td.priceEntry,
    color: '#2196F3',
    lineWidth: lineWidth,
    lineStyle: LineStyle.Solid,
    axisLabelVisible: true,
    title: 'Entry',
  })
  mLineSL = mSeries.createPriceLine({
    price: td.priceSL,
    color: '#F44336',
    lineWidth: lineWidth,
    lineStyle: LineStyle.Solid,
    axisLabelVisible: true,
    title: 'SL',
  })
  mLineTP = mSeries.createPriceLine({
    price: td.priceTP,
    color: '#4CAF50',
    lineWidth: lineWidth,
    lineStyle: LineStyle.Solid,
    axisLabelVisible: true,
    title: 'TP',
  })
  // mChart.timeScale().fitContent()
}

// const getTradingViewOption = () => {
//   return {
//     theme: theme.global.name.value == 'dark' ? 'dark' : 'light',
//     symbol: tradeDiaryObj.value.symbol || 'BTCUSDT',
//     // autosize: true,
//     width: Math.round(document.documentElement.clientWidth * 0.4),
//     height: Math.round(document.documentElement.clientHeight / 3),
//     interval: '1H',
//     // "timezone": "Etc/UTC",
//     allow_symbol_change: true,
//     hide_side_toolbar: false,
//     studies: [
//       // "ZigZag@tv-basicstudies"
//       {
//         id: 'BB@tv-basicstudies',
//         inputs: {
//           length: 25,
//         },
//       },
//     ],
//     // drawings_overrides:
//     drawings: [
//       // {
//       //   id: 'linetoolicon',
//       //   singleChartOnly: true,
//       //   color: 'rgba( 61, 133, 198, 1)',
//       //   snapTo45Degrees: true,
//       //   size: 40,
//       //   icon: 0x263a,
//       //   angle: Math.PI * 0.5,
//       //   scale: 1.0,
//       // },
//       // linetoolfibspiral: {
//       //   linecolor: 'rgba( 21, 153, 128, 1)',
//       //   linewidth: 1.0,
//       //   // linestyle: LINESTYLE_SOLID,
//       // },
//     ],
//   }
// }

// const mTradingViewOption = ref(getTradingViewOption())

// const updateTradingViewOption = () => {
//   mTradingViewOption.value = getTradingViewOption()
//   reloadTradingView()
// }

// let k = null
// const reloadTradingView = () => {
//   if (window.TradingView.widget) {
//     k = new window.TradingView.widget(Object.assign({ container_id: 'tradingview-chart' }, mTradingViewOption.value))

//     // window.TradingView.onready = (e) => {
//     //   console.log('eeee', e)
//     // }
//     // console.log('vvvv', window.TradingView)
//     // window.TradingView.widget
//     //   .chart()
//     //   .createOrderLine()
//     //   .setText('Buy Line')
//     //   .setLineLength(3)
//     //   .setLineStyle(0)
//     //   .setQuantity('221.235 USDT')
//     //   .setPrice(20000)
//   }
// }

// onMounted(() => {
//   console.log('onMounted')
//   reloadTradingView()
// })

// let recaptchaScript = document.createElement('script')
//       recaptchaScript.setAttribute('src', 'https://s3.tradingview.com/tv.js')
//       document.head.appendChild(recaptchaScript)
//             new TradingView.widget({
//               autosize: true,
//               symbol: 'BTCUSDT',
//               interval: '60',
//               timezone: 'Etc/UTC',
//               theme: 'dark',
//               style: '1',
//               locale: 'en',
//               toolbar_bg: '#f1f3f6',
//               enable_publishing: false,
//               hide_side_toolbar: false,
//               allow_symbol_change: true,
//               container_id: 'tradingview_6894c',
//             })
</script>

<style scoped>
.side {
  color: grey;
}
.pnl-plus {
  color: green;
}
.pnl-minus {
  color: red;
}
.drag-image {
  margin-right: 5px;
  margin-bottom: 5px;
  float: left;
  width: 100px;
  cursor: -webkit-grab;
  cursor: grab;
}
.link {
  cursor: pointer;
}
.link:hover {
  color: orange;
}
</style>
