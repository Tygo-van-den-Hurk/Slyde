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

## Engine

Require a certain version for slyde to be. Works using semantic versioning. See the [semver NPM package](https://github.com/npm/node-semver) for their API. This allows you to assert a warning 

Include everything that does not increment the first non-zero portion of semver. Use the caret (aka hat) symbol: `^`.

```XML
<?slyde engine="^2.2.1" ?>
<?slyde engine="^0.1.0" ?>
<?slyde engine="^0.0.3" ?>
```

Include everything greater than a particular version in the same minor range. Use the tilde symbol: `~`.

```XML
<?slyde engine="^~2.2.0" ?>
<?slyde engine="^~2.2.0" ?>
<?slyde engine="^~2.2.0" ?>
```

Specify a range of stable versions. Use `>`, `<`, `=`, `>=` or `<=` for comparisons, or `-` to specify an inclusive range.

```XML
<?slyde engine=">2.1" ?>
<?slyde engine="1.0.0 - 1.2.0" ?>
```
    
Include pre-release versions like alpha and beta. Use the pre-release tag

```XML
<?slyde engine="1.0.0-rc.1" ?>
```

Specify a range of pre-release versions. Use comparisons like `>` with a pre-release tag.

```XML
<?slyde engine=">1.0.0-alpha" ?>
<?slyde engine=">=1.0.0-rc.0 <1.0.1" ?>
```

Include multiple sets of versions. Use `||` to combine.

```XML
<?slyde engine="^2 <2.2 || > 2.3" ?>
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
