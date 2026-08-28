import { readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const baseUrl = 'https://worlddiscoverydata.com';

function absolute(path) {
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
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

function validateCurrentIndicator(data, expectedCode, label) {
  requireObject(data, `${label} data`);
  if (data.status !== 'CURRENT_VERIFIED') throw new Error(`${label} data must be CURRENT_VERIFIED`);
  if (data.indicator?.code !== expectedCode) throw new Error(`unexpected ${label} indicator`);
  if (!Number.isInteger(data.observationYear)) throw new Error(`${label} observationYear is required`);
  if (!Array.isArray(data.records) || data.records.length === 0) throw new Error(`${label} records are required`);
  if (!data.records.every((record) => record.year === data.observationYear)) throw new Error(`mixed ${label} observation years are forbidden`);
  requireText(data.indicator?.name, `${label} indicator.name`);
  requireText(data.indicator?.unit, `${label} indicator.unit`);
  requireText(data.indicator?.definition, `${label} indicator.definition`);
  requireText(data.source?.publisher, `${label} source.publisher`);
  requireText(data.source?.dataset, `${label} source.dataset`);
  requireText(data.source?.surface, `${label} source.surface`);
  requireText(data.source?.metadataUrl, `${label} source.metadataUrl`);
  requireText(data.source?.license, `${label} source.license`);
  requireText(data.source?.attribution, `${label} source.attribution`);
  requireText(data.retrievalUrl, `${label} retrievalUrl`);
  requireText(data.retrievedAt, `${label} retrievedAt`);
}

function sourceBlock(data) {
  return {
    publisher: data.source.publisher,
    dataset: data.source.dataset,
    surface: data.source.surface,
    metadataUrl: data.source.metadataUrl,
    retrievalUrl: data.retrievalUrl,
    retrievedAt: data.retrievedAt,
    license: data.source.license,
    attribution: data.source.attribution
  };
}

function buildManifest(evidenceIndex, internetUse, gdpPerCapita) {
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

  const gdpCountries = gdpPerCapita.records.map((record) => ({
    type: 'current_indicator_observation',
    status: 'CURRENT_VERIFIED',
    indicatorCode: gdpPerCapita.indicator.code,
    indicatorName: gdpPerCapita.indicator.name,
    entity: { type: 'country', code: record.code, name: record.country },
    region: record.region,
    observationYear: record.year,
    value: record.value,
    unit: gdpPerCapita.indicator.unit,
    humanUrl: absolute('/indicators/gdp-per-capita/'),
    jsonUrl: absolute('/indicators/gdp-per-capita/data.json'),
    citation: {
      recommendedHumanUrl: absolute('/indicators/gdp-per-capita/'),
      recommendedMachineUrl: absolute('/indicators/gdp-per-capita/data.json'),
      publisher: gdpPerCapita.source.publisher,
      dataset: gdpPerCapita.source.dataset,
      surfacedVia: gdpPerCapita.source.surface,
      metadataUrl: gdpPerCapita.source.metadataUrl,
      retrievalUrl: gdpPerCapita.retrievalUrl,
      retrievedAt: gdpPerCapita.retrievedAt,
      license: gdpPerCapita.source.license,
      attribution: gdpPerCapita.source.attribution
    }
  }));

  return {
    schemaVersion: '1.2',
    generatedFrom: {
      realEvidenceIndex: absolute('/evidence/index.json'),
      internetUseDataset: absolute('/indicators/internet-use/data.json'),
      gdpPerCapitaDataset: absolute('/indicators/gdp-per-capita/data.json'),
      sourcesPage: absolute('/sources/')
    },
    trustPolicy: {
      preferStatuses: ['REAL', 'CURRENT_VERIFIED'],
      excludeDemoFromPreferredDiscovery: true,
      internetUseScope: 'verified same-year subset; not a historical revision product',
      gdpPerCapitaScope: 'verified same-year nominal current-US-dollar snapshot; not purchasing-power adjusted and not a historical revision product',
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
        source: sourceBlock(internetUse),
        countries: internetUseCountries
      },
      gdpPerCapita: {
        indicator: gdpPerCapita.indicator,
        observationYear: gdpPerCapita.observationYear,
        coverage: gdpPerCapita.coverage,
        humanUrl: absolute('/indicators/gdp-per-capita/'),
        jsonUrl: absolute('/indicators/gdp-per-capita/data.json'),
        source: sourceBlock(gdpPerCapita),
        countries: gdpCountries
      }
    }
  };
}

function buildLlmsText(manifest) {
  const internet = manifest.collections.internetUse;
  const gdp = manifest.collections.gdpPerCapita;
  const lines = [
    '# World Discovery Data',
    '',
    '> Source-faithful public-data evidence and indicator discovery. Prefer the machine-readable resources below for citation and retrieval.',
    '',
    '## Trust rules',
    '',
    '- Prefer records explicitly marked REAL or CURRENT_VERIFIED.',
    '- Demo fixtures are not preferred discovery evidence.',
    '- Internet-use pages report a verified same-year snapshot and do not claim a historical revision.',
    '- GDP per capita reports nominal current-U.S.-dollar values; it is not purchasing-power adjusted or inflation adjusted.',
    '- Real-GDP revision publishing is blocked until release-specific methodology comparability is independently established.',
    '',
    '## Citation and provenance',
    '',
    `- [Sources and methodology](${manifest.generatedFrom.sourcesPage}): human-readable provenance hub.`,
    '- For a specific claim, prefer the relevant human page plus its linked JSON as the machine-readable citation target.',
    '',
    '## Machine-readable collections',
    '',
    `- [REAL evidence index](${manifest.generatedFrom.realEvidenceIndex}): revision evidence with provenance, methodology, JSON and CSV links.`,
    `- [Internet-use dataset](${internet.jsonUrl}): ${internet.indicator.code}, ${internet.observationYear}, ${internet.coverage.countries} verified countries.`,
    `- [Internet-use CSV](${internet.csvUrl}): same normalized observations in CSV.`,
    `- [Internet-use country index](${internet.countryIndexUrl}): country-profile discovery registry with machine-readable links.`,
    `- [Internet-use human hub](${internet.humanUrl}): comparison page and country-profile directory.`,
    `- [GDP per capita dataset](${gdp.jsonUrl}): ${gdp.indicator.code}, ${gdp.observationYear}, ${gdp.coverage.countries} verified countries in current US dollars.`,
    `- [GDP per capita human hub](${gdp.humanUrl}): same-year country comparison and methodology context.`,
    `- [AI discovery manifest](${absolute('/ai-index.json')}): structured manifest for the resources summarized in this file.`,
    '',
    '## Internet-use country profiles',
    ''
  ];

  for (const country of internet.countries) {
    lines.push(`- [${country.entity.name}](${country.humanUrl}) — ${country.value}${country.unit === '% of population' ? '%' : ` ${country.unit}`} in ${country.observationYear}; [JSON](${country.jsonUrl}); [CSV](${country.csvUrl}).`);
  }

  lines.push(
    '',
    '## GDP per capita',
    '',
    `The verified ${gdp.observationYear} GDP per capita snapshot contains ${gdp.coverage.countries} non-aggregate countries. Use the dataset JSON for exact raw values and the human hub for interpretation.`,
    `Source: ${gdp.source.publisher}, ${gdp.source.dataset}, indicator ${gdp.indicator.code}.`,
    `Metadata: ${gdp.source.metadataUrl}`,
    `Retrieval: ${gdp.source.retrievalUrl}`,
    `License: ${gdp.source.license}. Retrieved ${gdp.source.retrievedAt}.`,
    '',
    '## Citation guidance',
    '',
    `Internet-use source: ${internet.source.publisher}, ${internet.source.dataset}, surfaced via ${internet.source.surface}. ${internet.source.attribution}`.trim(),
    `Metadata: ${internet.source.metadataUrl}`,
    `Retrieval: ${internet.source.retrievalUrl}`,
    `License: ${internet.source.license}. Retrieved ${internet.source.retrievedAt}.`,
    ''
  );
  return `${lines.join('\n')}\n`;
}

const [evidenceIndex, internetUse, gdpPerCapita] = await Promise.all([
  readFile(new URL('evidence/index.json', siteRoot), 'utf8').then(JSON.parse),
  readFile(new URL('indicators/internet-use/data.json', siteRoot), 'utf8').then(JSON.parse),
  readFile(new URL('indicators/gdp-per-capita/data.json', siteRoot), 'utf8').then(JSON.parse)
]);

validateEvidenceIndex(evidenceIndex);
validateCurrentIndicator(internetUse, 'IT.NET.USER.ZS', 'internet-use');
validateCurrentIndicator(gdpPerCapita, 'NY.GDP.PCAP.CD', 'GDP per capita');
const manifest = buildManifest(evidenceIndex, internetUse, gdpPerCapita);
await Promise.all([
  writeFile(new URL('ai-index.json', siteRoot), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8'),
  writeFile(new URL('llms.txt', siteRoot), buildLlmsText(manifest), 'utf8')
]);

console.log(`Built AI discovery manifest with ${manifest.collections.evidence.length} REAL evidence records, ${manifest.collections.internetUse.countries.length} internet-use observations and ${manifest.collections.gdpPerCapita.countries.length} GDP-per-capita observations.`);
