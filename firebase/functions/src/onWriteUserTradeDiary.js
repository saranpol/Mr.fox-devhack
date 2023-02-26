const functions = require('firebase-functions')
const admin = require('firebase-admin')
const db = admin.firestore()

module.exports = functions.firestore.document('User/{userID}/TradeDiary/{tradeDiaryID}').onWrite(async (change, ctx) => {
  console.log('### onWriteUserTradeDiary ###')
  const data0 = change.before.data()
  const data1 = change.after.data()
  let docAction = 0 // 1 = create , 2 = delete , 3 = update

  if (!data0 && data1) {
    console.log('##### Create Doc #####')
    docAction = 1 // create
  }
  if (data0 && !data1) {
    console.log('##### Delete Doc #####')
    docAction = 2 // delete
  }
  if (data0 && data1) {
    console.log('##### Update Doc #####')
    docAction = 3 // update
  }
  if (!data0 && !data1) {
    console.log('##### Invalid Doc Action #####')
    return false
  }

  let sizePNL0 = 0
  let sizePNL1 = 0

  if (data0) {
    sizePNL0 = data0.sizePNL
    if (!sizePNL0) { sizePNL0 = 0 }
  }

  if (data1) {
    sizePNL1 = data1.sizePNL
    if (!sizePNL1) { sizePNL1 = 0 }
  }

  const userID = ctx.params.userID
  // const tradeDiaryID = ctx.params.tradeDiaryID
  const sizePNLDiv = sizePNL1 - sizePNL0

  // ##### START PROCESS #####
  const shardID = ctx.eventId
  const shardPath = '/_counter_shards_/' + shardID

  // for Info
  const infoPath = '/User/' + userID + '/TradeDiaryInfo/'
  const eventIDsPath = '/User/' + userID + '/_event_ids_/'

  const refEventIDs = db.doc(eventIDsPath + shardID)
  const ref0 = db.doc(infoPath + 'all' + shardPath)

  // ##### Count Logic
  // 1 = create , 2 = delete , 3 = update

  let winDiv = 0
  let loseDiv = 0

  if (sizePNL0 > 0 && sizePNL1 <= 0) {
    winDiv = -1
  }
  if (sizePNL0 < 0 && sizePNL1 >= 0) {
    loseDiv = -1
  }
  if (sizePNL0 >= 0 && sizePNL1 < 0) {
    loseDiv = 1
  }
  if (sizePNL0 <= 0 && sizePNL1 > 0) {
    winDiv = 1
  }

  const incrementData = {
    sizePNLTotal: admin.firestore.FieldValue.increment(sizePNLDiv),
    winCount: admin.firestore.FieldValue.increment(winDiv),
    loseCount: admin.firestore.FieldValue.increment(loseDiv),
  }

  if (docAction === 1 || docAction === 2) {
    let increment = 1
    if (docAction === 2) {
      increment = -1
    }
    incrementData['tradeDiaryCount'] = admin.firestore.FieldValue.increment(increment)
  }

  await db.runTransaction(async (t) => {
    const doc = await t.get(refEventIDs)
    if (!doc.exists) {
      const promises = []
      promises.push(t.set(refEventIDs, { data: true }))
      promises.push(t.set(ref0, incrementData, { merge: true }))
      await Promise.all(promises)
    }
  })
})


/*
firebase functions:shell

// # create
onWriteUserTradeDiary({
    after: {
      'sizePNL': 0,
    }
  }, {
    params: {userID: 'test', tradeDiaryID: '111'}
  }
)
// # update
onWriteUserTradeDiary({
    before: {
      'sizePNL': 0,
    },
    after: {
      'sizePNL': -555,
    }
  }, {
    params: {userID: 'test', tradeDiaryID: '111'}
  }
)

// # delete
onWriteUserTradeDiary({
    before: {
      'sizePNL': -555,
    },
  }, {
    params: {userID: 'test', tradeDiaryID: '111'}
  }
)
*/
