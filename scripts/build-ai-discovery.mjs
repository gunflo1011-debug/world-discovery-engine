import { readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const baseUrl = 'https://gunflo1011-debug.github.io/world-discovery-engine';

function absolute(path) {
  return new URL(path, `${baseUrl}/`).href;
}

function requireObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value;
}

function requireText(value, label) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} is required`);
  return value.trim();
}

function validateEvidenceIndex(index) {
  requireObject(index, 'evidence index');
  if (index.schemaVersion !== '1.2') throw new Error('AI discovery requires evidence index schema 1.2');
  if (!Array.isArray(index.evidence)) throw new Error('evidence index records are required');
  for (const record of index.evidence) {
    if (record.status !== 'REAL' || record.discoveryReady !== true) throw new Error(`non-discovery-ready evidence leaked into AI manifest: ${record.slug}`);
    requireText(record.url, 'evidence.url');
    requireText(record.indicator?.code, 'evidence.indicator.code');
    requireText(record.entity?.code, 'evidence.entity.code');
    if (!Number.isInteger(record.referenceYear)) throw new Error('evidence.referenceYear is required');
    requireText(record.machineReadable?.json, 'evidence.machineReadable.json');
    requireText(record.machineReadable?.csv, 'evidence.machineReadable.csv');
  }
}

function validateInternetUse(data) {
  requireObject(data, 'internet-use data');
  if (data.status !== 'CURRENT_VERIFIED') throw new Error('internet-use data must be CURRENT_VERIFIED');
  if (data.indicator?.code !== 'IT.NET.USER.ZS') throw new Error('unexpected internet-use indicator');
  if (!Number.isInteger(data.observationYear)) throw new Error('internet-use observationYear is required');
  if (!Array.isArray(data.records) || data.records.length === 0) throw new Error('internet-use records are required');
  if (!data.records.every((record) => record.year === data.observationYear)) throw new Error('mixed internet-use observation years are forbidden');
  requireText(data.indicator?.name, 'internet-use indicator.name');
  requireText(data.indicator?.unit, 'internet-use indicator.unit');
  requireText(data.indicator?.definition, 'internet-use indicator.definition');
  requireText(data.source?.publisher, 'internet-use source.publisher');
  requireText(data.source?.dataset, 'internet-use source.dataset');
  requireText(data.source?.surface, 'internet-use source.surface');
  requireText(data.source?.metadataUrl, 'internet-use source.metadataUrl');
  requireText(data.source?.license, 'internet-use source.license');
  requireText(data.source?.attribution, 'internet-use source.attribution');
  requireText(data.retrievalUrl, 'internet-use retrievalUrl');
  requireText(data.retrievedAt, 'internet-use retrievedAt');
}

function buildManifest(evidenceIndex, internetUse) {
  const evidence = evidenceIndex.evidence.map((record) => ({
    type: 'revision_evidence',
    status: 'REAL',
    indicator: record.indicator,
    entity: record.entity,
    referenceYear: record.referenceYear,
    humanUrl: absolute(record.url),
    jsonUrl: absolute(record.machineReadable.json),
    csvUrl: absolute(record.machineReadable.csv),
    methodologyNote: record.methodologyNote,
    license: record.license,
    vintages: record.vintages,
    citation: {
      recommendedHumanUrl: absolute(record.url),
      recommendedMachineUrl: absolute(record.machineReadable.json),
      sourceType: 'historical revision evidence',
      referenceYear: record.referenceYear,
      indicatorCode: record.indicator.code,
      entityCode: record.entity.code
    }
  }));

  const internetUseCountries = internetUse.records.map((record) => ({
    type: 'current_indicator_observation',
    status: 'CURRENT_VERIFIED',
    indicatorCode: internetUse.indicator.code,
    indicatorName: internetUse.indicator.name,
    entity: { type: 'country', code: record.code, name: record.country },
    observationYear: record.year,
    value: record.value,
    unit: internetUse.indicator.unit,
    humanUrl: absolute(`/indicators/internet-use/country/${record.code.toLowerCase()}/`),
    jsonUrl: absolute(`/indicators/internet-use/country/${record.code.toLowerCase()}/data.json`),
    csvUrl: absolute(`/indicators/internet-use/country/${record.code.toLowerCase()}/data.csv`),
    citation: {
      recommendedHumanUrl: absolute(`/indicators/internet-use/country/${record.code.toLowerCase()}/`),
      recommendedMachineUrl: absolute(`/indicators/internet-use/country/${record.code.toLowerCase()}/data.json`),
      publisher: internetUse.source.publisher,
      dataset: internetUse.source.dataset,
      surfacedVia: internetUse.source.surface,
      metadataUrl: internetUse.source.metadataUrl,
      retrievalUrl: internetUse.retrievalUrl,
      retrievedAt: internetUse.retrievedAt,
      license: internetUse.source.license,
      attribution: internetUse.source.attribution
    }
  }));

  return {
    schemaVersion: '1.1',
    generatedFrom: {
      realEvidenceIndex: absolute('/evidence/index.json'),
      internetUseDataset: absolute('/indicators/internet-use/data.json'),
      sourcesPage: absolute('/sources/')
    },
    trustPolicy: {
      preferStatuses: ['REAL', 'CURRENT_VERIFIED'],
      excludeDemoFromPreferredDiscovery: true,
      internetUseScope: 'verified same-year subset; not a complete global ranking; not a historical revision product',
      realGdpRevisionStatus: 'blocked pending release-specific methodology comparability evidence'
    },
    collections: {
      evidence,
      internetUse: {
        indicator: internetUse.indicator,
        observationYear: internetUse.observationYear,
        coverage: internetUse.coverage,
        humanUrl: absolute('/indicators/internet-use/'),
        jsonUrl: absolute('/indicators/internet-use/data.json'),
        csvUrl: absolute('/indicators/internet-use/data.csv'),
        countryIndexUrl: absolute('/indicators/internet-use/country/index.json'),
        source: {
          publisher: internetUse.source.publisher,
          dataset: internetUse.source.dataset,
          surface: internetUse.source.surface,
          metadataUrl: internetUse.source.metadataUrl,
          retrievalUrl: internetUse.retrievalUrl,
          retrievedAt: internetUse.retrievedAt,
          license: internetUse.source.license,
          attribution: internetUse.source.attribution
        },
        countries: internetUseCountries
      }
    }
  };
}

function buildLlmsText(manifest) {
  const internet = manifest.collections.internetUse;
  const lines = [
    '# World Discovery Engine',
    '',
    '> Source-faithful public-data evidence and indicator discovery. Prefer the machine-readable resources below for citation and retrieval.',
    '',
    '## Trust rules',
    '',
    '- Prefer records explicitly marked REAL or CURRENT_VERIFIED.',
    '- Demo fixtures are not preferred discovery evidence.',
    '- Internet-use pages report a verified same-year subset and do not claim a complete global ranking or a historical revision.',
    '- Real-GDP revision publishing is blocked until release-specific methodology comparability is independently established.',
    '',
    '## Citation and provenance',
    '',
    `- [Sources and methodology](${manifest.generatedFrom.sourcesPage}): human-readable provenance hub.`,
    `- For a specific claim, prefer the country/evidence human page plus its linked JSON as the machine-readable citation target.`,
    '',
    '## Machine-readable collections',
    '',
    `- [REAL evidence index](${manifest.generatedFrom.realEvidenceIndex}): revision evidence with provenance, methodology, JSON and CSV links.`,
    `- [Internet-use dataset](${internet.jsonUrl}): ${internet.indicator.code}, ${internet.observationYear}, ${internet.coverage.countries} verified countries in the current snapshot.`,
    `- [Internet-use CSV](${internet.csvUrl}): same normalized observations in CSV.`,
    `- [Internet-use country index](${internet.countryIndexUrl}): country-profile discovery registry with machine-readable links.`,
    `- [Internet-use human hub](${internet.humanUrl}): comparison page and country-profile directory.`,
    `- [AI discovery manifest](${absolute('/ai-index.json')}): structured manifest for the resources summarized in this file.`,
    '',
    '## Internet-use country profiles',
    ''
  ];

  for (const country of internet.countries) {
    lines.push(`- [${country.entity.name}](${country.humanUrl}) — ${country.value}${country.unit === '% of population' ? '%' : ` ${country.unit}`} in ${country.observationYear}; [JSON](${country.jsonUrl}); [CSV](${country.csvUrl}).`);
  }

  lines.push('', '## Citation guidance', '', `Internet-use source: ${internet.source.publisher}, ${internet.source.dataset}, surfaced via ${internet.source.surface}. ${internet.source.attribution}`.trim(), `Metadata: ${internet.source.metadataUrl}`, `Retrieval: ${internet.source.retrievalUrl}`, `License: ${internet.source.license}. Retrieved ${internet.source.retrievedAt}.`, '');
  return `${lines.join('\n')}\n`;
}

const [evidenceIndex, internetUse] = await Promise.all([
  readFile(new URL('evidence/index.json', siteRoot), 'utf8').then(JSON.parse),
  readFile(new URL('indicators/internet-use/data.json', siteRoot), 'utf8').then(JSON.parse)
]);

validateEvidenceIndex(evidenceIndex);
validateInternetUse(internetUse);
const manifest = buildManifest(evidenceIndex, internetUse);
await Promise.all([
  writeFile(new URL('ai-index.json', siteRoot), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8'),
  writeFile(new URL('llms.txt', siteRoot), buildLlmsText(manifest), 'utf8')
]);

console.log(`Built AI discovery manifest with ${manifest.collections.evidence.length} REAL evidence records and ${manifest.collections.internetUse.countries.length} internet-use country observations.`);
