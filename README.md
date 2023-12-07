# 2023 Advent of Code Solutions (in JavaScript)

## Notes on running the scripts

"start": run `npm run start --dayNum=##` with whatever day's puzzle you want to run and watch
"daygen": run `npm run daygen -- ## true/false` to generate a puzzle file and optional input file
"test": run `npm run test --dayNum=##` with the day's puzzle so tests only run the current day

## Personal Record

In previous years, I've kept track of which days I solved on my own, which I needed guidance on, and which I straight up couldn't solve. I think I want to do that again - not so I can keep score (which is what I used it for before, against myself in previous years) but so I can remember later on which days stumped me and which felt great.

4 / 25 solo solved  0 / 25 guided solved  0 / 25 copy solved  2 / 25 not completed

1: Solved fairly quickly and felt good! Though I did realize after a few hours that my solution got lucky and didn't have issues with digits that share a letter, so I updated it just to keep it working with any input (ideally).
2: Got this one, it was interesting to parse the different cubes. Fun visuals. 😄
3: This one knocked me on my butt, and it hurt bad. There was an edge case not in the sample input and not obviously found in my actual input and I had to go to reddit to get a sample input with the edge case I was missing. Once I got that part 1 worked well, but it broke trying to solve part 2 so we'll have to come back to this one.
4: Another fun one! I really wanted to find some sort of algorithm to compute the points faster than manually going over each card, but no such luck. The straight forward option was still fast enough!
5: Solving the first part of this one was fun - I'm pleased with building out my objects. But it runs out of memory for part 2. lol So I've gotta come back to this one and see what I can work out. 
6: Another one where I'd swear there's an algorithm that should work, but I can't see it yet! But since it's all numbers, doing the obvious path is more than fast enough.
