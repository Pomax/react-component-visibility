# react-component-visibility

A mixin for determining whether a component is visible to the user or not.

Versions below v1.0.0 use the React namespace, v1.0.0 and later use ReactDOM
instead, which means if you're using an older version of React, you may
need to handpick the version you want to use.

## What is this?

This mixin is for running React components in the browser (it has a hard
dependency on `window` and `document`), listening to `scroll` and `resize`
events to check whether these have made components visible to the user. If
so, magic happens and the component's `componentVisibilityChanged` function
to notify the component that a visibility change occurred.

In addition to the event handler, a state change is triggered for a value
called `visible`, so you usually don't even need to implement your own
`componentVisibilityChanged` handler, you can simply rely on the fact that
**if** the component becomes visible, or goes from visible to no longer
visible (based on scroll, resize, or window minimize), `render()`, and
subsequent `componentDidUpdate` will get triggered.

Nice and easy.

## This mixin has a stupidly simple API


The mixin takes care of registering and dropping event listeners for scroll
and window resizing. However, because some times you only need "trigger once,
then stop listening", there are two functions you can call if you need more
control than the mixin provides:

- `enableVisibilityHandling([checkNow])` (built in)

  Call as `this.enableVisibilityHandling()`, with an optional `true` as argument
  to both enable visibiilty handling and immediately do a visibiity check.

- `disableVisibilityHandling()` (built in)

  Call as `this.disableVisibilityHandling()` to turn off event listening for
  this component.

And then for convenience, so you don't need to mess with visibility change
checks in `componentDidUpdate()`, there is an optional function that your
component can implement, which will then be used to notify it of any
changes to the component visibility:

- `componentVisibilityChanged()` (optional)

  This function, if you add it to your component yourself, gets called
  automatically after binding a visibility change in the component's state,
  so that you can trigger custom logic. No argument comes into this function,
  since the `this.state.visible` value will already reflect the currect value,
  and the old value was simply `!visible`.

### Rate limiting the scroll handling

By default, the mixin does rate limiting to prevent event saturation (onscroll
refires very fast), set such that when a scroll event is handled, it won't
listen for and act on new events until 25 milliseconds later. You can change
the delay by calling the rate limit function with the number of milliseconds
you want the interval to be instead:

```
...
componentDidMount: function() {
  ...
  this.setComponentVisibilityRateLimit(ms);
  ...
},
...
```

## An example

Using the mixin is pretty straight forward.

### In the browser:

```
<script src="react-component-visibility/index.js"></script>
...
<script type="text/jsx">
var MyComponent = React.createClass({
  ...
  mixins = [
    // required:
    ComponentVisibilityMixin
  ];
  ...
  // optional:
  componentVisibilityChanged: function() {
    var visible = this.state.visible;
    ...
  },
  ...
});
</script>
```

### In the browser, AMD style:

Bind `react-component-visibility/index.js` in your require config,
and then simply require it in like everything else:

```
define(
  ['React', 'ComponentVisibilityMixin'],

  function(R, CVM) {
    var MyComponent = R.createClass({
      ...
      mixins = [ CVM ];
      ...
      componentVisibilityChanged: function() {
        var visible = this.state.visible;
        ...
      },
      ...
    });
  }
);
```

### In node.js

Like every other node package:

```
var React = require("react");
var CVM = require("react-component-visibility");
var MyComponent = React.createClass({
  ...
  mixins = [ CVM ];
  ...
  componentVisibilityChanged: function() {
    var visible = this.state.visible;
    ...
  },
  ...
});

module.exports = MyComponent;
```

## How to install

Simply use `npm`:

```
$> npm install react-component-visibility --save
```

and you're off to the races.

## I think you forgot something

I very well might have! Hit up the [issue tracker](https://github.com/Pomax/react-component-visibility/issues) and we can discuss that.

-- [Pomax](http://twitter.com/TheRealPomax)
