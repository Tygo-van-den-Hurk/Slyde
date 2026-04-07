{ inputs, ... }:
let
  inherit (inputs) self;
  inherit (inputs) nixpkgs;

  package = nixpkgs.lib.importJSON "${self}/package.json";
  lock = nixpkgs.lib.importJSON "${self}/package-lock.json";
in
{
  perSystem =
    { pkgs, ... }:
    {
      packages.slyde =
        with pkgs;
        buildNpmPackage rec {
          pname = "slyde";
          inherit (package) version;
          src = self;

          # Nix dependencies

          nativeBuildInputs = [
            help2man
          ];

          # NPM dependencies

          inherit (importNpmLock) npmConfigHook;
          npmPruneFlags = [ "--production" ];
          makeCacheWritable = true;
          npmDeps = importNpmLock {
            packageLock = lock;
            npmRoot = self;
          };

          # NPM settings

          dontNpmBuild = false;
          passthru.updateScript = nix-update-script { };
          npmPackFlags = [ "--ignore-scripts" ];
          NODE_OPTIONS = "--openssl-legacy-provider";

          # Install

          postInstall = ''
            # Bash completion
            mkdir -p $out/share/bash-completion/completions
            $out/bin/slyde completion > \
              $out/share/bash-completion/completions/slyde

            # Man page
            mkdir -p $out/share/man/man1
            help2man $out/bin/slyde \
              --no-discard-stderr \
              --name "${package.description}" \
              --output "$out/share/man/man1/slyde.1"
          '';

          # Checks

          doInstallCheck = true;
          nativeInstallCheckInputs = [
            versionCheckHook
          ];

          doCheck = true;
          checkPhase = ''
            runHook preCheck
            CI="1" npm run test
            runHook postCheck
          '';

          # Meta

          meta = with lib; {
            inherit (package) description;
            inherit (package) homepage;
            inherit (package) keywords;
            mainProgram = "slyde";
            licenses = with licenses; [ gpl3Only ];
            maintainers = with maintainers; [
              Tygo-van-den-Hurk
            ];
          };
        };
    };
}
