# Processing Instructions

Processing instructions are a special way to tell the compiler things. They do not show up in your presentation, or notes. They can change the way the compiler works, and what state you are in. 

## Examples

An example is the processing instructions to change the [markup renderer](markup.md) to something else from here on out for all next elements and their descendants.

```XML
<text>
  **This text will be bold**
</text>
<?slyde markup="plain"?>
<text>
  **This text will NOT be bold**
</text>
```

## Possible Instructions

Here follows a list off all possible instructions:

- [`markup`](#change-markup-renderer): change the active markup renderer
- [`engine`](#engine-concept): checks if the compiler uses the same version for slyde.
- [`include`](#include-concept): include files in the final build.

### Change Markup Renderer

You can change the markup render to `XYZ` using:

```XML
<?slyde markup="XYZ"?>
```

## Engine (concept)

> [!NOTE]
> For now this is just a concept, I am not sure if it will make it into the final version.

Require a certain version for slyde to be. Works using semantic versioning.

```
<?slyde engine="v1"?>
<?slyde engine="v1.2"?>
<?slyde engine="v1.2.3"?>
```

## Include (concept)

> [!NOTE]
> For now this is just a concept, I am not sure if it will make it into the final version.

You can include different files inside the final result. The parser is smart enough to know what type of content it is, and where to put it.

```XML
<?slyde include="http://example.com/script.js"?>
<?slyde include="./path/to/script.js"?>
<?slyde include="http://example.com/style.css"?>
<?slyde include="./path/to/style.css"?>
```
