0. I have some kind of TODO website using Firebase Firestore, Vue.js 3 (Pinia), Appengine Image API
1. Demo : https://srisiam.app
2. Register with your email and password
3. Goto menu : trade-diary
4. test add delete diary of trading setting (Some kind of TODO nor ^.^)


# srisiam

# init vue 3 project
https://vuejs.org/guide/quick-start.html

# init vuetify
https://next.vuetifyjs.com/en/getting-started/installation/

# install firebase
https://learnvue.co/2021/06/a-vue-firebase-authentication-tutorial-vue-3-and-firebase/#adding-firebase-to-vue3


# web
cd firebase/web
npm run dev
npm run build
firebase deploy --only hosting

### cloud functions dev REST
cd firebase
firebase emulators:start --only functions
http://localhost:5001/sld-etax/us-central1/testXXX

### cloud functions dev Trigger
cd firebase
firebase functions:shell

### cloud functions deploy
cd firebase
firebase deploy --only functions


# Mr.fox devhack

To-do list application that allows users to create, edit, and delete tasks, set due dates and reminders, and categorize tasks into different lists.

Database: \* + Redis

Programming languages: C# + Javascript/Typescript

API communication: REST API or GRPC

# How to submit

1. Fork this repository
2. Develop the software on a forked repository
3. Create PR with your team information [Create PR](https://github.com/devmountaintechfest/Mr.fox-devhack/pulls)

# Q&A

[Create Issues](https://github.com/devmountaintechfest/Mr.fox-devhack/issues)