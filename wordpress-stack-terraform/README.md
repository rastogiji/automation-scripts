# Terraform Module to Deploy Wordpress on GCP with SSL.

Terraform Module to Deploy the entire Wordpress stack on a GCP VM. The resources Deployed by the Modules are as follows:

- VM with Wordpress Image
- Unmanaged Instance Group
- HTTPS Load Balancer with an SSL certificate

![GCP Resources Deployed](wordpress-terraform.jpg?raw=true)

## Usage

```HCL
module "wordpress_server" {
  source           = "https://github.com/rastogiji/automation-scripts/tree/master/wordpress-stack-terraform"
  instance_name    = "wordpress-test"
  instance_purpose = "testing"
  sa_email         = var.sa_email
  machine_image    = "https://www.googleapis.com/compute/v1/projects/click-to-deploy-images/global/images/wordpress-v20220715"
  network_tags     = ["http-server", "https-server"]
  domains          = var.domains
  instance_zone    = "asia-south1-a"
  instance_metadata = {
    wordpress-enable-https   = "True"
    wordpress-admin-email    = var.admin_email
    installphpmyadmin        = "True"
    wordpress-mysql-password = var.mysql_password
    mysql-root-password      = var.mysql_root_password
    wordpress-admin-password = var.wp-admin_password
    enable-os-login          = "True"
  }
}
```

## Inputs

| Name          | Description                                    | Type         | Default            | Required |
| ------------- | ---------------------------------------------- | ------------ | ------------------ | -------- |
| instance_name | Name of the Instance                           | string       | null               | yes      |
| instance_zone | Zone in which to launch the instance           | string       | europe-west3-c     | no       |
| instance_type | GCP Instance Type to be launched               | string       | e2-micro           | no       |
| vpc_network   | VPC Network in which the instance is launched. | string       | default            | no       |
| sa_scopes     | Access Scopes for the Instance                 | list(string) | ["cloud-platform"] | no       |
