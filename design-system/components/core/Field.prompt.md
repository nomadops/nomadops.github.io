Form field: 15px/600 label, 48px input with #7e8a85 border, 140px textarea; invalid state turns pink with a red circle-i message after blur.
```jsx
<Field id="email" type="email" label="Email" error={!valid && "Enter an email address, for example name@company.com."} />
```
