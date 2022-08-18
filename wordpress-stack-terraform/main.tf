terraform {
  required_version = ">=0.12"
}

resource "google_compute_instance" "wordpress_instance" {
  name         = var.instance_name
  zone         = var.instance_zone
  machine_type = var.instance_type
  network_interface {
    network = var.vpc_network
    access_config {
    }
  }
  tags = var.network_tags
  boot_disk {
    initialize_params {
      size  = var.boot_disk_size
      type  = var.boot_disk_type
      image = var.machine_image
    }
  }
  labels = {
    "purpose" = var.instance_purpose
    "name"    = var.instance_name
  }
  service_account {
    email  = var.sa_email
    scopes = var.sa_scopes
  }
  metadata = var.instance_metadata
}

# Creating a UMIG
resource "google_compute_instance_group" "wordpress_instance_group" {
  name = "${var.instance_name}-group"
  zone = var.instance_zone

  instances = [google_compute_instance.wordpress_instance.id]
  named_port {
    name = "http"
    port = "80"
  }
}

resource "google_compute_health_check" "wordpress_healthcheck" {
  name               = "${var.instance_name}-healthcheck"
  timeout_sec        = 2
  check_interval_sec = 5
  http_health_check {
    port = 80
  }
}

resource "google_compute_backend_service" "wordpress_backend" {
  name          = "${var.instance_name}-backend-service"
  port_name     = "http"
  protocol      = "HTTP"
  health_checks = [google_compute_health_check.wordpress_healthcheck.self_link]
  backend {
    group                 = google_compute_instance_group.wordpress_instance_group.self_link
    balancing_mode        = "RATE"
    max_rate_per_instance = 100
  }
}

resource "google_compute_url_map" "https_redirect" {
  name = "${var.instance_name}-http-lb"
  default_url_redirect {
    https_redirect = true
    strip_query    = false
  }

}
resource "google_compute_url_map" "wordpress_url_map" {
  name            = "${var.instance_name}-https-lb"
  default_service = google_compute_backend_service.wordpress_backend.self_link
  host_rule {
    hosts        = ["*"]
    path_matcher = "${var.instance_name}-path-matcher"
  }
  path_matcher {
    name            = "${var.instance_name}-path-matcher"
    default_service = google_compute_backend_service.wordpress_backend.self_link
    path_rule {
      paths   = ["/*"]
      service = google_compute_backend_service.wordpress_backend.self_link
    }
  }
}

resource "google_compute_managed_ssl_certificate" "wordpress_cert" {
  name = "${var.instance_name}-ssl-cert"
  managed {
    domains = var.domains
  }
}

resource "google_compute_target_http_proxy" "wordpress_target_http_proxy" {
  name    = "${var.instance_name}-http-proxy"
  url_map = google_compute_url_map.https_redirect.self_link
}

resource "google_compute_target_https_proxy" "wordpress_target_https_proxy" {
  name             = "${var.instance_name}-https-proxy"
  url_map          = google_compute_url_map.wordpress_url_map.self_link
  ssl_certificates = [google_compute_managed_ssl_certificate.wordpress_cert.self_link]
}

resource "google_compute_global_address" "wordpress_lb_address" {
  name       = "${var.instance_name}-lb-address"
  ip_version = "IPV4"
}

resource "google_compute_global_forwarding_rule" "wordpress_global_forwarding_rule_http" {
  name       = "${var.instance_name}-global-forwarding-rule-http"
  target     = google_compute_target_http_proxy.wordpress_target_http_proxy.self_link
  port_range = "80"
  ip_address = google_compute_global_address.wordpress_lb_address.self_link
}

resource "google_compute_global_forwarding_rule" "wordpress_global_forwarding_rule_https" {
  name       = "${var.instance_name}-global-forwarding-rule-https"
  port_range = "443"
  target     = google_compute_target_https_proxy.wordpress_target_https_proxy.self_link
  ip_address = google_compute_global_address.wordpress_lb_address.self_link
}


