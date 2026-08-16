#!/bin/sh
# Install the local git hooks that run the verification tools.
#
# Git never tracks .git/hooks/, so these have to be re-armed after a fresh clone.
# The LOGIC lives in tools/ (tracked); only the trigger is local. Run:
#
#   sh tools/install-hooks.sh
#
set -e
root=$(git rev-parse --show-toplevel)
hooks=$(git rev-parse --git-path hooks)
mkdir -p "$hooks"

cat > "$hooks/pre-commit" <<'EOF'
#!/bin/sh
# Syntax-gate index.html before it can be committed. Milliseconds.
# Checks the STAGED content, not the working tree, so a commit is judged on what it contains.
if git diff --cached --name-only | grep -qx 'index.html'; then
  if ! git show :index.html | node "$(git rev-parse --show-toplevel)/tools/check.mjs"; then
    echo ''
    echo 'pre-commit: index.html does not parse — commit blocked.'
    echo 'A SyntaxError here means ZERO JavaScript runs while the title screen still paints,'
    echo 'so the game looks loaded and every tap does nothing. Fix the line above.'
    echo 'To bypass (you almost never want to): git commit --no-verify'
    exit 1
  fi
fi
EOF

cat > "$hooks/pre-push" <<'EOF'
#!/bin/sh
# Push is the deploy boundary: GitHub Pages serves main:/ straight to the public URL.
# Run the full check here — syntax gate plus the headless smoke test.
root=$(git rev-parse --show-toplevel)
node "$root/tools/check.mjs" "$root/index.html" || {
  echo 'pre-push: syntax gate failed — push blocked.'; exit 1; }
if [ -x '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' ]; then
  node "$root/tools/smoke.mjs" "$root/index.html" || {
    echo 'pre-push: smoke test failed — push blocked.'; exit 1; }
else
  echo 'pre-push: Chrome not found, skipping smoke test (syntax gate passed).'
fi
# The public reskin catalog is a second copy of the art and has silently drifted before.
# Warn rather than block: a stale catalog is embarrassing, not broken.
(cd "$root" && node tools/sync-assets.mjs >/dev/null) || \
  echo 'pre-push: NOTE assets.html has drifted from index.html — run: node tools/sync-assets.mjs --fix'
EOF

chmod +x "$hooks/pre-commit" "$hooks/pre-push"
echo "Installed pre-commit and pre-push hooks in $hooks"
