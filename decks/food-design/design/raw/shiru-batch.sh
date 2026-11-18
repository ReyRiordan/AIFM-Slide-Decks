#!/bin/zsh
G=~/.claude/skills/gpt-image-bridge/bin/gpt-image-2
D=/Users/reyriordan/Documents/AIFM_Task5/decks/food-design
S="$(cat $D/design/style-cutout.txt)"
$G "One whole brown hen's egg standing beside a small shallow white ceramic dish holding a raw egg white with the yolk intact, three-quarter view from slightly above. $S" $D/design/raw/shiru-egg.png --size 1024x1024 --timeout 900 > $D/design/raw/shiru-egg.log 2>&1 &
$G "A loose scatter of raw plant proteins: dried soybeans, yellow split peas, red lentils and a few fava beans, spread wide and flat in a single layer, shot straight from above, filling a wide area. $S" $D/design/raw/shiru-legumes.png --size 1024x1024 --timeout 900 > $D/design/raw/shiru-legumes.log 2>&1 &
wait
