# MVP data model

## Source
- id
- name
- homepage_url
- dataset_url
- license_name
- license_url
- attribution_text

## Indicator
- id
- source_id
- source_series_code
- slug
- name
- description
- unit
- frequency
- topic
- comparability_notes
- active

## Vintage
- id
- source_id
- published_at
- retrieved_at
- source_url
- checksum

A vintage is immutable after successful ingestion.

## Observation
Composite identity: `(indicator_id, economy_code, reference_period, vintage_id)`.

Fields:
- numeric_value
- unit_snapshot
- methodology_fingerprint
- status/flags

## MethodologyVersion
- indicator_id
- fingerprint
- valid_from_vintage
- valid_to_vintage
- unit
- definition_snapshot
- notes

## RevisionEvent
Derived, never manually authored.

- indicator_id
- economy_code
- reference_period
- from_vintage_id
- to_vintage_id
- from_value
- to_value
- absolute_delta
- relative_delta
- direction
- comparable
- comparability_reason

## Discovery
A deterministic assertion produced by a versioned rule.

- slug
- rule_id
- rule_version
- title
- summary
- period
- comparison_group
- generated_at
- quality_status

## Evidence
Links a discovery to exact observations, transformations and sources needed to reproduce it.

## Comparability gate
A revision is publishable only when:
1. series identity is stable;
2. units are compatible;
3. methodology fingerprint has not changed incompatibly;
4. both values are numeric and valid;
5. the comparison does not cross a known structural break without an explicit rule.

Unknown comparability fails closed.
