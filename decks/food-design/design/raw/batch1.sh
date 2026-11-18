#!/bin/bash
cd "$(dirname "$0")/../.."
G=~/.claude/skills/gpt-image-bridge/bin/gpt-image-2
P="$(cat design/style-prefix.txt)"; C="$(cat design/style-cutout.txt)"
R=$PWD/design/raw
gen() { $G "$2" "$R/$1.png" --size "$3" --timeout 600 > "$R/$1.log" 2>&1 && echo "OK $1" || echo "FAIL $1"; }
gen title-dish "An autumn harvest dish: a shallow hand-glazed ceramic bowl of roasted butternut squash wedges with crispy sage leaves, toasted pumpkin seeds, pomegranate seeds and a drizzle of brown butter, shot three-quarters from above. A few loose props around it: a halved small pumpkin, a sprig of thyme, scattered seeds, a linen napkin in rust. The dish sits right of centre; the left 40% of the frame is empty dark slate in shadow, for a headline. $P" 1536x1024 &
gen card "A handwritten recipe index card, slightly worn cream card stock with faded blue ruled lines, handwriting in dark ink that is illegible scribble-like cursive (no readable words), a small grease spot, lying flat, seen from directly above with a slight tilt. $C" 1024x1024 &
gen beans "A small heap of mixed dried legumes: chickpeas, green split peas, red lentils and white beans, spilling slightly, seen from a 45-degree angle. $C" 1024x1024 &
gen bowl "An empty hammered copper mixing bowl with a wooden-handled whisk resting inside it, seen from a 45-degree angle. $C" 1024x1024 &
wait
gen tomato "One ripe red vine tomato with its green calyx, glossy, seen from a 45-degree angle. $C" 1024x1024 &
gen garlic "One whole white garlic bulb with papery skin and one loose clove beside it, seen from a 45-degree angle. $C" 1024x1024 &
gen basil "A fresh sprig of green basil with five to seven glossy leaves, seen from slightly above. $C" 1024x1024 &
gen milk "A tall clear drinking glass filled with fresh white milk, a few droplets on the glass, seen from a slight angle at eye level. $C" 1024x1024 &
wait
