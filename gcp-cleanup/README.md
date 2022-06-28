# gcp-cleanup - a Tool to Clean up your GCP project.

**gcp-cleanup** is a [NodeJS](https://nodejs.org/en/) based CLI tool to clean up stray and unutilised resources in your GCP environment. The primary use case that this tool solves is cost control for your Development or Sandbox environments.

gcp-cleanup is completely open source and contributions are welcome! Note that this tool stops/deletes resources in your GCP project which may cause service disruptions so it's recommended not to use this with your production environments.

## Pre requisites

Before starting, you would need the following pre requisites to be satisfied:

- Nodejs
- gcloud CLI which is authenticated and configured with your project.

## Installation

```bash
git clone https://github.com/rastogiji/automation-scripts.git
cd gcp-cleanup
npm i -g
```

Now you should be able to use gcp-cleanup in your environment as well. Test it out by running

```bash
gcp-cleanup -V
```

## Status Tracking

This is WIP tool which only has limited coverage as of now. We have planned to add the following features in the coming month(July).

- [x] VM Instance Deletion
- [x] VM Instance Stoppage
- [x] Unattached Disk Deletion
- [ ] SQL Instance Stoppage
- [ ] Releasing Unused IP addresses.
- [ ] Reducing MIG size

## License

[MIT](../LICENSE)
