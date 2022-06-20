
# Deploying to a Managed Instance Group in GCP using Github Actions
**deploy.yaml** is a sample Github Actions workflow that creates an Image with your recent code push with Packer and deploys to an MIG in GCP.

This workflow runs 2 jobs sequentially:

- **packer build**: Building a machine image using Packer
- **deployment**: Deploying to MIG

Each job consists of a list of steps that run on a runner(ubuntu) in this case. You can also run them on a Windows runner or a macOS runner.

Please refer to other directories in this repository for sample Packer configuration files for Google Compute Engine.

We are looking for pull requests to templatize the yaml file.

## License
[MIT]()