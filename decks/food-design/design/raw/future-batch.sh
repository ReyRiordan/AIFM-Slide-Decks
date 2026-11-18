#!/bin/bash
cd /Users/reyriordan/Documents/AIFM_Task5/decks/food-design
G=~/.claude/skills/gpt-image-bridge/bin/gpt-image-2
P="$(cat design/style-prefix.txt)"; C="$(cat design/style-cutout.txt)"
R=$PWD/design/raw
gen() { $G "$2" "$R/$1.png" --size "$3" --timeout 900 > "$R/$1.log" 2>&1 && echo "OK $1" || echo "FAIL $1"; }
gen future-candy "A small loose scatter of about twelve shiny hard-shell candy lentils in vivid red, blue, yellow and green, glossy sugar shells with tiny highlights, seen from a 45-degree angle, grouped close together. $C" 1024x1024 &
gen future-close-table "An empty plain dark matte ceramic plate, seen from directly overhead, sitting in the RIGHT THIRD of the frame. Beside the plate, a few raw ingredients laid out singly: one dried bean, one small green leaf, one seed pod. The left two thirds of the frame is completely empty dark slate stone in soft shadow. $P" 1536x1024 &
wait
