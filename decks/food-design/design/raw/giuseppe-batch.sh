#!/bin/bash
cd "$(dirname "$0")/../.."
G=~/.claude/skills/gpt-image-bridge/bin/gpt-image-2
C="$(cat design/style-cutout.txt)"
R=$PWD/design/raw
gen() { $G "$2" "$R/$1.png" --size "$3" --timeout 900 > "$R/$1.log" 2>&1 && echo "OK $1" || echo "FAIL $1"; }
gen giuseppe-cabbage "One wedge cut from a head of green cabbage, pale green layered cut face turned toward the light, fresh and crisp, seen from a 45-degree angle. $C" 1024x1024 &
gen giuseppe-chicory "Two washed chicory roots, pale beige tapering taproots with a trimmed crown, fresh, lying together, seen from a 45-degree angle. $C" 1024x1024 &
gen giuseppe-coconut "One fresh coconut cut in half, brown hairy husk and bright white flesh in the cut face turned toward the light, seen from a 45-degree angle. $C" 1024x1024 &
wait
