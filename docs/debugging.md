# Debugging

Slyde is build on the mentality of "let it crash". I will try to make Slyde crash when it reaches an invalid state, and mention where this mistake in the document was. I try to provide you with a path to the invalid node. 

For example this obviously does not make sense:

```XML
<presentation title="outer presentation">
  <presentation title="inner presentation" />
</presentation>
```

So, you'll receive an error along the lines of `"Expected slides at ${path} but found presentation"` where path is the path to the inner presentation. These paths are based on [xpath](https://www.w3schools.com/xml/xpath_intro.asp), a XML query language. This makes sure we are all on the same page, and might make creating IDE extensions easier later.

In case you do not get a path, that is a shame. Feel free to [open an issue](https://github.com/Tygo-van-den-Hurk/Slyde/issues/new) and I will look into it.
