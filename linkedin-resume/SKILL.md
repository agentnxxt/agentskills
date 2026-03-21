---
name: linkedin-resume
description: >
  Generates a polished, professional resume from a LinkedIn profile. Trigger this skill when a user
  asks to create, build, or generate a resume from a LinkedIn profile URL, a person's name and
  company, or a LinkedIn-sourced prospect. Uses the Explorium prospect matching and enrichment
  tools to retrieve professional background data (work history, education, skills, demographics)
  and formats the output as a structured, ATS-friendly resume in Markdown.
---

# LinkedIn Resume Generator

Creates a professional resume from LinkedIn profile data retrieved via Explorium prospect
matching and enrichment.

## When to Use

Trigger this skill when the user:
- Asks to create/build/generate a resume from a LinkedIn profile
- Provides a LinkedIn URL and asks for a resume
- Provides a person's name (and optionally company) and asks for a resume
- Asks to convert LinkedIn data into resume format

## Inputs

The user must provide **at least one** of the following:
- **LinkedIn profile URL** (e.g., `https://www.linkedin.com/in/johndoe`)
- **Full name + company name** (e.g., "John Doe at Acme Corp")
- **Email address** of the person

If the input is ambiguous, ask the user to clarify before proceeding.

---

## Workflow

### Step 1 — Match the Prospect

Use `match-prospects` to identify the person in Explorium's database.

**Input mapping:**
| User provides | match-prospects field |
|---|---|
| LinkedIn URL | `linkedin` |
| Full name + company | `full_name` + `company_name` |
| Email address | `email` |

- If no match is found, inform the user and suggest they verify the spelling, provide
  additional identifiers (company name, email), or try a different LinkedIn URL.
- If multiple matches are returned, present them to the user and ask which person to use.

### Step 2 — Enrich the Prospect Profile

Once matched, call `enrich-prospects` with:
- `enrichments`: `["enrich-prospects-profiles"]`
- The `session_id` and `table_name` from the match-prospects result

This retrieves:
- Full name and demographics
- Current and past job titles, companies, and durations
- Education history (schools, degrees, fields of study)
- Location information
- Role details and seniority

### Step 3 — Optionally Enrich Contact Information

If the user explicitly requests contact details on the resume, also call `enrich-prospects` with:
- `enrichments`: `["enrich-prospects-contacts"]`
- `parameters`: `{"contact_types": ["email", "phone"]}` (or whichever the user requests)

**Important:** Only include contact information if the user specifically asks for it. Contact
enrichment has a credit cost — always show the cost estimate and get user confirmation before
proceeding.

### Step 4 — Generate the Resume

Using all retrieved data, generate a professional resume following the format in the
**Resume Template** section below.

**Data mapping rules:**
- **Name**: Use the full name from the enriched profile
- **Title**: Use the current job title; if unavailable, derive from most recent role
- **Location**: Use city/state/country from the profile
- **Contact**: Only include if Step 3 was performed and user requested it
- **Summary**: Synthesize a 2–3 sentence professional summary from role history, seniority,
  industry, and skills. Do NOT fabricate achievements or metrics not present in the data.
- **Experience**: List all roles in reverse chronological order. Include company name, title,
  date range, and location where available.
- **Education**: List degrees in reverse chronological order. Include institution, degree,
  field of study, and dates where available.
- **Skills**: Extract from job titles, role descriptions, and industry context. Only include
  skills that can be reasonably inferred from the data — do NOT invent skills.

### Step 5 — Present and Refine

- Present the resume to the user in Markdown format
- Offer to adjust formatting, add/remove sections, or regenerate with different emphasis
- If the user wants to export, offer to save as a Markdown file

---

## Resume Template

```markdown
# [FULL NAME]

**[CURRENT TITLE]** | [LOCATION]
[Email — only if enriched] | [Phone — only if enriched] | [LinkedIn URL — if provided]

---

## Professional Summary

[2–3 sentences synthesized from career trajectory, industry, seniority level, and expertise
areas. Ground every claim in the retrieved data. Never fabricate metrics, awards, or
achievements.]

---

## Experience

### [JOB TITLE]
**[COMPANY NAME]** | [LOCATION] | [START DATE] – [END DATE or Present]

[If role description or responsibilities are available from enrichment, include 2–4 bullet
points. If not available, omit bullets rather than fabricating content.]

### [JOB TITLE]
**[COMPANY NAME]** | [LOCATION] | [START DATE] – [END DATE]

[Repeat for each role in reverse chronological order]

---

## Education

### [DEGREE] in [FIELD OF STUDY]
**[INSTITUTION NAME]** | [START YEAR] – [END YEAR]

[Repeat for each education entry]

---

## Skills

[Comma-separated list of skills inferred from job titles, industries, and role context.
Only include skills with clear evidence from the profile data.]
```

---

## Important Rules

1. **Never fabricate data.** If a field is not available from the enrichment, omit it entirely.
   Do not guess job responsibilities, achievements, metrics, or skills that are not supported
   by the retrieved data.

2. **Respect credit costs.** Profile enrichment and contact enrichment consume credits. Always
   show the cost estimate to the user and wait for confirmation before running enrichments.

3. **Privacy awareness.** Resumes contain personal information. Remind the user that the
   generated resume is based on publicly available LinkedIn data and should be used
   responsibly and in compliance with applicable privacy regulations.

4. **Date formatting.** Use "MMM YYYY" format (e.g., "Jan 2020") for dates. If only a year
   is available, use the year alone. If no dates are available for a role, use "Dates not
   available."

5. **Presentation order.** Always present sections in this order: Header, Summary, Experience,
   Education, Skills. If a section has no data, omit it entirely rather than showing an empty
   section.

6. **Multiple profiles.** If the user asks to generate resumes for multiple people, process
   them sequentially. Confirm each enrichment cost separately.

7. **Refinement.** After presenting the resume, proactively offer:
   - Adjusting the professional summary tone (e.g., more technical, more executive)
   - Reordering or emphasizing certain roles
   - Adding a specific skills section focus
   - Saving the resume to a file

---

## Error Handling

| Scenario | Action |
|---|---|
| No match found | Ask user to verify input; suggest adding company name or email |
| Multiple matches | Present options with name, title, and company; ask user to pick |
| Enrichment returns sparse data | Generate resume with available data; note which sections are incomplete |
| Enrichment cost too high | Show cost estimate; suggest matching only (free) for basic info |
| LinkedIn URL is malformed | Ask user to verify the URL format |

---

## Example Interaction

**User:** Create a resume from https://www.linkedin.com/in/janedoe

**Skill workflow:**
1. Call `match-prospects` with `linkedin: "https://www.linkedin.com/in/janedoe"`
2. Match found → call `enrich-prospects` with `["enrich-prospects-profiles"]`
3. Show cost estimate → user confirms
4. Receive enriched data (name, 3 roles, 1 education entry, location)
5. Generate and present resume in Markdown format
6. Offer refinements

---

Maintained by Autonomyx. Last updated: March 2026.
