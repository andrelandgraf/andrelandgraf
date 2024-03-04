---
date: 2024-03-03
title: Use Terraform to manage Cloudflare for your Remix.run app
description: Terraform is an infrastructure as code tool that enables you to provision and manage infrastructure. Let's get started using Terraform to provision Cloudflare infrastructure for your Remix projects.
categories: [DevOps, Remix.run, Terraform, Cloudflare]
---

[Terraform](https://www.terraform.io/) is an infrastructure as code tool that enables you to provision and manage infrastructure. Like Remix, Terraform uses an adapter/provider model to work with different cloud providers such as AWS, Azure, Google Cloud, and Cloudflare. In this article, we will use Terraform to provision Cloudflare infrastructure for a Remix app.

## Context

I recently started a new side project, [Aproxima](https://github.com/aproxima-tech/aproxima). The goal is to design and build good-looking smart home devices, and sell them online! It's going to be a long journey, and to share my learnings, I will build everything in public. This is my most ambitious side project to date and I am excited for the learning I can get out of it!

To truly build in public, I was looking for a way to codify my infrastructure and cloud settings so it is easier to replicate and review. I didn't feel like writing docs how I set up my DNS records on Cloudflare. Instead, I wanted all configurations to be visible in code. Also, a coworker told me to check out Terraform. Perfect!

Note that I am very much a DevOps beginner. This is the first time that I am seriously dabbling with infrastructure as code. I hope this article help you to get started with Terraform, and avoid some of my confusion and issues, but keep in mind that I am very new to Terraform as well.

## Get started

Without further due, let's get started!

### Initialize a Cloudflare Workers app

First, let's create a new Remix app using the Cloudflare Workers template.

```bash
npx create-remix@latest --template remix-run/remix/templates/cloudflare-workers
```

Of course, we are going to use Remix! However, for this guide it actually doesn't matter what runs on the Cloudflare Workers. This could as well be a [Hono](https://hono.dev/) REST API or any other app running on Cloudflare Workers.

Note that Remix's official `cloudflare-workers` template is not yet running vite. For this, you can use the `vite-cloudflare` template instead. However, it is running on Cloudflare Pages, which I haven't used and thus, are sticking with the `cloudflare-workers` template for this guide.

### Deploy your app via wrangler

Next, we use [wrangler](https://developers.cloudflare.com/workers/wrangler/), Cloudflare's command-line interface (CLI) to deploy our Remix app to Cloudflare. For this, just follow the README in your Remix app.

It should be as easy as [installing wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/), [creating a Cloudflare account](https://dash.cloudflare.com/sign-up), and running `npm run deploy`.

Great, we have our Remix app up and running on Cloudflare! 🎉 But wait, how does Terraform fit into the picture?

### Inspecting wrangler.toml

Let's inspect the `wrangler.toml` file in the root of your Remix project. It turns out that `wrangler` uses a configuration file to deploy our code to Cloudflare Workers. It turns out that you can already codify every aspect of your Cloudflare Workers configurations using `wrangler.toml` ([see docs](https://developers.cloudflare.com/workers/wrangler/configuration/)), including configuring [Custom Domains](https://developers.cloudflare.com/workers/wrangler/configuration/#custom-domains) and [Routes](https://developers.cloudflare.com/workers/wrangler/configuration/#routes) and [environment variables](https://developers.cloudflare.com/workers/wrangler/configuration/#environment-variables). This goes as far, as creating/binding databases, durable objects, KV stores and more! So why would we need Terraform if Cloudflare's own CLI tool and configuration options allow us to do all of this?

Note that the `wrangler.toml` file includes a `name` entry. This is the name of the Workers script that will be created or updated when you run `wrangler deploy`. I named mine `remix-terraform-cloudflare` after my test repository.

### Why Terraform

Terraform can be used to provision and manage infrastructure across different providers and clouds. This allows you to use one tool (Terraform) to manage and automate all of your infrastructure requirements. Instead of learning the AWS way and the Cloudflare way, you can use one tool for both. Personally, I am currently only using Terraform for Cloudflare. So this wasn't much of a reason for me personally. One downside of `wrangler.toml` is that it doesn't accept environment variables to inject secrets. As I want to build in public, I want to showcase my infrastructure configuration as code without leaking my Cloudflare Workers secrets and potentially sensitive information (account id, zone id). I found that Terraform, especially in combination with [Terraform Cloud](https://www.hashicorp.com/products/terraform) and [HCP Vault](https://www.hashicorp.com/products/vault) offers a really great experience for secret management across your GitHub Actions, local development environments, and Terraform `apply` runs.

In bigger organizations, Terraform really starts shining and can be used to provision employee access across cloud platforms, manage API tokens, execute infra migrations and much more. Of course, Terraform is probably overkill for side-projects unless you want to codify everything in public. It probably is much more valuable for bigger teams and cross-cloud projects. But, I have to also say that I am really enjoying myself (after the initial setup bugs and learnings). So let's use it! 😎

### Setup Terraform

Let's start by installing the `terraform` CLI. You can find the installation instructions [here](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli#install-terraform).

Since I am on macOS, I use `brew` for the installation:

```bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
terraform -v   
```

Done! Next, create a `main.tf` file in the root of your project, and set it up to use the [Cloudflare Provider](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs).

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

This configures terraform to install the Cloudflare provider. Next, use the Cloudflare UI to [create a Cloudflare API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/). The `Edit Cloudflare Workers` token preset should be sufficient! If your project concerns one or a set of domains, it's probably best to limit your API token's scope to these domain zones. If you don't have a domain on Cloudflare, then you can just select 'All zones'. Finally, replace `<API_TOKEN>` in `main.tf` with your Cloudflare API token. We will move the secret API token out of `main.tf` file in a moment, but first, let's try and run `terraform`.

```
terraform init
```

This should create a `.terraform` folder and `.terraform.lock.hcl` file. The `.terraform.lock.hcl` file works similarly to a `package-lock.json` file, and it is recommended to add it to your version control. However, the `.terraform` folder should be added to `.gitignore`. You can learn more about the initialization artifacts in the [Terraform docs](https://developer.hashicorp.com/terraform/tutorials/cli/init#review-initialization-artifacts). According to the docs, your `.gitignore` file should look as follows:

```txt
.terraform/
terraform.tfstate*
```

## Planning phase

Once setup, Terraform has two main phases: `plan` and `apply` - fairly self-explanatory. Let's run `plan` to see what changes Terraform would want to make to our current infrastructure:

```bash
terraform plan
```

It should print: `No changes. Your infrastructure matches the configuration.` to your terminal. So far so good, as we currently have no infrastructure configurations. Before we add those, a word about state.

## Terraform is stateful

```ts
const [terraform, setTerraform] = useState('main.tf');
```

Terraform is stateful. It uses a state file (`terraform.tfstate`) to compute what infrastructure changes to apply based on the diff of previous configuration and new configuration files. This means, Terraform does not ask Cloudflare what infrastructure exists to compute any changes, but only it's (local) state. Conclusively, you must not make any changes to your Cloudflare infrastructure manually as that may confuse Terraform. Similarly, you always need to execute `terraform plan` and `terraform apply` in the folder of your `terraform.tfstate` file.

Now it gets tricky, `terraform.tfstate` may contain sensitive information and must not be added to your version control. How do we automate `terraform plan` and `terraform apply` via GitHub Actions or across different devices if we need to share a file that cannot be version controlled? This is where I was ready to quit Terraform for the first time...

## Managing Terraform

There are several ways to manage `terraform.tfstate` ([see docs](https://developer.hashicorp.com/terraform/language/state/remote)). For example, you can host it in a secure S3 bucket, or, of course, use Terraform Cloud.

Turns out this is one of the main use cases of [HashiCorp's Terraform Cloud](https://www.hashicorp.com/products/terraform). It provides a cloud for running `terraform plan` and `terraform apply` and hosting your `terraform.tfstate`. Since it has a very [generous-looking free tier](https://www.hashicorp.com/products/terraform/pricing), I gave it a shot!

Create a Terraform Cloud account, create a new Terraform Cloud organization and workspace. When asked what kind of workspace to create, I recommend "CLI-Driven Workflow". You can just add a Version Control Workflow later in the workflow settings. With the organization name and workspace name at hand, update your `main.tf` file to inform Terraform to run `terraform plan` and `terraform apply` remotely:

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

Make sure to replace the `organization` and `workspaces` values with your organization and workspace name from Terraform Cloud. Now you can run `terraform` locally or via CI/CD to trigger runs on Terraform Cloud.

Locally, run `terraform login` to connect the CLI with your Terraform Cloud account, and `terraform init` after that to set up Terraform Cloud.

## Provisioning infrastructure

Let's finally provision some Cloudflare infrastructure. Let's say our Remix app requires a third-party API token, e.g., to send emails via Resend, send messages via Slack, or connect to a headless CMS. For this, we can use `wrangler` or the Cloudflare UI to set the secret in our worker's environment. Or we use Terraform!

Use the [Cloudflare Provider docs](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs) and search for `worker`. This should show you all possible worker configuration options, including `cloudflare_worker_secret`.

Add the following entry to your `main.tf` file:

```tf
resource "cloudflare_worker_secret" "my_secret" {
  account_id  = <CLOUDFLARE_ACCOUNT_ID>
  name        = "API_KEY"
  script_name = "remix-terraform-cloudflare"
  secret_text = "my_secret_value"
}
```

Adapt the values based on the Cloudflare Provider docs and your use case. Next, run `terraform plan`, which triggers a new remote plan: `Preparing the remote plan..`. It prints the configuration changes to your terminal. Additionally, you can visit the `Run` tab in your Terraform Cloud workspace to view the plan. Run `terraform apply` to trigger an `apply` on Terraform Cloud. By default `apply` runs are not applied without approval. Navigate to the Terraform Cloud `Run` tab, select the `apply` run and hit `Confirm & apply` after reviewing the changes. 

If you head to your Cloudflare UI, navigate to Workers & Pages, and view your Worker's settings (Variables), you should now see the new `API_KEY` pop up! 🎉 Don't you see all the potential to over-engineer your dev blog to new levels with this power?!

Note that you can update your workspace settings to auto-apply `terraform apply`. Also, we probably don't want to run `terraform plan` and `terraform apply` manually every time we make changes to our `.tf` files. Ideally, we want to automate this. But first, let's fix our secret management.

## Secret management

So far, we hardcoded our secret values in the `main.tf` file. Let's change that by utilizing `variable` definitions. We want to create variables for the Cloudflare account id, API token, and the Cloudflare Workers secret value:

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

{% statement %}
You may want to download the [HashiCorp Terraform VSCode extension](https://marketplace.visualstudio.com/items?itemName=HashiCorp.terraform) for syntax highting in `.tf` files.
{% /statement %}

Next, let's add the secret values to Terraform Cloud. Each workspace has a `Variables` tab to manage environment variables.Remember, we provision infrastructure here, not code. These environment variables are for Terraform Cloud to use them during the `plan` and `apply` runs, not for our Remix app. For each of the three secrets, add a variable and select `Environment variable` (not Terraform variable). Check the `Sensitive` checkbox to mark these values as sensitive and add your key and value. Note that every environment variable has to be prefixed with `TF_VAR_`. This took me a lot of debugging to figure out.

So, you should have three environment variables defined on Terraform Cloud:

- `TF_VAR_CLOUDFLARE_API_TOKEN` for your Cloudflare API token.
- `TF_VAR_CLOUDFLARE_ACCOUNT_ID` for your Cloudflare account id.
- `TF_VAR_MY_SECRET` for your Remix app secret that we are injecting into your Cloudflare Workers configuration.

Great! We now have Terraform Cloud set up to work with the `terraform` CLI to manage our Cloudflare infrastructure. Or do we? You may have noticed that we ran `wrangler deploy` to create our Workers script. Isn't that kind of what we want to do with Terraform?

## Infra provisioning vs. app deployment

Terraform is meant to manage infrastructure. As far as I understand it, it is not meant to be used to deploy your applications and act as your continuous deployment tool. Instead, Terraform is integrated into your continuous integration and deployment (CI/CD) pipeline to make infrastructure changes, e.g., before or after your deployments.

However, I would have still loved to provision at least the skeleton Workers script with Terraform before deploying it with `wrangler`. Unfortunately, the `cloudflare_worker_script` Terraform resource requires a `content = file("script.js")` property that links to your Workers script ([see docs](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/worker_script)), and I didn't find an easy way to point it to my Remix build. Instead, I just used `wrangler` and called it a day.

Terraform is part of my GitHub Actions workflow (CI/CD), but not responsible for deploying my code. Again, I am new to Terraform, and maybe this is also due to some limitations with the Terraform Cloudflare Provider, but you should not try to use Terraform to deploy, but to configure.

{% statement %}
Terraform is infrastructure management, not continuous deployment.
{% /statement %}

## Automating Terraform runs

Let's wrap this up by automating `terraform plan` and `terraform apply` as part of a deployment GitHub Action. There are several ways to connect Terraform Cloud with GitHub. You can connect your GitHub repository directly from the Terraform Cloud UI and set Terraform up as a GitHub app. Alternatively, you can use the `terraform` CLI tool in a GitHub Action.

I personally wasn't able to connect my GitHub account on Terraform Cloud: `Failed to install GitHub App`. Instead, I had to select `GitHub.com (Custom)` to create a custom Terraform app for my repository. That worked fairly well so far for [Aproxima](https://github.com/aproxima-tech/aproxima), but it lacks a bit of transparency and control. At least on GitHub, you cannot tell that a push to `main` triggers a Terraform Cloud run. That's why I am likely switching to a custom GitHub Action soon. Stay tuned!

## Terraform for Remix

Overall, I am very happy with this setup. You can see my Aproxima Terraform configurations [here](https://github.com/aproxima-tech/aproxima/blob/main/infra/main.tf), which manages the configurations for three Remix apps and one Hono REST API. For now, I use Terraform to manage DNS records, including my Cloudflare Workers domains, manage Workers secrets, and the provisioning of a [D1 database](https://developers.cloudflare.com/d1/). All other configurations live within the `wrangler.toml` files in each project folder.

## Resources

- [remix-terraform-cloudflare GitHub repo](https://github.com/andrelandgraf/remix-terraform-cloudflare)
- [learn-terraform-github-actions GitHub repo](https://github.com/hashicorp-education/learn-terraform-github-actions/blob/main/.github/workflows/terraform-apply.yml)