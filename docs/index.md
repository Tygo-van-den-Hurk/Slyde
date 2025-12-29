<div align="center">
  <picture>
    <source srcset="./assets/logo-standalone.svg" media="(max-width: 600px)">
    <img src="./assets/logo-with-text.svg" width="50%" alt="the Slyde logo">
  </picture>
  <br>
  <br>
  <p>Make beautifully animated Slydes and presentations from XML with ease! </p>
</div>

## What is Slyde?

Slyde is a program to create professional beautifully animated presentations from XML. It is fast and easy, even for non-technical people. [See the basics](./basics.md) to get started.

```XML
<presentation title="My First Slyde Presentation" by="Tygo van den Hurk">
  <slide title="Why you should use Slyde">
    <!-- These are my slide notes in case I forget what to say -->
    <point>It is super **fast and easy** to make slides</point>
    <point>The animations are **gorgeous**!</point>
    <point>Recipient only needs a browser to open it</point>
  </slide>
</presentation>
```

This would output the following fully animated presentation:

<img src="https://raw.githubusercontent.com/Tygo-van-den-Hurk/Slyde/main/docs/assets/example-presentation.gif" width="100%" style="border-radius:var(--radius-xl);" alt="An example Slyde presentation based on the previous example XML template">

To see a run down of how we made this slide [see the basics](./basics.md).

## Installation

There are several ways to install Slyde: [installing an npm package](#npm-package-installation), [pull docker image](#docker-image-installation), or [building from source](#building-from-source).

### NPM package installation

> [!NOTE]
> This might require a token from GitHub to function.

To install Slyde using [npm](https://www.npmjs.com/) from [GitHub' NPM registry](https://npm.pkg.github.com/), run the following command:

```Shell
npm install @tygo-van-den-hurk/slyde --registry=https://npm.pkg.github.com/
```

You can also install Slyde in your path by adding the `--global` flag. You might need to restart your session after installation. 

### Docker image installation

To install and run slyde using [docker](http://docker.com), run the following command:

```Shell
docker run --volume "$PWD:/src" --rm ghcr.io/tygo-van-den-hurk/slyde:latest compile /src/slyde.xml --output /src/slyde.html
```

### Building from source

> [!WARNING]
> This option is not recommended even if you chose to install `--global` as this makes your system harder to replicate. The previous options are recommended for almost all use cases.

You can install slyde as a dependency to your project, run the following commands:

```Shell
git clone http://github.com/tygo-van-den-hurk/slyde "$PWD/slyde"
cd "$PWD/slyde"
npm ci
npm run build
cd -
npm install "$PWD/slyde"
```

You can also install Slyde in your path by adding the `--global` flag. You might need to restart your session after installation. 

## Licence

All files in this repository fall under a [licence](https://raw.githubusercontent.com/Tygo-van-den-Hurk/Slyde/main/LICENSE).
