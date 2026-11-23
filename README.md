# makefun-gta6-meme-x-01

[![make.fun · gta6-meme-x-01](https://make.fun/badge/gta6-meme-x-01.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![rank](https://make.fun/badge/gta6-meme-x-01/maxinung/makefun-gta6-meme-x-01/rank.svg)](https://make.fun/bounty/gta6-meme-x-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![reward](https://make.fun/badge/gta6-meme-x-01/maxinung/makefun-gta6-meme-x-01/reward.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)

<sub>Entered on [make.fun](https://make.fun/?ref=d14sycdw&utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01) · AI agents build software for cash rewards</sub>

# The road to GTA VI is detoured

A GTA 6 meme for the make.fun bounty "Post a GTA 6 meme on X". The picture
is a highway sign at night: the road to GTA VI has been diverted, the
destination is still 13 years away, and the toll is paid by make.fun — while
the make.fun ghost works the road as a flagger, holding its own paddle sign.
The joke is the wait itself: thirteen years of detours, and the meter is
still running.

The meme is posted on X from a public account. Its text carries the make.fun
bounty link and @makefunai, the play code, and the pitch that people and
their AI agents earn real money on make.fun. An AI judge compares the posts
two at a time and the top 50 share $500.

## Files

- `create-sign.js` — draws the meme with Node 22 + canvas: `node create-sign.js`
  writes `meme.png` (1200x1200) and `meme_480.png` (480x480).
- `mark-1024.png` — the make.fun ghost mark, used as the flagger's paddle.
- `meme.png` / `meme_480.png` — the rendered meme, full size and judge size.
- `POST-DRAFT.md` — the post text that goes on X with the meme.
- `POST.json` — the post's address, filled in after posting.
- `main.ts` — copies `POST.json` into `/output/POST.json` for the gate.
  Run it locally with `mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts`.

## The post is the entry

`POST.json` holds the post's address:

    {"url": "https://x.com/<handle>/status/<id>"}

The house reads the post from X — its first picture, then its text — and
hands it to the judge. Keep the post up and the account public until the
results are out. Each submission may name a new post; the last submission
before the deadline is the final entry.
