# Cohesity Press Release Migration Plan

## Overview

Migrate the Cohesity press release page (https://www.cohesity.com/newsroom/press/cohesity-earns-aws-resilience-competency/) to AEM Edge Delivery Services, including both content structure and visual design styling.

## Source

- **URL**: https://www.cohesity.com/newsroom/press/cohesity-earns-aws-resilience-competency/
- **Type**: Single page migration (Press Release / News article)
- **Project**: Existing EDS project (doc-based authoring)
- **Design**: Full design migration included

## Migration Steps

### Phase 1: Content Migration
1. **Page Analysis** — Analyze the Cohesity press release page to identify sections, blocks, content structure, and authoring decisions
2. **Block Mapping** — Map identified content patterns to EDS blocks (reuse existing variants or create new ones for press release structure)
3. **Import Infrastructure** — Generate block parsers and page transformers
4. **Content Import** — Execute the import to produce EDS-compatible HTML content
5. **Preview & Verification** — Render the migrated page locally and verify content accuracy

### Phase 2: Design Migration
6. **Design Token Extraction** — Extract site-level design tokens (colors, fonts, spacing) from the Cohesity site
7. **Block Styling** — Apply visual styling to each block to match the original appearance
8. **Page-Level Styling** — Apply global styles (typography, layout, backgrounds)
9. **Visual Comparison** — Compare migrated page against original for pixel-level accuracy

## Checklist

- [x] Obtain source page URL
- [ ] Analyze page structure (sections, blocks, metadata)
- [ ] Identify and map block variants (reuse existing or create new)
- [ ] Generate import parsers for each block
- [ ] Generate page transformers (cleanup, sections, metadata)
- [ ] Bundle and execute the import script
- [ ] Verify migrated content renders correctly in local preview
- [ ] Extract design tokens (colors, fonts, spacing)
- [ ] Style blocks to match original visual design
- [ ] Apply global page styles
- [ ] Visual comparison and refinement

## Notes

- **Execution requires switching out of Plan mode.**
- The `excat:excat-site-migration` skill will handle Phase 1 (content migration).
- The `excat:excat-complete-design-expert` skill will handle Phase 2 (design migration).
- This is a press release page — likely has a simpler structure than the LG homepage (heading, date, body text, quotes, boilerplate) with fewer complex blocks.
- Existing block variants from the previous migration may be partially reusable if the page has cards or columns patterns.
