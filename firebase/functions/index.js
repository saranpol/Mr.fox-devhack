const admin = require('firebase-admin')
admin.initializeApp()

exports.onWriteUserTradeDiary = require('./src/onWriteUserTradeDiary')
