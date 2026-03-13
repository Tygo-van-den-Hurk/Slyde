{ inputs, ... }:
{
  imports = [
    inputs.git-hooks-nix.flakeModule
  ];

  perSystem = _: {
    pre-commit.check.enable = true;
    pre-commit.settings.enable = true;
    pre-commit.settings.hooks = {

      # Ensure that all (non-binary) files with a shebang are executable.
      check-shebang-scripts-are-executable = {
        enable = true;
        stages = [
          "pre-commit"
          "pre-push"
          "manual"
        ];
      };

      # Forces executable files to have a shebang.
      check-executables-have-shebangs = {
        enable = true;
        stages = [
          "pre-commit"
          "pre-push"
          "manual"
        ];
      };

      # Detect the presence of private keys.
      detect-private-keys = {
        enable = true;
        stages = [
          "pre-commit"
          "pre-push"
          "manual"
        ];
      };

      # Checks for broken symlinks in the repository.
      check-symlinks = {
        enable = true;
        stages = [
          "pre-commit"
          "pre-push"
          "manual"
        ];
      };

      # Linting for your git commit messages"
      gitlint = {
        enable = true;
        stages = [
          "commit-msg"
        ];
      };

      # Check whether the current commit message follows committing rules.
      convco = {
        enable = true;
        stages = [
          "commit-msg"
        ];
      };

      # disallows commits to certain branches.
      no-commit-to-branch = {
        enable = false;
        settings.branch = [ "main" ];
        stages = [
          "pre-commit"
          "pre-push"
          "manual"
        ];
      };

      # Prevents committing binaries.
      check-added-large-files = {
        enable = true;
        stages = [
          "pre-commit"
          "pre-push"
          "manual"
        ];
      };

      # Checks for spelling errors in both the files and commit messages.
      typos = {
        enable = true;
        stages = [
          "pre-commit"
          "commit-msg"
          "pre-push"
          "manual"
        ];
        settings = {
          no-unicode = true;
          hidden = true;
          ignored-words = [
            "Tygo"
            "tygo"
            "Hurk"
            "hurk"
          ];
        };
      };
    };
  };
}
