---
date: 2024-03-03
title: Use Terraform for your app's Cloudflare Workers
description: Terraform is an infrastructure as code tool that enables you to provision and manage infrastructure. Let's get started using Terraform to provision Cloudflare infrastructure for your projects.
categories: [DevOps, Remix.run, Terraform, Cloudflare]
---

[Terraform](https://www.terraform.io/) is an infrastructure as code tool that enables you to provision and manage
infrastructure. It uses an adapter/provider model to work with different cloud providers such as AWS, Azure, Google
Cloud, and Cloudflare (just like Remix!). In this article, we will use Terraform to provision Cloudflare infrastructure
like Workers for a Remix app.

## Context

I was looking for a way to codify my infrastructure and cloud settings so they are easier to replicate and review as I
work on open source projects. At the same time, a coworker recommended that I check out Terraform. Perfect timing, as it
seemed like just what I was looking for!

Please note that I am very much a DevOps beginner, and this is my first time seriously dabbling with infrastructure as
code. I hope this article helps you get started and avoid some of my confusion and issues. However, remember that I am
new to Terraform and take my advice as such.

## Initialize a Cloudflare Workers app

First, let's create a new Remix app using the Cloudflare Workers template:

```bash
npx create-remix@latest --template remix-run/remix/templates/cloudflare-workers
```

Of course, we are using Remix! However, for this guide it actually doesn't matter what code runs on Cloudflare Workers.
For instance, you could use a [Hono](https://hono.dev/) app instead. What's important is that we have an example app
that we can deploy and configure.

Note that Remix's official `cloudflare-workers` template is not yet running on Vite. If you want to use a Vite template,
you can use `vite-cloudflare` instead, which uses Cloudflare Pages. I personally haven't used Cloudflare Pages and to
keep it simple, I am sticking with `cloudflare-workers` for this guide.

## Deploy your app via wrangler

Follow the instructions in the project's README to deploy the Remix app to Cloudflare. It should be as easy as
[installing wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/),
[creating a Cloudflare account](https://dash.cloudflare.com/sign-up), and running `npm run deploy`.

[wrangler](https://developers.cloudflare.com/workers/wrangler/) is Cloudflare's command-line interface (CLI). It can be
used to run Workers apps in development, deploy them to Cloudflare, and configure the Worker's production and
development environments. `wrangler` uses the `wrangler.toml` file in the project root to understand what Worker to run,
deploy, and configure.

## Inspecting wrangler.toml

Let's inspect the `wrangler.toml` file in the root of the Remix project. We can configure many aspects of our Worker via
`wrangler.toml` ([see docs](https://developers.cloudflare.com/workers/wrangler/configuration/)), including
[Custom Domains](https://developers.cloudflare.com/workers/wrangler/configuration/#custom-domains),
[Routes](https://developers.cloudflare.com/workers/wrangler/configuration/#routes),
[environment variables](https://developers.cloudflare.com/workers/wrangler/configuration/#environment-variables), D1
databases, Durable Objects, KV stores and more!

Running `wrangler deploy` will also create a new Cloudflare Worker if `wrangler` doesn't find a Worker with the name
specified in the `wrangler.toml` file. This sounds a lot like infrastructure as code, doesn't it? So why would we need
Terraform if Cloudflare's own CLI tool and configuration options allow us to do all of this?

## Why Terraform

Terraform standardizes infrastructure management across an organization. It allows automation and tracking configuration
changes across different cloud and infrastructure providers. Cloudflare's Terraform configuration options go far beyond
provisioning a single Workers environment. You can manage DNS records, your organization, user account access, API
tokens, and more. Personally, I was primarily interested in Terraform because of secret management. One limitation of
`wrangler.toml` is that it doesn't accept environment variables to inject secrets. As I want to build in public, I want
to showcase my `wrangler.toml` without leaking my Cloudflare Workers sensitive information (Workers secrets, account id,
zone id). I didn't like the idea of adding `wrangler.toml` to `.gitignore`.

Let's be real, Terraform is definitely overkill for most weekend projects. However, I found that Terraform, especially
in combination with [Terraform Cloud](https://www.hashicorp.com/products/terraform) and
[HCP Vault](https://www.hashicorp.com/products/vault), offers a really great experience for secret management across
your GitHub Actions, local development environments, and Terraform runs.

## Set up Terraform

Let's start with Terraform by installing the `terraform` CLI. You can find the installation instructions
[here](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli#install-terraform).

On macOS, you can use `brew` for the installation:

```bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
terraform -v
```

Create a `main.tf` file in the root of your Remix project, and set it up to use the
[Cloudflare Provider](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs).

```tf
terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  api_token = "<API_TOKEN>"
}
```

`.tf` files contain the Terraform infrastructure definitions and configurations. The `main.tf` file is the entry point
for Terraform. The `required_providers` block tells Terraform to use the Cloudflare provider and which version to use.
The `provider` block configures the Cloudflare provider with your API token.

Next, [create a Cloudflare API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/). The
`Edit Cloudflare Workers` token preset should be sufficient! Once you copied your API token, replace `<API_TOKEN>` in
`main.tf` with your token value. We will move the secret API token out of `main.tf` file in a moment, but first, let's
try to initialize Terraform:

```bash
terraform init
```

Running the `init` command should create a `.terraform` folder and `.terraform.lock.hcl` file. The `.terraform.lock.hcl`
file works similarly to a `package-lock.json` file and should be added to version control. However, the `.terraform`
folder must be added to `.gitignore` as it may contain sensitive information. You can learn more about the
initialization artifacts in the
[Terraform docs](https://developer.hashicorp.com/terraform/tutorials/cli/init#review-initialization-artifacts).

Add the following entries to your `.gitignore` file:

```txt
.terraform/
terraform.tfstate*
```

### Planning phase

After initialization, Terraform runs consist of two steps: `plan` and `apply` - fairly self-explanatory. First, we run
`plan` to review what changes Terraform plans to make to our current infrastructure:

```bash
terraform plan
```

For now, it should print: `No changes. Your infrastructure matches the configuration.` to the console as we have no
infrastructure instructions yet. Before we add those, a word about state.

### Terraform is stateful

```tsx
const [terraform, setTerraform] = useState(file('terraform.tfstate'));
```

Terraform is stateful. It uses a state file (`terraform.tfstate`) to compute what infrastructure changes to apply based
on the diff between the previous state and new configurations. This means, you always need to execute `terraform plan`
and `terraform apply` in the folder of your `terraform.tfstate` file so that Terraform is aware of the current state of
your cloud infrastructure. Terraform does not ask Cloudflare what infrastructure exists to compute any changes.
Conclusively, you must not make any changes to your Cloudflare infrastructure manually as that may confuse Terraform.

Now it gets tricky, `terraform.tfstate` may contain sensitive information and must not be added to your version control.
How do we allow coworkers to execute Terraform runs if the state lives locally on our computer? How do we automate
`terraform plan` and `terraform apply` via GitHub Actions if the state cannot be version-controlled? This is where I was
ready to quit Terraform for the first time...

Side-note: There is a way to import existing resources into an existing Terraform state. For Cloudflare, you can find
more information in the
[Cloudflare docs](https://developers.cloudflare.com/terraform/advanced-topics/import-cloudflare-resources/).

## Managing Terraform

There are several ways to manage `terraform.tfstate`
([see docs](https://developer.hashicorp.com/terraform/language/state/remote)). For example, you can host it in a secure
S3 bucket, or, of course, use Terraform Cloud.
[HashiCorp's Terraform Cloud](https://www.hashicorp.com/products/terraform) provides a cloud for running
`terraform plan` and `terraform apply` remotely and hosting your `terraform.tfstate`. Since it has a very
[generous-looking free tier](https://www.hashicorp.com/products/terraform/pricing), I gave it a shot!

Create a Terraform Cloud account, a new Terraform Cloud organization, and a workspace. When asked what kind of workspace
to create, I recommend "CLI-Driven Workflow". You can configure version control later in your workspace settings. With
the organization and workspace names at hand, update your `main.tf` file to inform Terraform to perform runs remotely in
the cloud:

```tf
terraform {
  cloud {
    hostname     = "app.terraform.io"
    organization = "<OrganizationName>"

    workspaces {
      name = "<WorkspaceName>"
    }
  }
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  api_token = "<API_TOKEN>"
}
```

Make sure to replace the `<OrganizationName>` and `<WorkspaceName>` values with your organization and workspace names
from Terraform Cloud. In your terminal, run `terraform login` to connect the CLI with your Terraform Cloud account, and
run `terraform init` to set up Terraform Cloud.

## Provisioning infrastructure

Let's finally provision some Cloudflare infrastructure. Let's say our Remix app requires a third-party API token, e.g.,
to send emails via Resend, send messages via Slack, or connect to a headless CMS. For this, we can use `wrangler` or the
Cloudflare UI to set the secret in our Worker environment. Or we use Terraform!

Use the [Cloudflare Provider docs](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs) and search
for "worker". This should show you all possible Worker configuration options, including `cloudflare_worker_secret`.

Add the following entry to your `main.tf` file:

```tf
resource "cloudflare_worker_secret" "my_secret" {
  account_id  = "<CLOUDFLARE_ACCOUNT_ID>"
  name        = "API_KEY"
  script_name = "remix-terraform-cloudflare"
  secret_text = "my_secret_value"
}
```

Rename the resource name (`"my_secret"`), the secret name (`"API_KEY"`), and the secret value (`"my_secret_value"`)
based on your use case. Definitely make sure to update the `account_id` value and replace the `script_name` value with
the name of your Cloudflare Worker (see `wrangler.toml` name entry).

Next, run `terraform plan` to trigger a new remote plan. This should print the configuration changes to your terminal.
Additionally, you can visit the `Run` tab in your Terraform Cloud workspace to view the plan.

```bash
terraform plan
```

Run `terraform apply` to trigger an apply run on Terraform Cloud:

```bash
terraform apply
```

By default apply runs are not applied without approval - confusing, right? Navigate to the Terraform Cloud `Run` tab,
select the apply run, and hit `Confirm & apply` after reviewing the changes. If you head to your Cloudflare UI, navigate
to Workers & Pages, and view your Worker's settings (Variables), you should now see the new `API_KEY` pop up! 🎉

Do you see all the potential to over-engineer your dev blog to new levels with this power?!

Note that you can update your workspace settings to auto-apply `terraform apply`. Also, we probably don't want to run
`terraform plan` and `terraform apply` manually every time we make changes to our `.tf` files. Ideally, we want to
automate this. But first, let's fix our secret management.

## Secret management

So far, we hardcoded our secret values in the `main.tf` file. Let's change that by utilizing `variable` definitions. We
want to create variables for the Cloudflare account id, Cloudflare API token, and our Cloudflare Workers secret value:

```tf
terraform {
  cloud {
    hostname     = "app.terraform.io"
    organization = "AndreLandgrafTest"

    workspaces {
      name = "WorkspaceName"
    }
  }
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.CLOUDFLARE_API_TOKEN
}

variable "CLOUDFLARE_API_TOKEN" {
  description = "API token for Cloudflare provider. Variable set on Terraform Cloud as a sensitive environment variable: TF_VAR_CLOUDFLARE_API_TOKEN."
  type        = string
  sensitive   = true
}

variable "CLOUDFLARE_ACCOUNT_ID" {
  description = "The account ID for the Cloudflare account. Variable set on Terraform Cloud as a sensitive environment variable: TF_VAR_CLOUDFLARE_ACCOUNT_ID."
  type        = string
  sensitive   = true
}

variable "MY_SECRET" {
  description = "The account ID for the Cloudflare account. Variable set on Terraform Cloud as a sensitive environment variable: TF_VAR_MY_SECRET."
  type        = string
  sensitive   = true
}

resource "cloudflare_worker_secret" "my_secret" {
  account_id  = var.CLOUDFLARE_ACCOUNT_ID
  name        = "API_KEY"
  script_name = "remix-terraform-cloudflare"
  secret_text = var.MY_SECRET
}
```

Note: Terraform also supports variable files (`.tfvars`), but so far I didn't feel the need to look into that
([more infos here](https://developer.hashicorp.com/terraform/language/values/variables#variable-definitions-tfvars-files)).

{% statement %}You may want to download the
[HashiCorp Terraform VSCode extension](https://marketplace.visualstudio.com/items?itemName=HashiCorp.terraform) for
syntax highting in `.tf` files.{% /statement %}

Next, let's add the secret values to Terraform Cloud. Each workspace has a `Variables` tab to manage environment
variables. Remember, we provision infrastructure here, not code. These environment variables are for Terraform Cloud to
use them during the `plan` and `apply` runs, not for our Remix app. For each of the three secrets, add a variable and
select `Environment variable` (not Terraform variable!). Check the `Sensitive` checkbox to mark these values as
sensitive and add your key and value. Note that every environment variable has to be prefixed with `TF_VAR_`. This took
me a lot of debugging to figure out...

So, you should have three environment variables defined on Terraform Cloud:

- `TF_VAR_CLOUDFLARE_API_TOKEN` for your Cloudflare API token (`Environment variable`).
- `TF_VAR_CLOUDFLARE_ACCOUNT_ID` for your Cloudflare account id (`Environment variable`).
- `TF_VAR_MY_SECRET` for your Remix app secret that we are injecting into your Cloudflare Workers configuration
  (`Environment variable`).

Great! We now have Terraform Cloud set up to work with the `terraform` CLI to manage our Cloudflare infrastructure. Or
do we? You may have noticed that we ran `wrangler deploy` to create our Workers script. Actually, our `terraform apply`
run would fail without the initial `wrangler deploy` run that created our Cloudflare Worker. Feels odd, doesn't it?

## Infra provisioning vs. app deployment

Terraform is meant to manage infrastructure, and, as far as I understand it, is not meant to to deploy applications.
Terraform is not a deployment pipeline. Instead, Terraform is integrated into your deployment pipeline to make
infrastructure changes, e.g., before or after your code deployments. However, I would have still loved to provision at
least the skeleton Workers script ("the Worker infrastructure") with Terraform before deploying the Remix app with
`wrangler`. Unfortunately, the `cloudflare_worker_script` Terraform resource requires a content property that links to
your Workers script: `content = file("script.js")`
([see docs](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/worker_script)), and I
didn't find an easy way to point it to my Remix build. Instead, I just used `wrangler` and called it a day. This may
very well be a limitation of Cloudflare's current Terraform provider, but it's also not a big deal.

{% statement %}Terraform is infrastructure management, not continuous deployment.{% /statement %}

Ideally, I want to set up a workflow that runs `terraform plan` on pull requests to main, and `terraform apply` and
`wrangler deploy` in sequence on push to main. So, let's discuss automation next.

## Automating Terraform runs

There are several ways to connect Terraform Cloud with GitHub (and other version control systems). The easiest is
probably to connect your GitHub repository directly from the Terraform Cloud UI and set up a Terraform GitHub app. The
app will then set up a webhook on the selected GitHub repository to be notified on pull requests and push to trigger
runs. Alternatively, you can use the `terraform` CLI tool in a custom GitHub Action and trigger the runs from there.

I personally wasn't able to connect my GitHub account to Terraform Cloud: `Failed to install GitHub App`. Instead, I had
to select `GitHub.com (Custom)` in the Terraform Cloud dashboard to create a custom Terraform app for my repository.
That worked fairly well so far for [Aproxima](https://github.com/aproxima-tech/aproxima). However, at least on GitHub,
you cannot tell easily that a push to `main` triggers a Terraform Cloud run unless you navigate to the Webhook settings.
That's why I am likely switching to a custom GitHub Action soon
([example](https://github.com/andrelandgraf/remix-terraform-cloudflare)). Stay tuned!

## Terraform for Remix

Overall, I am very happy with this setup. You can inspect my Aproxima Terraform configurations
[here](https://github.com/aproxima-tech/aproxima/blob/main/infra/main.tf). For now, I am using Terraform to manage DNS
records, my Cloudflare Workers domains, Workers secrets, and to provision a
[D1 database](https://developers.cloudflare.com/d1/). All other configurations live within the `wrangler.toml` files in
each project folder.

Some examples:

### Define a Worker Domain

```tf
resource "cloudflare_worker_domain" "shop" {
  account_id = var.CLOUDFLARE_ACCOUNT_ID
  zone_id    = var.CLOUDFLARE_APROXIMA_NET_ZONE_ID
  hostname   = "shop.aproxima.net"
  service    = "shop"
}
```

### Define a D1 database

```tf
resource "cloudflare_d1_database" "core-db" {
  account_id = var.CLOUDFLARE_ACCOUNT_ID
  name       = "core-db"
}
```

### Define a session cookie secret

```tf
variable "CLOUDFLARE_AUTH_SESSION_COOKIE_SECRET_ONE" {
  description = "The first secret used to sign the user session cookie. Variable set on Terraform Cloud as a sensitive environment variable: TF_VAR_CLOUDFLARE_AUTH_SESSION_COOKIE_SECRET_ONE"
  type        = string
  sensitive   = true
}

resource "cloudflare_worker_secret" "auth-session-cookie-secret-one" {
  account_id  = var.CLOUDFLARE_ACCOUNT_ID
  name        = "AUTH_SESSION_COOKIE_SECRET_ONE"
  script_name = "auth"
  secret_text = var.CLOUDFLARE_AUTH_SESSION_COOKIE_SECRET_ONE
}
```

I hope this helps you to get started with Terraform! Happy coding!

## Resources

- [remix-terraform-cloudflare GitHub repo](https://github.com/andrelandgraf/remix-terraform-cloudflare)
- [learn-terraform-github-actions GitHub repo](https://github.com/hashicorp-education/learn-terraform-github-actions/blob/main/.github/workflows/terraform-apply.yml)
- [GitHub Action .yaml to deploy via wrangler](https://github.com/andrelandgraf/remix-terraform-cloudflare/blob/f68efe9c7a54d2c0eeaeb3f4ef8295f9925be48e/.github/workflows/release.yaml)
