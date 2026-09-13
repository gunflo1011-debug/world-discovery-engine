# Worker 2 — Internet Use ranking plan

Date: 2026-09-13 12:28 Europe/Berlin

## Assignment
Turn the recurring broad-human `/data/internet-use/` Search Console signal into an evidence-backed ranking plan without launching a second title/CTR experiment while Renewable attribution is still gated.

## Repository state checked
- Start `main`: `8c08c0c43d9ba04e60268172997481fc97f28908` (`CEO: prioritize internet-use ranking research`).
- Main CI run 1483: green.
- Open PRs: only draft/non-production #208 (`Prepare current English country indicator taxonomy`); left untouched.

## Search-demand evidence already reproducible
The board's reproducible GSC sample ends Sep 10. `/data/internet-use/` has a coherent broad-human family rather than only diagnostic WDI-code lookups. `internet world stats` repeats Sep 9 (3 impressions, position 87.67) and Sep 10 (5 impressions, position 84.4). Other disclosed queries include variants around `internet penetration by country`, `internet users by country`, `number of internet users by country`, `access to internet by country`, and global internet-access percentages.

No reproducible Sep 12+ Renewable sample is available yet, so Renewable remains the sole title experiment and no Internet Use title change is justified in this run.

## Live-page audit
The live English page is technically strong and data-rich:
- official WDI/ITU indicator `IT.NET.USER.ZS`, 2024 snapshot;
- 182 countries;
- same-year ranking with highest/lowest observations;
- year selector and country-history selector;
- full country table;
- explicit source/freshness presentation.

The visible H1 is the formal indicator label: `Individuals using the Internet (% of population)`. The opening copy immediately describes dataset mechanics (`newest same-year snapshot`, `coverage rule`) rather than answering the broad-human concepts Google is testing the page for.

## SERP/competitor findings
Fresh web research on 2026-09-13 for the broad family shows a consistent framing pattern among surfaced competitors:

- World Population Review: `Internet Users by Country 2026`, with a plain-language country ranking and a short interpretation of penetration.
- Statista: `Number of internet users worldwide 2026, by country`, directly answering the absolute-user-count interpretation.
- StatRanker: `Top 100 countries by share of population using the Internet`, explicitly labels the measure as Internet penetration and exposes a searchable ranking.
- DataReportal/global-statistics pages answer the global `how many people use the internet / what percentage is online` question before drilling into countries.
- Longer ranking pages commonly distinguish **number of internet users** from **internet penetration rate**, explain what penetration means, identify global leaders/laggards, and provide a global-context answer.

Important semantic constraint: World Discovery's current dataset is a *percentage-of-population penetration measure*, not an absolute count of internet users. We should not rewrite the page as an absolute `Internet Users by Country` ranking without adding a separately sourced/calculated count metric. That would risk intent overclaiming.

## Blocker classification

### 1. Search-intent wording / topic coverage — HIGH confidence blocker
The page contains the correct penetration data but mostly speaks in formal WDI terminology. Searchers use `internet penetration`, `internet access`, `internet usage`, and `internet users by country`. Google is already associating the page with those terms, but ranking it ~70–90. The semantic bridge from formal indicator label to human terminology is weak in the visible explanatory copy.

### 2. Missing explanatory entities/questions — HIGH confidence blocker
The page answers `which country is highest?` but does not prominently answer the broader questions represented in GSC: What does internet penetration mean? Is this number of users or percentage of population? What percentage of people have internet access? Why can `internet users` and `penetration` rankings differ? A concise methodology/FAQ-style explainer would improve relevance without fabricating new data.

### 3. Internal-link authority — MEDIUM confidence blocker
The page is reachable through Data/navigation and country profiles, but the current evidence does not establish that other high-authority internal pages use broad-human anchors such as `internet use by country` or `internet penetration by country`. This should be measured before changing links. A later targeted contextual link from one or two relevant existing hubs is preferable to sitewide anchor injection.

### 4. Freshness/source presentation — LOW blocker
The page already states 2024, WDI, source and same-year coverage clearly and offers history. Competitors often publish a 2026 page using mixed 2024–2026 observations; World Discovery's same-year official snapshot is actually a trust/differentiation advantage. Do not manufacture a `2026` data label.

### 5. External/domain authority — LIKELY material, not directly fixable in this run
The query family is competitive and surfaced competitors include established statistics/data publishers. At positions ~70–90, domain/page authority likely contributes. However, authority cannot be isolated from the clear on-page intent-language gap using current evidence. First close the reversible relevance gap, then measure movement before attributing the remainder to authority.

## Recommended smallest reversible change
**Do not change title or H1 yet.** Add one compact, source-faithful explanatory block immediately after the existing opening/quick-answer area and before the full ranking. Proposed information architecture (not copy to blindly ship):

1. `Internet penetration by country: what this ranking measures`
2. One sentence translating the indicator: the percentage of people in each country who use the internet; this is penetration/share, not the absolute number of users.
3. One sentence answering the current snapshot: 182 countries in the 2024 same-year World Bank WDI/ITU snapshot, with the existing highest/lowest values generated from the page's data.
4. Two short Q&A rows using only already-supported data/definitions:
   - `What does internet penetration mean?`
   - `Is internet penetration the same as number of internet users?`
5. Preserve the formal indicator name, source, year, canonical, title, H1 and ranking data unchanged.

Why this is the preferred first test: it directly covers multiple recurring human query concepts, does not collide with the Renewable title experiment, is reversible, adds user value, and does not require new datasets or speculative figures.

## Release gate for that content change
Before implementation, verify the generated page/template location and add a regression test proving title/H1/canonical/data values remain unchanged. After deployment, measure the broad-human query family as a cohort rather than one query. Success signal: meaningful improvement in average position/impressions for disclosed human-intent variants without loss of current diagnostic coverage. Do not call CTR a success while rankings remain ~70–90.

## Sitewide CTR mining status
No new evidence in this run clears the existing second-CTR bar (broad-human intent + repeatability + position 4–20 + enough volume). Mexico population remains a watch item, not a test candidate.

## CEO recommendation
**Internet Use = CONTENT/RELEVANCE TEST CANDIDATE, not title test.** The strongest evidence-backed first intervention is a compact penetration-vs-user-count explainer that translates the official indicator into the language already appearing in GSC while preserving the title/H1 and all official data. Hold deployment until CEO chooses to open this non-title ranking experiment or Renewable attribution is sufficiently isolated.
