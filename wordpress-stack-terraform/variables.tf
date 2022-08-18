variable "instance_name" {
  type        = string
  description = "Name of the Instance"
}
variable "instance_zone" {
  type        = string
  description = "Zone in which the instance shall be placed"
  default     = "europe-west3-c"
}
variable "instance_type" {
  type        = string
  description = "Type of the instance. For ex. e2-micro"
  default     = "e2-micro"
}
variable "vpc_network" {
  type        = string
  description = "VPC Name in which to launch the instance"
  default     = "default"
}
variable "sa_scopes" {
  type        = list(string)
  description = "scopes of the SA attached to the instance"
  default     = ["cloud-platform"]
}
variable "boot_disk_size" {
  type        = number
  description = "Boot Disk Size"
  default     = 10
}
variable "boot_disk_type" {
  type        = string
  description = "Type of Boot Disk. For ex. pd-ssd"
  default     = "pd-ssd"
}
variable "machine_image" {
  type        = string
  description = "Image to be used for the Instance. Could be GCP base images or images created by user"
  default     = "https://www.googleapis.com/compute/v1/projects/click-to-deploy-images/global/images/wordpress-v20220715"
}
variable "instance_purpose" {
  type        = string
  description = "Purpose of the Instance. To be added as a label to the instance as purpose=wordpress"
}
variable "sa_email" {
  type        = string
  description = "Email Id of the SA to be attached with the Instance"
}
variable "network_tags" {
  type        = list(string)
  description = "List of Network tags to be attached to the instance"
  default     = [""]
}
variable "instance_metadata" {
  type        = map(string)
  description = "Metadata Values to be attached with the instance"
  sensitive   = true
}
variable "domains" {
  type        = list(string)
  description = "Domains for which to issue SSL cert"
}
