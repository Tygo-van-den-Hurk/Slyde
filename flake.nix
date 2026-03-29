{
  description = "Make beautifully animated Slydes and presentations from XML with ease!";

  # A collection of packages for the Nix package manager
  inputs.nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

  # Generate Github Actions matrices from Nix Flakes
  inputs.nix-github-actions = {
    url = "github:nix-community/nix-github-actions";
    inputs.nixpkgs.follows = "nixpkgs";
  };

  # Flake basics described using the module system
  inputs.flake-parts.url = "github:hercules-ci/flake-parts";

  # Allow flakes to be used with Nix < 2.4
  inputs.flake-compat = {
    url = "github:edolstra/flake-compat";
    flake = false;
  };

  # treefmt nix configuration modules
  inputs.treefmt-nix = {
    url = "github:numtide/treefmt-nix";
    inputs.nixpkgs.follows = "nixpkgs";
  };

  # Seamless integration of https://pre-commit.com git hooks with Nix.
  inputs.git-hooks-nix = {
    url = "github:cachix/git-hooks.nix";
    inputs.flake-compat.follows = "flake-compat";
    inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs =
    inputs:
    inputs.flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [ ./nix ];
      systems = [
        "aarch64-darwin"
        "aarch64-linux"
        "x86_64-darwin"
        "x86_64-linux"
      ];
    };
}
