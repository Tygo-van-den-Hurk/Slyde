{ ... }:
{
  imports = [
    ./slyde.nix
    ./nodejs.nix
  ];

  perSystem =
    { self', ... }:
    {
      packages.default = self'.packages.slyde;
    };
}
