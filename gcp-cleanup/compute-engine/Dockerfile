FROM marketplace.gcr.io/google/nodejs:latest
LABEL Author="Animesh Rastogi"

COPY compute-cleanup.js package* my-app/
WORKDIR my-app/
RUN npm install
ENTRYPOINT [ "node", "compute-cleanup.js" ]