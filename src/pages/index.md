---json
{
  "title": "Home",
  "order": 1,
  "permalink": "/",
  "layout": "layouts/base.njk",
  "description": "nomadops develops DevOps and SRE agents, builds MCP servers and operations panels into apps, and helps teams improve their agentic DevOps and SRE posture.",
  "ogDescription": "DevOps and SRE agents, MCP servers and operations panels for your app.",
  "sections": [
    {
      "type": "hero",
      "eyebrow": "Agentic DevOps · SRE · MCP servers",
      "title": "DevOps and SRE agents your team can trust.",
      "lead": "We develop DevOps and SRE agents, build MCP servers and operations panels into your app, and help teams improve their agentic DevOps and SRE posture.",
      "actions": [
        {
          "label": "Start a project",
          "href": "#contact"
        },
        {
          "label": "Meet our agents",
          "href": "#agents",
          "variant": "btn-ghost"
        }
      ],
      "terminal": {
        "title": "Incident on /checkout",
        "pill": "sre · production",
        "whyHref": "#principles",
        "waiting": "HeyPenny is waiting for your approval",
        "lines": [
          {
            "sym": "fail",
            "text": "alert: error rate up on /checkout"
          },
          {
            "agent": "InspectorGadget",
            "note": "finding the cause"
          },
          {
            "text": "mcp: your-app.get_health"
          },
          {
            "text": "mcp: your-app.list_deploys"
          },
          {
            "text": "cause: deploy 4f2c1a changed a timeout"
          },
          {
            "agent": "HeyPenny",
            "note": "preparing the fix"
          },
          {
            "text": "prepared a rollback of 4f2c1a"
          },
          {
            "sym": "ok",
            "text": "policy checks passed"
          }
        ]
      }
    },
    {
      "type": "toolStrip",
      "label": "We work with",
      "items": [
        "AWS",
        "Azure",
        "Amazon Bedrock",
        "PostgreSQL",
        "Supabase",
        "Railway",
        "Netlify",
        "Claude",
        "OpenAI",
        "rizom.ai"
      ]
    },
    {
      "type": "cards",
      "id": "build",
      "eyebrow": "What we do",
      "title": "Agents, and everything they need to work safely.",
      "lead": "We develop agents, give them safe ways into your app, and help your team get ready for them.",
      "more": {
        "label": "All services",
        "href": "/services/"
      },
      "items": [
        {
          "label": "01 · Agents",
          "title": "DevOps and SRE agents",
          "text": "We develop our own DevOps and SRE agents, and we connect the agents your team already uses.",
          "more": {
            "label": "Meet our agents",
            "href": "#agents"
          }
        },
        {
          "label": "02 · MCP",
          "title": "MCP servers for your app",
          "text": "We build MCP servers that let SRE and DevOps agents check, operate and fix your app, within limits you set."
        },
        {
          "label": "03 · Apps",
          "title": "Operations tools in your app",
          "text": "We build useful operations tools and panels directly into your app, for your team and your agents."
        },
        {
          "label": "04 · Teams",
          "title": "Agentic DevOps and SRE posture",
          "text": "We help companies and teams improve how well agents can see, run and fix their product safely."
        }
      ]
    },
    {
      "type": "agents",
      "id": "agents",
      "eyebrow": "Our agents",
      "title": "Three agents, each with its own job.",
      "lead": "We develop these agents ourselves. They work through MCP servers and pull requests, and they ask before each risky step.",
      "items": [
        {
          "icon": "fixer",
          "pill": "fixer",
          "name": "HeyPenny",
          "role": "General-purpose fixer agent",
          "summary": "HeyPenny fixes what breaks. It prepares the fix, and a person approves it.",
          "items": [
            "Fixes failed CI runs",
            "Prepares rollbacks of bad deploys",
            "Runs routine operations from your runbooks"
          ]
        },
        {
          "icon": "debugger",
          "pill": "debugger",
          "name": "InspectorGadget",
          "role": "Finder and debugging agent",
          "summary": "InspectorGadget finds the cause. It reads logs, metrics and recent changes, and reports what it found.",
          "items": [
            "Triages alerts for the on-call engineer",
            "Traces errors to the change that caused them",
            "Finds drift between your code and your cloud"
          ]
        },
        {
          "icon": "pipelines",
          "pill": "pipelines",
          "name": "Atlas",
          "role": "Pipeline builder agent",
          "summary": "Atlas builds pipelines. It sets up CI/CD for your repositories, with checks on every change.",
          "items": [
            "Builds CI/CD pipelines for your repositories",
            "Adds plan and preview checks on infrastructure changes",
            "Updates pipelines when your stack changes"
          ]
        }
      ]
    },
    {
      "type": "feature",
      "id": "mcp",
      "band": true,
      "eyebrow": "MCP servers for your app",
      "title": "Let agents operate your app, within limits you set.",
      "lead": "MCP (Model Context Protocol) is the open standard that lets AI agents use tools. We build MCP servers for your app, made for SRE and DevOps work. Agents get the tools they need to check, operate and fix your app, and nothing more.",
      "items": [
        "Read tools for health, logs, deploys and queues",
        "Action tools with an approval rule for each action",
        "A log of every call, by agent and by person",
        "Works with any agent that supports MCP"
      ],
      "more": {
        "label": "MCP server details",
        "href": "/services/#mcp"
      },
      "mock": {
        "head": "your-app · MCP server",
        "foot": "Every call is logged with the agent, the tool and the result."
      },
      "mcpTools": [
        {
          "name": "get_health"
        },
        {
          "name": "search_logs"
        },
        {
          "name": "list_deploys"
        },
        {
          "name": "list_failed_jobs"
        },
        {
          "name": "retry_job",
          "approval": true
        },
        {
          "name": "restart_worker",
          "approval": true
        },
        {
          "name": "rollback_deploy",
          "approval": true
        }
      ]
    },
    {
      "type": "feature",
      "id": "panels",
      "reverse": true,
      "eyebrow": "Operations tools in your app",
      "title": "Operations panels, built into your product.",
      "lead": "We build useful operations tools and panels directly into your app. Your team sees health at a glance, fixes common problems in one click, and reviews what agents did. Agents get the same actions through your MCP server, with the same rules.",
      "items": [
        "Health and status views for each part of your app",
        "Admin actions with confirmation and an audit log",
        "Agent activity and approvals in one place"
      ],
      "panel": {
        "app": "your-app",
        "section": "Operations",
        "meta": "Admin only",
        "groups": [
          {
            "label": "Health",
            "rows": [
              {
                "label": "API",
                "status": "Normal"
              },
              {
                "label": "Workers",
                "status": "Normal"
              },
              {
                "label": "Job queue",
                "status": "3 failed jobs",
                "tone": "warn",
                "action": "Retry"
              }
            ]
          },
          {
            "label": "Agent activity",
            "rows": [
              {
                "label": "<strong>HeyPenny</strong> proposed: retry 3 failed jobs",
                "meta": "2 min ago · waiting for approval",
                "action": "Review",
                "accent": true
              },
              {
                "label": "<strong>InspectorGadget</strong> checked deploy 4f2c1a",
                "meta": "12 min ago · no action needed"
              }
            ]
          }
        ]
      }
    },
    {
      "type": "principles",
      "id": "principles",
      "eyebrow": "How we keep agents safe",
      "title": "Agents propose. People approve.",
      "lead": "Every agent we build or connect uses the same review path as your engineers. Nothing changes in production until a person says yes.",
      "flow": [
        {
          "label": "Agent"
        },
        {
          "label": "Proposed change"
        },
        {
          "label": "Policy checks"
        },
        {
          "label": "Human review",
          "human": true
        },
        {
          "label": "Apply"
        }
      ],
      "items": [
        {
          "title": "Only the access it needs",
          "text": "Each agent gets its own identity and only the tools and permissions its job needs."
        },
        {
          "title": "Risky actions wait for a person",
          "text": "Infrastructure changes go through pull requests. App actions through MCP wait for approval."
        },
        {
          "title": "Agent setup lives in Git",
          "text": "Tools, prompts and permissions are code, reviewed and versioned with your infrastructure."
        },
        {
          "title": "Every action is logged",
          "text": "You can see what each agent did, when it did it, and why."
        }
      ]
    },
    {
      "type": "split",
      "id": "who",
      "eyebrow": "Who we are",
      "title": "Infrastructure engineers first. Now we build agents too.",
      "lead": "We started nomadops during the Covid lockdowns, building pipelines and infrastructure as code for start-ups. Today we develop our own DevOps and SRE agents: HeyPenny, InspectorGadget and Atlas. We also build the tools that let agents work on your app safely. We are a small, nomadic team. Most often you find us in Istanbul.",
      "image": "/images/corgi-mascot-illustration-transparent-medium.webp",
      "more": {
        "label": "More about us",
        "href": "/about/"
      }
    },
    {
      "type": "contact",
      "id": "contact",
      "eyebrow": "Contact",
      "title": "Tell us what you want agents to do.",
      "lead": "Send a short note about your product, your team and the work you want agents to do. We reply by email.",
      "links": [
        {
          "label": "Upwork",
          "href": "https://www.upwork.com/ag/nomadops/"
        },
        {
          "label": "Fiverr",
          "href": "https://www.fiverr.com/nomadops"
        },
        {
          "label": "Slack",
          "href": "https://nomadopsllc.slack.com"
        }
      ]
    }
  ]
}
---
