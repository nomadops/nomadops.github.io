Light "your-app / Operations" panel with Health rows (status dots) and Agent activity rows (Review button).
```jsx
<OpsPanel groups={[{ label: "Health", rows: [{ label: "API", status: "Normal" }, { label: "Job queue", status: "3 failed jobs", tone: "warn", action: "Retry" }] }]} />
```
