import { mkdir, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const baseUrl = 'https://worlddiscoverydata.com';

const COPY = {
  de: {
    lang: 'de', path: 'de', title: 'Methodik — World Discovery',
    description: 'Wie World Discovery offizielle globale Daten auswählt, prüft, vergleicht und veröffentlicht, ohne Beobachtungsjahre oder Herkunft zu verschleiern.',
    eyebrow: 'Methodik', h1: 'Offizielle Daten, klare Jahre, reproduzierbare Vergleiche.',
    intro: 'World Discovery hält Quelle, Beobachtungsjahr, Einheit und Geografie direkt bei den veröffentlichten Werten. Wenn Werte nicht vergleichbar sind, zeigt die Oberfläche keine numerische Differenz so an, als wären sie es.',
    cards: [
      ['1. Offizielle Quelle', 'Veröffentlichte Indikatorwerte stammen aus eindeutig benannten offiziellen Datensätzen. Quellenangabe und Indikatoridentität bleiben auf den relevanten Datenseiten sichtbar.'],
      ['2. Beobachtungsjahr', 'Das bei einem Wert angezeigte Jahr ist sein Beobachtungsjahr. Fehlende Beobachtungen werden nicht stillschweigend mit einem Wert aus einem anderen Jahr aufgefüllt.'],
      ['3. Vergleichbarer Kontext', 'Differenzen werden nur berechnet, wenn Indikator, Einheit, Geografie und Beobachtungszeitraum der verglichenen Werte kompatibel sind.'],
      ['4. Deterministische Berechnungen', 'Rankings, Differenzen und Revisionsberechnungen werden aus gespeicherten Zahlenwerten durch Code erzeugt und nicht von einem Sprachmodell erfunden oder geschätzt.'],
      ['5. Herkunft', 'Maschinenlesbare und menschenlesbare Ausgaben werden aus denselben erhaltenen Quelldaten aufgebaut, soweit ein entsprechender Datenexport veröffentlicht wird.'],
      ['6. Stabile Veröffentlichung', 'Gepflegte Datenseiten verwenden stabile URLs, Canonicals und sichtbare Quellenangaben, damit Nutzer und Suchsysteme die aktuelle öffentliche Seite erkennen können.']
    ],
    read: 'So liest du World-Discovery-Daten',
    p1: 'Die Abdeckung kann je nach Indikator, Land oder Territorium und Jahr unterschiedlich sein. Eine geringere Abdeckung bedeutet, dass der verifizierte Datensatz für diesen Indikator und Zeitraum weniger nutzbare Beobachtungen enthält; es wird kein Wert aus einem anderen Jahr eingesetzt.',
    p2: 'Bei Ländervergleichen bleibt jedes Beobachtungsjahr sichtbar. Stammen zwei Werte aus unterschiedlichen Jahren, können beide zur Einordnung gezeigt werden, aber nicht als Differenz desselben Zeitraums.',
    sources: 'Quellen und Herkunft', status: 'Aktueller Datenstatus'
  },
  es: {
    lang: 'es', path: 'es', title: 'Metodología — World Discovery',
    description: 'Cómo World Discovery selecciona, valida, compara y publica datos globales oficiales sin ocultar los años de observación ni la procedencia.',
    eyebrow: 'Metodología', h1: 'Datos oficiales, años explícitos y comparaciones reproducibles.',
    intro: 'World Discovery mantiene la fuente, el año de observación, la unidad y la geografía junto a los valores publicados. Si dos valores no son comparables, la interfaz no presenta una diferencia numérica como si lo fueran.',
    cards: [
      ['1. Fuente oficial', 'Las observaciones publicadas proceden de conjuntos de datos oficiales identificados. La atribución de la fuente y la identidad del indicador permanecen visibles en las superficies de datos correspondientes.'],
      ['2. Año de observación', 'El año mostrado junto a un valor es su año de observación. Las observaciones que faltan no se rellenan silenciosamente con valores de otro año.'],
      ['3. Contexto comparable', 'Las diferencias solo se calculan cuando los indicadores, entidades, unidades y periodos de observación son compatibles.'],
      ['4. Cálculos deterministas', 'Los rankings, las diferencias y los cálculos de revisión se producen por código a partir de valores numéricos almacenados, no son inventados ni estimados por un modelo de lenguaje.'],
      ['5. Procedencia', 'Las salidas legibles por máquinas y por personas se construyen a partir de los mismos registros de origen cuando se publica el correspondiente acceso a datos.'],
      ['6. Publicación estable', 'Las páginas de datos mantenidas utilizan URL estables, metadatos canónicos y contexto de fuente explícito para identificar la superficie pública actual.']
    ],
    read: 'Cómo interpretar los datos de World Discovery',
    p1: 'La cobertura puede variar según el indicador, el país o territorio y el año. Una cobertura menor significa que la instantánea verificada contiene menos observaciones utilizables para ese indicador y periodo; no significa que se haya sustituido un valor por otro año.',
    p2: 'Las comparaciones entre países mantienen visible cada año de observación. Si dos valores pertenecen a años distintos, pueden mostrarse como contexto, pero no se presenta una diferencia como comparación del mismo periodo.',
    sources: 'Fuentes y procedencia', status: 'Estado actual de los datos'
  },
  fr: {
    lang: 'fr', path: 'fr', title: 'Méthodologie — World Discovery',
    description: 'Comment World Discovery sélectionne, valide, compare et publie des données mondiales officielles sans masquer les années d’observation ni la provenance.',
    eyebrow: 'Méthodologie', h1: 'Données officielles, années explicites, comparaisons reproductibles.',
    intro: 'World Discovery conserve la source, l’année d’observation, l’unité et la géographie avec les valeurs publiées. Lorsque des valeurs ne sont pas comparables, l’interface ne présente pas une différence numérique comme si elles l’étaient.',
    cards: [
      ['1. Source officielle', 'Les observations publiées proviennent de jeux de données officiels clairement identifiés. L’attribution de la source et l’identité de l’indicateur restent visibles sur les pages de données concernées.'],
      ['2. Année d’observation', 'L’année affichée avec une valeur est son année d’observation. Une observation manquante n’est pas remplacée silencieusement par une valeur d’une autre année.'],
      ['3. Contexte comparable', 'Les différences ne sont calculées que lorsque les indicateurs, entités, unités et périodes d’observation sont compatibles.'],
      ['4. Calculs déterministes', 'Les classements, différences et calculs de révision sont produits par du code à partir des valeurs numériques conservées, et non inventés ou estimés par un modèle de langage.'],
      ['5. Provenance', 'Les sorties lisibles par machine et par humain sont construites à partir des mêmes enregistrements sources lorsqu’un export de données correspondant est publié.'],
      ['6. Publication stable', 'Les pages de données maintenues utilisent des URL stables, des métadonnées canoniques et un contexte de source explicite afin d’identifier la surface publique actuelle.']
    ],
    read: 'Comment lire les données World Discovery',
    p1: 'La couverture peut varier selon l’indicateur, le pays ou territoire et l’année. Une couverture plus faible signifie que l’instantané vérifié contient moins d’observations utilisables pour cet indicateur et cette période ; aucune valeur d’une autre année n’est substituée.',
    p2: 'Les comparaisons de pays gardent chaque année d’observation visible. Si deux valeurs proviennent d’années différentes, elles peuvent être affichées pour le contexte, mais aucune différence n’est présentée comme une comparaison de la même période.',
    sources: 'Sources et provenance', status: 'État actuel des données'
  },
  'zh-Hans': {
    lang: 'zh-Hans', path: 'zh-hans', title: '方法 — World Discovery',
    description: 'World Discovery 如何选择、验证、比较和发布官方全球数据，并始终保留观测年份和数据来源。',
    eyebrow: '方法', h1: '官方数据、明确年份、可复现比较。',
    intro: 'World Discovery 会把数据来源、观测年份、单位和地理对象与发布的数值保持关联。如果两个数值不具备可比性，界面不会把数值差异呈现为可直接比较的结果。',
    cards: [
      ['1. 官方来源', '发布的指标观测值来自明确标识的官方数据集。相关数据页面会保留来源归属和指标身份。'],
      ['2. 观测年份', '数值旁显示的年份就是该数值的观测年份。缺失观测不会用其他年份的数值静默填补。'],
      ['3. 可比条件', '只有在指标、地理对象、单位和观测时期兼容时，才会计算差异。'],
      ['4. 确定性计算', '排名、差异和修订计算由代码基于保存的数值生成，而不是由语言模型编造或估算。'],
      ['5. 数据来源', '在发布相应数据导出时，机器可读和人类可读的输出使用同一组保留的来源记录构建。'],
      ['6. 稳定发布', '维护中的数据页面使用稳定 URL、规范链接和明确的来源上下文，便于用户和搜索系统识别当前公开页面。']
    ],
    read: '如何阅读 World Discovery 数据',
    p1: '数据覆盖率会因指标、国家或地区以及年份而不同。覆盖数量较低表示该指标和时期的已验证快照中可用观测更少，并不表示系统用其他年份的数值进行了替代。',
    p2: '国家比较会保留每个数值的观测年份。如果两个数值来自不同年份，可以同时显示作为背景信息，但不会把差值呈现为同一时期的比较。',
    sources: '来源与数据溯源', status: '当前数据状态'
  }
};

const esc = (v) => String(v).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

for (const copy of Object.values(COPY)) {
  const out = new URL(`${copy.path}/methodology/index.html`, siteRoot);
  await mkdir(new URL(`${copy.path}/methodology/`, siteRoot), { recursive: true });
  const cards = copy.cards.map(([title, body]) => `<article class="card"><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`).join('');
  const html = `<!doctype html><html lang="${copy.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(copy.title)}</title><meta name="description" content="${esc(copy.description)}"><link rel="canonical" href="${baseUrl}/${copy.path}/methodology/"><link rel="stylesheet" href="../../styles.css"></head><body><header class="topbar"><div class="wrap"><div class="brand">World Discovery</div></div></header><main><section class="hero hero-compact"><div class="wrap"><div class="eyebrow">${esc(copy.eyebrow)}</div><h1>${esc(copy.h1)}</h1><p>${esc(copy.intro)}</p></div></section><section class="section"><div class="wrap"><div class="grid">${cards}</div></div></section><section class="section section-soft"><div class="wrap"><h2>${esc(copy.read)}</h2><p>${esc(copy.p1)}</p><p>${esc(copy.p2)}</p><p><a href="../../sources/">${esc(copy.sources)} · ${copy.path === 'de' ? 'Auf Englisch öffnen' : copy.path === 'es' ? 'Abrir en inglés' : copy.path === 'fr' ? 'Ouvrir en anglais' : '用英语打开'}</a> · <a href="../../status/">${esc(copy.status)} · ${copy.path === 'de' ? 'Auf Englisch öffnen' : copy.path === 'es' ? 'Abrir en inglés' : copy.path === 'fr' ? 'Ouvrir en anglais' : '用英语打开'}</a></p></div></section></main><footer class="footer"><div class="wrap">World Discovery</div></footer></body></html>`;
  await writeFile(out, html, 'utf8');
}

console.log('Built localized methodology pages for de, es, fr and zh-Hans.');
