#!/bin/bash
cd /Users/reyriordan/Documents/AIFM_Task5/decks/food-design
G=~/.claude/skills/gpt-image-bridge/bin/gpt-image-2
C="$(cat design/style-cutout.txt)"
R=$PWD/design/raw
gen() { $G "$2" "$R/$1.png" --size 1024x1024 --timeout 900 > "$R/$1.log" 2>&1 && echo "OK $1" || echo "FAIL $1"; }
gen future-cocoa-bar "A dark chocolate bar snapped cleanly into two pieces, the two halves resting slightly apart and overlapping, glossy tempered surface, visible moulded squares, crisp fractured edge with fine crumbs, seen from a 30-degree angle. $C" &
gen future-dates "Three whole Medjool dates, glossy wrinkled amber-brown skin, beside a small plain unglazed stoneware dish holding a thick dark date puree, seen from a 40-degree angle, tight group. $C" &
gen future-biscuit "A single rectangular chocolate-coated biscuit bar with one clean bite taken out of one end, showing the pale crisp biscuit layer under the glossy dark chocolate coating, seen from a 35-degree angle. $C" &
gen future-palm "A small tight pile of about eight fresh oil palm fruits, deep orange-red oval drupes with dark tips, glossy skin, loosely stacked, seen from a 40-degree angle. $C" &
gen future-sunflower "A small neat heap of roasted hulled sunflower seeds, warm toasted beige and brown, individual seeds visible with soft sheen, seen from a 40-degree angle. $C" &
wait
