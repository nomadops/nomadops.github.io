---json
{
  "title": "Services",
  "order": 2,
  "permalink": "/services/",
  "layout": "layouts/base.njk",
  "description": "DevOps and SRE agents, MCP servers for your app, operations tools and panels, help getting your team ready for agents, and CI/CD pipelines and infrastructure your team can change safely.",
  "ogDescription": "DevOps and SRE agents, MCP servers and operations panels for your app.",
  "sections": [
    {
      "type": "pageHero",
      "eyebrow": "Services",
      "title": "Agents, and everything they need to work safely.",
      "lead": "We develop DevOps and SRE agents, build MCP servers and operations tools into your app, and help your team improve its agentic DevOps and SRE posture."
    },
    {
      "type": "services",
      "items": [
        {
          "id": "agents",
          "label": "01 · Agents",
          "title": "DevOps and SRE agents",
          "intro": "We develop our own DevOps and SRE agents, and we work with the agents your team already uses.",
          "agents": [
            {
              "name": "HeyPenny",
              "role": "General-purpose fixer"
            },
            {
              "name": "InspectorGadget",
              "role": "Finder and debugger"
            },
            {
              "name": "Atlas",
              "role": "Builds pipelines"
            }
          ],
          "items": [
            "Setup and connection of the SRE and DevOps agents your team already uses",
            "Tests for agent behavior, built from your own past incidents",
            "Approval steps and logs for every agent action"
          ],
          "tags": [
            "SRE agents",
            "DevOps agents",
            "MCP"
          ]
        },
        {
          "id": "mcp",
          "label": "02 · MCP",
          "title": "MCP servers for your app",
          "intro": "MCP servers (connectors that let AI agents use your app's tools), made for SRE and DevOps work.",
          "items": [
            "Read tools for health, logs, metrics, deploys and queues",
            "Action tools such as retry, restart and roll back, each with its own approval rule",
            "Access per agent and per tool, and a log of every call",
            "Works with any agent that supports MCP"
          ]
        },
        {
          "id": "apps",
          "label": "03 · Apps",
          "title": "Operations tools and panels in your app",
          "intro": "Useful operations tools, built directly into your app, for your team and your agents.",
          "items": [
            "Health and status panels for each part of your app",
            "Admin actions with confirmation steps and an audit log",
            "Agent activity and approvals in one place",
            "The same actions for people in the panel and for agents through MCP"
          ]
        },
        {
          "id": "posture",
          "label": "04 · Teams",
          "title": "Agentic DevOps and SRE posture",
          "intro": "Help for companies and teams to improve how well agents can see, run and fix their product safely.",
          "items": [
            "A review of your product, pipelines and operations: what agents can see and do today",
            "A plan for access, approval steps, runbooks, logs and alerts",
            "Shared setup and review rules for the agents your engineers use",
            "Workshops and pairing sessions on real work from your backlog"
          ]
        },
        {
          "id": "pipelines",
          "label": "05 · Pipelines",
          "title": "CI/CD pipelines and infrastructure",
          "intro": "Delivery pipelines and cloud infrastructure that people and agents can change safely.",
          "items": [
            "CI/CD pipelines with a check on every change, preview environments and a rollback path",
            "Infrastructure as code for the cloud you already use, with a plan or preview on every change",
            "Everything in your repositories, documented and handed over"
          ],
          "tags": [
            "CI/CD",
            "Infrastructure as code"
          ]
        }
      ]
    },
    {
      "type": "steps",
      "eyebrow": "How a project works",
      "title": "Start small, then widen.",
      "items": [
        {
          "title": "Assess",
          "text": "We review your product's agentic DevOps and SRE posture, and choose the first jobs for agents."
        },
        {
          "title": "Build",
          "text": "We build in your repositories and your app, through your review process. You see every change."
        },
        {
          "title": "Hand over",
          "text": "We document everything and train your team, so you own and run what we built."
        }
      ]
    },
    {
      "type": "cta",
      "title": "Not sure where to start? Tell us which work repeats.",
      "label": "Contact us",
      "href": "/#contact"
    }
  ]
}
---
