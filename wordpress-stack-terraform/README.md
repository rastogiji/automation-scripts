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

| Name              | Description                                                    | Type         | Default                                                                                                 | Required |
| ----------------- | -------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------- | -------- |
| instance_name     | Name of the Instance                                           | string       | null                                                                                                    | yes      |
| instance_zone     | Zone in which to launch the instance                           | string       | europe-west3-c                                                                                          | no       |
| instance_type     | GCP Instance Type to be launched                               | string       | e2-micro                                                                                                | no       |
| vpc_network       | VPC Network in which the instance is launched.                 | string       | default                                                                                                 | no       |
| sa_scopes         | Access Scopes for the Instance                                 | list(string) | ["cloud-platform"]                                                                                      | no       |
| boot_disk_size    | Size of the Boot Disk                                          | number       | 10                                                                                                      | no       |
| boot_disk_type    | Boot Disk Type                                                 | string       | pd-ssd                                                                                                  | no       |
| machine_image     | Boot Image for Wordpress Instance                              | string       | https://www.googleapis.com/compute/v1/projects/click-to-deploy-images/global/images/wordpress-v20220715 | no       |
| instance_purpose  | Label to be attached to the instance                           | string       | null                                                                                                    | yes      |
| sa_email          | Email Id of the service account to be attached to the instance | string       | null                                                                                                    | yes      |
| network_tags      | Network Tags to be attached to the instance                    | list(string) | null                                                                                                    | no       |
| domains           | Domains for which to provision SSL Certficate for              | list(string) | null                                                                                                    | yes      |
| instance_metadata | Metadata key value pairs to be attached with the instance      | map(string)  | null                                                                                                    | yes      |

## Post terraform apply

Once the infrastructure is provisioned, we need to do the following activities to setup Wordpress properly:

- Open domain/wp-admin in a browser
- Sign in to the portal with the admin email and password specified in the instance_metadata
- Go to Plugins and Click on Add New at the top and Install **SSL Insecure Content Fixer**.
- Go to Plugins and activate the plugin.
- Hover your mouse over Settings and click on SSL Insecure Content Fixer. Go to the bottom and select on **HTTP_X_FORWARDED_PROTO (e.g. load balancer, reverse proxy, NginX)** and Save changes.
- Go to Settings in the portal and change wordpress address and site address to http://domain and Save Changes.
