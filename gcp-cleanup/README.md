# Cleaning Up Long Running Resources in GCP.

Cloud Run Service to Delete/Stop Long Running Resources on GCP. This script runs every 24 hours and deletes resources that have been in the Running State for longer than 24 hours.

This is Ideal for your Dev/Sandbox environments where you want to give flexibility to your developers but want to control costs as well.

## Installation

- Fork the Repository
- Use your favorite CI/CD tool to build a container image using the Dockerfile and deploy it to Cloud Run.
- Create a Cloud Scheduler Job which gets triggered at 12 PM every night.

## Tracker

- [x] Compute Engine
- [ ] Cloud SQl
- [ ] GKE
- [ ] Disks
