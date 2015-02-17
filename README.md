react-component-visibility
===

A mixin for determining whether a component is visible to the user or not.

With a stupidly simple API
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
