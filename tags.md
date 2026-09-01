# Tag Taxonomy

## Execution Tags — applied to individual tests

| Tag | Meaning | Run by | When | Rule |
|-----|---------|--------|------|------|
| @smoke | Critical path alive | Everyone | Every commit | Max 5 minutes total |
| @regression | Full coverage | CI, QA | Nightly, pre-release | All implemented tests |
| @critical | Revenue path | QA lead | Pre-production | Failure = immediate impact |

## Type Tags — applied to describe blocks

| Tag | Meaning |
|-----|---------|
| @journey | Crosses multiple feature areas |
| @api | HTTP only, no browser |

## Feature Tags — applied to describe blocks

| Tag | Feature area |
|-----|-------------|
| @checkout | Checkout and purchase flow |
| @authentication | Login, logout, session |
| @cart | Cart management |
| @orders | Order history and detail |
| @products | Search, filter, product detail |
| @profile | Account and billing address |

## Rules

1. Feature tags go on describe blocks
2. Execution tags go on individual tests
3. Every test inherits exactly one feature tag from its describe
4. Every implemented test gets @regression
5. Smoke suite must complete in under 5 minutes
6. @api appears on both describe and individual test