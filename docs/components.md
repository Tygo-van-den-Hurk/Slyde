# Components

Components are the building blocks in Slyde. In your XML template the elements you create represent those components. So in the example:

```XML
<presentation title="My First Slyde Presentation" by="Tygo van den Hurk">
  <slide title="Why you should use Slyde">
    <point>It is super **fast and easy** to make slides</point>
    <point>The animations are **gorgeous**!</point>
    <point>Recipient only needs a browser to open it</point>
  </slide>
</presentation>
```

`Presentation`, `Slide`, and `Point` are all components.

## Using them

To use them, refer to them by their name, or one of their aliases. For example the image component can be used like this: `<image/>`, `<slyde:image/>`, ..., `<img/>`, ..., and `<IMG/>`.

## Attributes 

The way to customize your component is by passing attributes:

```XML
<image source="https://github.com/Tygo-van-den-Hurk.png" />
```

Component take those attributes and use them internally to change it's behavior or looks.

### Special Attributes

There some attributes considered special in the sense that every component has them. Here is a list of special attributes and what they do:

- `width`, `w`: determines the width of a component.
- `height`, `h`: determines the width of a component.
- `markdown`: override the current [markdown renderer](./markup.md).
- `display`: override the [css display property](https://www.w3schools.com/cssref/pr_class_display.php).
