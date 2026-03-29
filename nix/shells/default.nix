{ self, ... }:
{
  imports = [ ];

  perSystem =
    {
      config,
      pkgs,
      lib,
      ...
    }:
    let
      pure = true;

      formatters = builtins.attrValues config.treefmt.build.programs;
      hooks = config.pre-commit.settings.enabledPackages;
      packages = with pkgs; [
        act # Run your GitHub Actions locally
        git # Distributed version control system
        nodejs # run the application itself
      ];

      # add `npm run <script>` as `<script>` to the PATH
      package = lib.importJSON "${self}/package.json";
      npmScripts = lib.mapAttrsToList (
        name: _:
        (pkgs.writeShellScriptBin name ''
          ${pkgs.nodejs}/bin/npm run ${name} -- "$@"
        '')
      ) package.scripts;

      buildInputs = packages ++ formatters ++ hooks ++ npmScripts;

      shellHook = ''
        ${config.pre-commit.shellHook}
        if [ -f .env ]; then
          source .env
        fi
      '';
    in
    {
      devShells.default = pkgs.mkShell {
        inherit buildInputs;
        inherit shellHook;
        inherit pure;
      };
    };
}
