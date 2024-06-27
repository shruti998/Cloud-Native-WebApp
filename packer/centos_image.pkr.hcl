# Required Plugins
packer {
  required_plugins {
    googlecompute = {
      version = ">= 1.0.0"
      source  = "github.com/hashicorp/googlecompute"
    }
  }
}

variable "project_id" {
  type    = string
  default = "cloudspring2024"
}
variable "source_image_family" {
  type    = string
  default = "centos-stream-8"
}
variable "zone" {
  type    = string
  default = "us-central1-a"
}
variable "network" {
  type    = string
  default = "default"
}
variable "ssh_username" {
  type    = string
  default = "centos"
}
variable "image_family" {
  type    = string
  default = "centos-stream8"
}

# Source Configuration
source "googlecompute" "csye6225-image" {
  project_id          = "${var.project_id}"
  source_image_family = "${var.source_image_family}"
  zone                = "${var.zone}"
  network             = "${var.network}"
  ssh_username        = "${var.ssh_username}"
  image_family        = "${var.image_family}"
  machine_type        = "n1-standard-4"
  disk_size           = 100

}

# Build Configuration
build {
  sources = ["source.googlecompute.csye6225-image"]

  # Provisioners Configuration
  provisioner "shell" {
    script = "./scripts/centos_update.sh"
  }

  provisioner "shell" {
    script = "./scripts/nodejs_install.sh"
  }

  provisioner "shell" {
    script = "./scripts/unzip_install.sh"
  }

  provisioner "file" {
    source      = "./webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  provisioner "shell" {
    script = "./scripts/webapp_unzip.sh"
  }
  provisioner "shell" {
    script = "./scripts/ops_agent_install.sh"

  }

  provisioner "shell" {
    script          = "./scripts/user_group.sh"
    execute_command = "chmod +x {{ .Path }}; {{ .Vars }} {{ .Path }}"
  }



}