react-component-visibility
===

A mixin for determining whether a component is visible to the user or not.

This mixin is for running React components in the browser (it has a hard
dependency on `window` and `document`), listening to `scroll` and `resize`
events to check whether these have made components visible to the user. If
so, magic happens and the component's `componentVisibilityChanged` function
to notify the component that a visibility change occurred.

In addition to the event handler, a state change is triggered for a value
called `visible`, so you usually don't even need to implement your own
`componentVisibilityChanged` handler, you can simply rely on the fact that
**if** the component becomes visible, or goes from visible to no longer
visible (based on scroll or resizing), `render()`, and subsequent
`componentDidUpdate` will get triggered.

Nice and easy.

This mixin has a stupidly simple API
---

The mixin takes care of registering and dropping event listeners for scroll
and window resizing. However, because some times you only need "trigger once,
then stop listening", there are two functions you can call to optimize the
event handling:

- `enableVisbilityHandling([checkNow])`

  Call as `this.enableVisbilityHandling()`, with an optional `true` as argument
  to both enable visibiilty handling and immediately do a visibiity check.

- `disableVisbilityHandling()`

  Call as `this.disableVisbilityHandling()` to turn off event listening for
  this component.

That's it.

How to install
---

Simply use `npm`:

```
$> npm install react-component-visbility --save
```

and you're off to the races.

I think you forgot something
---

I very well might have! Hit up the [issue tracker](https://github.com/Pomax/react-component-visibility/issues) and we can discuss that.

- [Pomax](http://twitter.com/TheRealPomax)
