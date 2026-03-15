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

To install Slyde using NPM, run the following command:

```Shell
npm install @tygo-van-den-hurk/slyde
```

You can also install Slyde in your path by adding the `--global` flag. You might need to restart your session after installation. 

To install Slyde using npm from [GitHub' NPM registry](https://npm.pkg.github.com/) add the `--registry=https://npm.pkg.github.com/` option. This might require a personal access token from GitHub to function correctly.

### Docker image installation

To install and run slyde using [docker](http://docker.com), run the following command:

```Shell
docker pull ghcr.io/tygo-van-den-hurk/slyde
```

You can then run it like so:

```Shell
docker run -it --volume "$PWD:/pwd" --rm slyde
```

### Nix

If you're using nix, then you can add the flake as an input like so:

```Nix
{
  inputs.slyde.url = "github:Tygo-van-den-Hurk/Slyde";
}
```

and then add it to your system packages like so:

```Nix
{ inputs, ... }: {
  environment.systemPackages = [
    inputs.slyde.packages.${system}.default
  ];
}
```

if you're not using flakes yet, you can add it to your by fetching it:

```Nix
let 
  tarball = builtins.fetchTarball "https://github.com/Tygo-van-den-Hurk/Slyde/archive/main.tar.gz";
  package = tarball.packages.${system}.default;
in
{
  environment.systemPackages = [ package ];
}
```

## Licence

All files in this repository fall under a [licence](https://raw.githubusercontent.com/Tygo-van-den-Hurk/Slyde/main/LICENSE).
