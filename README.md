# react-component-visibility

A mixin for determining whether a component is visible to the user or not.

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
visible (based on scroll or resizing), `render()`, and subsequent
`componentDidUpdate` will get triggered.

Nice and easy.

## This mixin has a stupidly simple API


The mixin takes care of registering and dropping event listeners for scroll
and window resizing. However, because some times you only need "trigger once,
then stop listening", there are two functions you can call to optimize the
event handling:

- `enableVisbilityHandling([checkNow])` (built in)

  Call as `this.enableVisbilityHandling()`, with an optional `true` as argument
  to both enable visibiilty handling and immediately do a visibiity check.

- `disableVisbilityHandling()` (built in)

  Call as `this.disableVisbilityHandling()` to turn off event listening for
  this component.

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
  this.setComponentVisbilityRateLimit(ms);
  ...
},
...
```

## An example

Using the mixin is pretty straight forward.

### In the browser:

```
<script src="react-component-visbility/index.js"></script>
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

Bind `react-component-visbility/index.js` in your require config,
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
$> npm install react-component-visbility --save
```

and you're off to the races.

## I think you forgot something

I very well might have! Hit up the [issue tracker](https://github.com/Pomax/react-component-visibility/issues) and we can discuss that.

-- [Pomax](http://twitter.com/TheRealPomax)
