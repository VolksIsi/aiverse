# AIVerse Agent Maintenance Manual

## Architecture
- All content is in `/data/*.json` files
- Never edit index.html, styles.css directly for content changes
- Always update `last_updated` field after any change
- Always log your run in `data/agent-log.json` 

## Agent Tasks

### LINK CHECKER AGENT (run daily)
1. Read data/products.json
2. For each product, send HEAD request to affiliate_url
3. If response != 200: set link_active: false, add note
4. Update last_checked date
5. Commit: "🤖 Link check - [date]"

### PRICE MONITOR AGENT (run weekly)  
1. Read data/products.json
2. Web search: "[product name] affiliate commission 2026"
3. Update commission_percent if changed
4. Commit: "🤖 Price update - [date]"

### CONTENT UPDATER AGENT (run weekly)
1. Read data/products.json
2. Web search: "[product name] reviews 2026"
3. Update rating, review_count, pros, cons if significantly different
4. Commit: "🤖 Content update - [date]"

### NEW PRODUCTS AGENT (run monthly)
1. Web search: "best new AI tools affiliate program 2026 high commission"
2. Find 1-2 new products worth adding
3. Add to products.json with all required fields
4. Set rank higher than existing if better
5. Commit: "🤖 New product added - [product name]"

## Agent Log Format
After every run, append to data/agent-log.json:
```json
{
  "date": "2026-03-30",
  "agent": "link-checker",
  "status": "success",
  "changes": ["jasper-ai: link verified", "pictory-ai: link verified"],
  "next_run": "2026-03-31"
}
```

## GitHub Push Instructions
```bash
git add data/
git commit -m "🤖 [agent-name] - [date]"
git push origin main
```

## Manual Product Addition

To add a new product manually:

1. Add to `data/products.json`:
```json
{
  "id": "unique-product-id",
  "name": "Product Name",
  "category": "Category",
  "tagline": "Short description",
  "affiliate_url": "https://example.com/?ref=aiverse",
  "commission_percent": 30,
  "commission_type": "recurring",
  "price_starting": 49,
  "currency": "USD",
  "rating": 4.5,
  "review_count": 1000,
  "badge": "Optional Badge",
  "badge_color": "#06B6D4",
  "pros": ["Pro 1", "Pro 2"],
  "cons": ["Con 1", "Con 2"],
  "last_checked": "2026-03-30",
  "link_active": true,
  "featured": true,
  "rank": 4
}
```

2. Update `last_updated` in `data/site-config.json`
3. Commit and push changes

## API Integration for External Agents

### GitHub API Endpoints
- Base URL: `https://api.github.com/repos/VolksIsi/aiverse`
- Authentication: Bearer token required

### Update Products
```bash
curl -X PATCH \
  -H "Authorization: token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"🤖 Agent update","content":"BASE64_ENCODED_JSON"}' \
  "https://api.github.com/repos/VolksIsi/aiverse/contents/data/products.json"
```

### Get Latest Data
```bash
curl -H "Authorization: token YOUR_TOKEN" \
  "https://api.github.com/repos/VolksIsi/aiverse/contents/data/products.json"
```

## Maintenance Schedule

- **Daily**: Link checker (8:00 UTC)
- **Weekly**: Price monitor (9:00 UTC Monday)
- **Weekly**: Content updater (10:00 UTC Monday)
- **Monthly**: New products finder (1st of month)

## Error Handling

- If JSON validation fails: log error, skip update
- If network fails: retry 3 times, then log failure
- If GitHub API fails: check rate limits, backoff exponentially

## Performance Monitoring

Track these metrics in agent logs:
- Data load time
- Render time
- API response times
- Error rates
- Success/failure ratios

## Security Notes

- Never commit sensitive data
- Validate all JSON before parsing
- Sanitize all web-scraped data
- Use HTTPS for all external requests
- Respect robots.txt and rate limits
