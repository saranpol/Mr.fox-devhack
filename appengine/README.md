# appengine images service (golang)
cd appengine/images
# dev
dev_appserver.py app.yaml --application=images --port=8080
# deploy
gcloud config set project srisiam
gcloud app deploy