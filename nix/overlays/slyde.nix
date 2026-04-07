{ inputs, ... }:
with inputs;
{
  flake.overlays.slyde = final: _prev: {
    inherit (self.packages.${final.system}) slyde;
  };
}
