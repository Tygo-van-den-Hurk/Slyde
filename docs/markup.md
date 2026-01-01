# Markup

Since we use [XML](https://en.wikipedia.org/wiki/XML) to configure our presentation, we can't use [HTML](https://en.wikipedia.org/wiki/HTML)/[XML](https://en.wikipedia.org/wiki/XML) elements to render anything as that will confuse the parser with what is text and what is an element to render. That is why [markup languages](https://en.wikipedia.org/wiki/Markup_language) are used. 

## Slyde Markup

Since [markdown](https://en.wikipedia.org/wiki/Markdown) did not have support for everything I thought was useful without resorting to [HTML](https://en.wikipedia.org/wiki/HTML) I created the "Slyde markup" language. Functionality wise a superset of [markdown](https://en.wikipedia.org/wiki/Markdown).

Here is an example:

```XML
<text markup="slyde">
  **This text will be bold**
  __This text will be underlined__
  //This text will be italic//
  ~~This text will be struck through~~
  ^^This text will be in superscript^^
  ``This text will be monospaced``
  add a [link to somewhere](http://exmple.com)
  or add latex for math: $$ y = { x \over 2 } $$
</text>
```

Markers can be escaped using `\` as usual in any language.

```XML
<text markup="slyde">
  \**This text will be bold**
</text>
```

Watch out as what was a closing marker is now an open marker.

## Design Philosophy

Slyde' markup was designed to be as simple as possible, and to be as consistent as possible. Therefor there were a couple changes from it's base:

1. All markers are exactly 2 symbols after each other to make it obvious what a marker is. The one exception being a link as it takes an "argument" and I liked markdowns implementation.
2. The markers were chosen based on how obvious it's use case would be, and to be as similar to markdown as possible at the same time. For example italic is `//italic//`, underline is `__underline__`, superscript is `^^superscript^^`, and so forth...

## Markup Renderers

There is support out of the box for replacing the default markup renderer implementation with any of your choice using plugins. The following Markup renders are installed by default, and can be used without any plugins:

- [`Slyde`](#slyde-markup): Renders the text using Slyde' own markup language. (default)
- [`Markdown`](https://en.wikipedia.org/wiki/Markdown): Renders markdown as you know it.
- [`Latex`](https://en.wikipedia.org/wiki/LaTeX): Renders the text as latex in math mode. (math mode only)
- [`Plain`](#switching-it-off): Renders the text as is. (Aliased under `Raw` and `Off`)
- [`UpperCase`](https://en.wikipedia.org/wiki/Letter_case): Renders the text as uppercase.
- [`LowerCase`](https://en.wikipedia.org/wiki/Letter_case): Renders the text as lowercase.

To select the a different markup renderer for example Markdown, change the markup key:

```XML
<text markup="markdown">
  **This text will be bold**  
</text>
```

The text will now be treated as markdown instead of Slyde' markup. But since Slyde' markup supports more styles and is easier for most non-technical people to understand it is the default.

This markup is rendered automatically in the text of all components. The markup attribute is optional, and can will default to `markup="slyde"`. Meaning these two are identical:

```XML
<text markup="slyde">
  **This text will be bold**
</text>
<text>
  **This text will ALSO be bold**
</text>
```

## Switching it off

You might not want the markup to be processed at all. In that case you have 3 options. You could switch the markup renderer to the `plain` named renderer. This one just returns the input without processing:

```XML
<text markup="plain">
  **This text will NOT be bold**
</text>
```

or use a [processing instruction](./processing-instructions.md):

```XML
<?slyde markup="plain"?>
<text>
  **This text will NOT be bold**
</text>
<text>
  **and neither will this one be**
</text>
```

Or you can use an XML CDATA tag:

```XML
<text><![CDATA[**This text will NOT be bold**]]></text>
```

A CDATA tag Does not modify the text in any way what so ever. It preserves even whitespace if that is important to you.

