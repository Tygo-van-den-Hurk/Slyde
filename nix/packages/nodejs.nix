_:
{
  perSystem =
    { pkgs, ... }:
    {
      packages.nodejs = pkgs.nodejs;
    };
}
