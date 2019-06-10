terraform {
  backend "s3" {
    bucket = "terraform.chriswilding.co.uk"
    key    = "www.chriswilding.co.uk"
    region = "eu-west-1"
  }
}

variable "domain" {
  default = "chriswilding.co.uk"
}

variable "region" {
  default = "eu-west-1"
}

provider "archive" {
  version = "~> 1.2.2"
}

provider "aws" {
  region  = "${var.region}"
  version = "~> 2.14.0"
}

provider "aws" {
  alias   = "us_east_1"
  region  = "us-east-1"
  version = "~> 2.14.0"
}

data "aws_iam_policy_document" "website_s3_bucket_iam_policy_document" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["arn:aws:s3:::www.${var.domain}/*"]

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }
  }
}

resource "aws_s3_bucket" "redirect_s3_bucket" {
  acl    = "public-read"
  bucket = "${var.domain}"

  website {
    redirect_all_requests_to = "https://www.${var.domain}"
  }
}

resource "aws_s3_bucket" "website_s3_bucket" {
  acl    = "public-read"
  bucket = "www.${var.domain}"
  policy = "${data.aws_iam_policy_document.website_s3_bucket_iam_policy_document.json}"

  website {
    error_document = "error.html"
    index_document = "index.html"
  }
}

data "archive_file" "website_lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambda/"
  output_path = "${path.module}/.terraform/lambda.zip"
}

data "aws_iam_policy_document" "website_lambda_iam_policy_document" {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"

    principals {
      type = "Service"

      identifiers = [
        "edgelambda.amazonaws.com",
        "lambda.amazonaws.com",
      ]
    }
  }
}

resource "aws_iam_role" "iam_role_lambda" {
  provider = "aws.us_east_1"

  name = "iam_role_lambda"

  assume_role_policy = "${data.aws_iam_policy_document.website_lambda_iam_policy_document.json}"
}

resource "aws_lambda_function" "website_lambda" {
  provider = "aws.us_east_1"

  filename         = "${data.archive_file.website_lambda_zip.output_path}"
  function_name    = "website_lambda"
  handler          = "lambda.handler"
  publish          = "true"
  role             = "${aws_iam_role.iam_role_lambda.arn}"
  runtime          = "nodejs10.x"
  source_code_hash = "${filebase64sha256("${data.archive_file.website_lambda_zip.output_path}")}"
}

