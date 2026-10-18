Hero "incident" card: head with fail dot + pill, mono log with agent headers, footer that swaps from "waiting for approval" (Approve) to approved (Replay).
```jsx
<Terminal lines={[{ sym: "fail", text: "alert: error rate up on /checkout" }, { agent: "InspectorGadget", note: "finding the cause" }, { text: "mcp: your-app.get_health" }, { sym: "ok", text: "policy checks passed" }]} waitingText="HeyPenny is waiting for your approval" approvedText="Approved by you. HeyPenny is rolling back the deploy." />
```
