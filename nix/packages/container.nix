{ inputs, ... }:
let
  inherit (inputs) self;
in
{
  perSystem =
    {
      pkgs,
      lib,
      system,
      ...
    }:
    let
      package =
        if lib.hasPrefix "x86_64" system then
          self.packages."x86_64-linux".slyde
        else
          self.packages."aarch64-linux".slyde;
    in
    rec {
      packages.container = pkgs.dockerTools.buildLayeredImage {
        name = "slyde";
        tag = "latest";
        contents = [ package ];
        config = {
          Entrypoint = [ "slyde" ];
          Cmd = [
            "compile"
            "/pwd/slyde.xml"
          ];
        };
      };
    };
}
