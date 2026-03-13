{ config, ... }:
with config;
{
  imports = [
    ./slyde.nix
  ];

  flake.overlays.default = flake.overlays.slyde;
}
