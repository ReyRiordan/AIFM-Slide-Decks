#!/bin/bash
cd "$(dirname "$0")/../.."
G=~/.claude/skills/gpt-image-bridge/bin/gpt-image-2
P="$(cat design/style-prefix.txt)"
R=$PWD/design/raw
gen() { $G "$2" "$R/$1.png" --size "$3" --timeout 900 > "$R/$1.log" 2>&1 && echo "OK $1" || echo "FAIL $1"; }
gen samsung-recipe-card "A single worn cream-coloured index card covered in dense handwriting, lying slightly curled on the slate, shot from a low three-quarter angle so the card fills the left third of the frame and the rest of the slate is empty. The handwriting is rendered as indistinct looping blue-black ink strokes with no readable words, letters or numbers, softly out of focus. A faint coffee ring stains one corner. $P" 1536x1024 &
gen samsung-cookbook "An open hardback cookbook lying flat on the slate, warm side light raking across the two cream pages, pages slightly curved at the spine, shot from a high three-quarter angle. The printed matter on the pages is rendered as soft indistinct grey texture bands with no readable words, letters or numbers, far out of focus. Generous empty slate around the book. $P" 1536x1024 &
gen samsung-dish "A finished rustic stew in a wide shallow stoneware bowl, shot straight down from above, glossy rust-coloured sauce with soft unidentifiable chunks and a scatter of green herbs, steam-free, bowl centred with generous empty slate around it. $P" 1536x1024 &
wait
