Flow: mono step chips joined by chevrons (Agent → Proposed change → Policy checks → Human review → Apply), the human step orange. Principle: hairline-topped h3 + text, used in a 4-up grid.
```jsx
<Flow steps={[{ label: "Agent" }, { label: "Human review", human: true }, { label: "Apply" }]} />
<Principle title="Every action is logged">You can see what each agent did, when it did it, and why.</Principle>
```
