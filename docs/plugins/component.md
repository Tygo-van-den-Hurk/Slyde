# Component

To add your own component simply follow this template:

```JavaScript
// Now available as: my-component, MyComponent, ...
export default ({ Component }) => Component.register(
  
  class MyComponent extends Component {
    render({ children }) {
      return '<p>This is an example</p>'
    }
  }

);
```

## Adding Fields or Functions

You might want your component to use attributes. You store those in fields. To add fields, you can use the component extract utility as follows:

```JavaScript
export default ({ Component }) => Component.register(
  class MyImage extends Component {

    #source = Component.utils.extract({
      aliases: ['source', 'src'],
      context: this,
      missing: 'error',
      transform: (value) => toUrl(value) // only sync functions
    });

    #description = Component.utils.extract({
      aliases: ['description', 'alt'],
      context: this,
      missing: 'warn',
    });
  }
);
```

> [!CAUTION]
> When creating a field or function, be sure to prefix it with `#`. Failing to do so won't break your plugin now, but might break it in the future as the base class adds more fields. See [the Mozilla JavaScript documentation on private elements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements) for more.

And the field will be assigned at object construction and extracted from the attributes provided from the XML.

```XML
<MyImage source="This is the source field" description="This is the description field">
```

There a a couple of utilities to transform types in [`#lib/core/components/utils/transform.ts`](https://github.com/Tygo-van-den-Hurk/Slyde/blob/main/lib/core/components/utils/transform.ts).

## Styling

Most of the lines of any `Component` plugin will most likely be the HTML output when rendering. That's why to make it as convenient to write your own components as possible I've added [tailwind](https://tailwindcss.com/) to the mix. You can use [tailwind](https://tailwindcss.com/) to define the looks of your component and the classes will be created for you dynamically later at runtime.

There are a couple alterations to it though:

-  all spacing has been overwritten to use `--unit`, which is a variable computed how large the current presentation window is. This is required because otherwise things would not stretch appropriately as the window scales
- you can only use the following colors: `foreground`, `background`, `primary`, and `secondary` as those are the only user definable colors. Using custom colors is discouraged but allowed using tailwinds custom classes.

## Interfaces

There are a couple of requirements for any instance of `Component`. The functions/fields you'll need to implement can be found in the [`#lib/core/components/interfaces.ts.`](https://github.com/Tygo-van-den-Hurk/Slyde/blob/main/lib/core/components/interfaces.ts) file. Depending on the version you have installed these requirements might be different then that the links says. Check both major versions to find out if they are compatible.

## How to use

Now that you've added your own `Component` plugin you can simply use it using its's ID as the element name. Like so:

```XML
<presentation>
  <slide>
    <my-component />
  </slide>
</presentation>
```

## Overriding existing Components

Since plugins load after the original `Component`s load you can override existing `Component` names. This is intentional, in case an existing `Component` by that name does not suit your needs, however I do recommend adding it under a different name instead, however you got the option.