resource "aws_cloudfront_distribution" "website_cloudfront_distribution" {
  depends_on = ["aws_s3_bucket.website_s3_bucket", "aws_lambda_function.website_lambda"]

  aliases             = ["www.${var.domain}"]
  default_root_object = "index.html"
  enabled             = true
  http_version        = "http2"
  price_class         = "PriceClass_100"

  default_cache_behavior {
    allowed_methods        = ["HEAD", "GET", "OPTIONS"]
    cached_methods         = ["HEAD", "GET", "OPTIONS"]
    compress               = true
    default_ttl            = 3600
    max_ttl                = 86400
    min_ttl                = 0
    target_origin_id       = "${aws_s3_bucket.website_s3_bucket.id}"
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    lambda_function_association {
      event_type = "viewer-response"
      lambda_arn = "${aws_lambda_function.website_lambda.arn}:${aws_lambda_function.website_lambda.version}"
    }
  }

  origin {
    domain_name = "${aws_s3_bucket.website_s3_bucket.website_endpoint}"
    origin_id   = "${aws_s3_bucket.website_s3_bucket.id}"

    custom_origin_config {
      origin_protocol_policy = "http-only"
      http_port              = "80"
      https_port             = "443"
      origin_ssl_protocols   = ["SSLv3", "TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = "arn:aws:acm:us-east-1:385160457355:certificate/d7979c2e-844d-4888-90ca-c913b29f87b5"
    ssl_support_method  = "sni-only"
  }
}

resource "aws_route53_zone" "website_route53_zone" {
  name = "${var.domain}"
}

resource "aws_route53_record" "website_route53_a" {
  name    = ""
  type    = "A"
  zone_id = "${aws_route53_zone.website_route53_zone.zone_id}"

  alias {
    evaluate_target_health = false
    name                   = "${aws_s3_bucket.redirect_s3_bucket.website_domain}"
    zone_id                = "${aws_s3_bucket.redirect_s3_bucket.hosted_zone_id}"
  }
}

resource "aws_route53_record" "website_route53_ns" {
  name = ""

  records = [
    "ns-1084.awsdns-07.org",
    "ns-962.awsdns-56.net",
    "ns-1683.awsdns-18.co.uk",
    "ns-192.awsdns-24.com",
  ]

  ttl     = "300"
  type    = "NS"
  zone_id = "${aws_route53_zone.website_route53_zone.zone_id}"
}

resource "aws_route53_record" "website_route53_mx" {
  name    = ""
  records = ["0 chriswilding-co-uk.mail.protection.outlook.com"]
  ttl     = "300"
  type    = "MX"
  zone_id = "${aws_route53_zone.website_route53_zone.zone_id}"
}

resource "aws_route53_record" "website_route53_srv_1" {
  name    = "_sip._tls"
  records = ["100 1 443 sipdir.online.lync.com."]
  ttl     = "300"
  type    = "SRV"
  zone_id = "${aws_route53_zone.website_route53_zone.zone_id}"
}

resource "aws_route53_record" "website_route53_srv_2" {
  name    = "_sipfederationtls._tcp"
  records = ["100 1 5061 sipfed.online.lync.com."]
  ttl     = "300"
  type    = "SRV"
  zone_id = "${aws_route53_zone.website_route53_zone.zone_id}"
}

resource "aws_route53_record" "website_route53_txt" {
  name = ""

  records = [
    "MS=ms75363924",
    "v=spf1 include:spf.protection.outlook.com -all",
  ]

  ttl     = "300"
  type    = "TXT"
  zone_id = "${aws_route53_zone.website_route53_zone.zone_id}"
}

resource "aws_route53_record" "website_route53_autodiscover" {
  name    = "autodiscover"
  records = ["autodiscover.outlook.com."]
  ttl     = "300"
  type    = "CNAME"
  zone_id = "${aws_route53_zone.website_route53_zone.zone_id}"
}

resource "aws_route53_record" "website_route53_sip" {
  name    = "sip"
  records = ["sipdir.online.lync.com."]
  ttl     = "300"
  type    = "CNAME"
  zone_id = "${aws_route53_zone.website_route53_zone.zone_id}"
}

resource "aws_route53_record" "website_route53_lyncdiscover" {
  name    = "lyncdiscover"
  records = ["webdir.online.lync.com."]
  ttl     = "300"
  type    = "CNAME"
  zone_id = "${aws_route53_zone.website_route53_zone.zone_id}"
}

resource "aws_route53_record" "website_route53_msoid" {
  name    = "msoid"
  records = ["clientconfig.microsoftonline-p.net."]
  ttl     = "300"
  type    = "CNAME"
  zone_id = "${aws_route53_zone.website_route53_zone.zone_id}"
}

resource "aws_route53_record" "website_route53_enterpriseregistration" {
  name    = "enterpriseregistration"
  records = ["enterpriseregistration.windows.net."]
  ttl     = "300"
  type    = "CNAME"
  zone_id = "${aws_route53_zone.website_route53_zone.zone_id}"
}

resource "aws_route53_record" "website_route53_enterpriseenrollment" {
  name    = "enterpriseenrollment"
  records = ["enterpriseenrollment.manage.microsoft.com."]
  ttl     = "300"
  type    = "CNAME"
  zone_id = "${aws_route53_zone.website_route53_zone.zone_id}"
}

resource "aws_route53_record" "website_route53_www" {
  name    = "www"
  records = ["${aws_cloudfront_distribution.website_cloudfront_distribution.domain_name}"]
  ttl     = "300"
  type    = "CNAME"
  zone_id = "${aws_route53_zone.website_route53_zone.zone_id}"
}

resource "aws_route53_record" "website_route53_letsencrypt" {
  name = "_acme-challenge"

  records = [
    "ceJ5ytxw2sGjZK0DQRroZ461EIorbTw0XlsgcOly0rE",
  ]

  ttl     = "300"
  type    = "TXT"
  zone_id = "${aws_route53_zone.website_route53_zone.zone_id}"
}
