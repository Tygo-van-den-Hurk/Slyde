{ inputs, ... }:
{
  imports = [
    inputs.treefmt-nix.flakeModule
  ];

  perSystem = _: {
    treefmt = {
      enableDefaultExcludes = true;
      flakeCheck = true;
      flakeFormatter = true;
      #// on-unmatched = "warn";

      # nix formatting
      programs.nixfmt = {
        enable = true;
      };

      # nix static analysis
      programs.statix = {
        enable = true;
      };

      # find dead nix code
      programs.deadnix = {
        enable = true;
      };
    };
  };
}
