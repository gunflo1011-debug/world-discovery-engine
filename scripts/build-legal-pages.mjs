import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve, sep } from 'node:path';

const root = resolve(process.cwd(), 'site');
const baseUrl = 'https://worlddiscoverydata.com';
const ownerBlock = 'Florian Gundermann<br>Teichstraße 1a<br>76707 Hambrücken<br>Deutschland';
const emailLink = '<a href="mailto:gunflo1011@gmail.com">gunflo1011@gmail.com</a>';

const locales = {
  en: {
    path: '', lang: 'en', legal: 'Legal information', imprintLabel: 'Legal notice', privacyLabel: 'Privacy', updated: 'Last updated: 24 August 2026',
    imprintTitle: 'Legal notice — World Discovery', imprintDescription: 'Provider identification and legal notice for World Discovery.',
    imprintBody: `<div class="eyebrow">Legal information</div><h1>Legal notice</h1><h2>Provider information under § 5 DDG (Germany)</h2><p>${ownerBlock}</p><h2>Contact</h2><p>Email: ${emailLink}</p>`,
    privacyTitle: 'Privacy policy — World Discovery', privacyDescription: 'Privacy information for World Discovery.',
    privacyBody: `<div class="eyebrow">Legal information</div><h1>Privacy policy</h1><h2>1. Controller</h2><p>${ownerBlock}<br>Email: ${emailLink}</p><h2>2. Hosting and technical access data</h2><p>This website is provided through GitHub Pages. When the site is accessed, technically required connection and access data may be processed by the hosting infrastructure, in particular IP address, access time, requested resource, browser/device information and technical status data where required for delivery, security and troubleshooting.</p><p>Where this processing is within our responsibility, it is based on Art. 6(1)(f) GDPR. Our legitimate interest is the secure, stable and technically reliable operation of the website. Further information about GitHub processing is available in GitHub’s privacy information.</p><h2>3. Cookies, analytics and tracking</h2><p>World Discovery currently does not use its own advertising, analytics or tracking cookies and does not embed web analytics. If a consent-requiring service is introduced later, this policy will be updated before activation and consent will be obtained where legally required.</p><h2>4. External links and data sources</h2><p>The website links to external data sources and other websites. Their privacy terms apply when an external link is opened. Merely displaying a link on this site does not itself transfer additional personal data to the linked destination; a connection is established only when the external service is opened.</p><h2>5. Contact by email</h2><p>If you contact us by email, we process the information you provide in order to handle the request. Depending on the request, the legal basis is Art. 6(1)(b) GDPR or Art. 6(1)(f) GDPR.</p><h2>6. Your rights</h2><p>Subject to the GDPR, you have rights including access, rectification, erasure, restriction of processing, data portability and objection to certain processing. You also have the right to lodge a complaint with a competent data-protection supervisory authority.</p><h2>7. Changes to this policy</h2><p>This policy is updated when functions, hosting, analytics, advertising, embedded services or applicable law change.</p>`
  },
  de: {
    path: 'de', lang: 'de', legal: 'Rechtliche Informationen', imprintLabel: 'Impressum', privacyLabel: 'Datenschutz', updated: 'Stand: 24. August 2026',
    imprintTitle: 'Impressum — World Discovery', imprintDescription: 'Impressum und Anbieterkennzeichnung für World Discovery.',
    imprintBody: `<div class="eyebrow">Rechtliche Informationen</div><h1>Impressum</h1><h2>Angaben gemäß § 5 DDG</h2><p>${ownerBlock}</p><h2>Kontakt</h2><p>E-Mail: ${emailLink}</p>`,
    privacyTitle: 'Datenschutz — World Discovery', privacyDescription: 'Datenschutzerklärung für World Discovery.',
    privacyBody: `<div class="eyebrow">Rechtliche Informationen</div><h1>Datenschutzerklärung</h1><h2>1. Verantwortlicher</h2><p>${ownerBlock}<br>E-Mail: ${emailLink}</p><h2>2. Hosting und technische Zugriffsdaten</h2><p>Diese Website wird über GitHub Pages bereitgestellt. Beim Aufruf der Website werden technisch erforderliche Verbindungs- und Zugriffsdaten durch die beteiligte Hosting-Infrastruktur verarbeitet, insbesondere IP-Adresse, Zeitpunkt des Zugriffs, aufgerufene Ressource, Browser-/Geräteinformationen und technische Statusdaten, soweit diese für Auslieferung, Sicherheit und Fehleranalyse erforderlich sind.</p><p>Die Verarbeitung erfolgt, soweit sie in unserer Verantwortlichkeit liegt, auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt im sicheren, stabilen und technisch fehlerfreien Betrieb der Website. Weitere Informationen zur Datenverarbeitung durch GitHub finden sich in den Datenschutzinformationen von GitHub.</p><h2>3. Cookies, Analytics und Tracking</h2><p>World Discovery setzt nach aktuellem Stand keine eigenen Werbe-, Analyse- oder Tracking-Cookies ein und verwendet keine eingebundene Webanalyse. Sollte künftig ein zustimmungspflichtiger Dienst eingesetzt werden, wird diese Datenschutzerklärung vor dessen Aktivierung angepasst und – soweit rechtlich erforderlich – eine Einwilligung eingeholt.</p><h2>4. Externe Links und Datenquellen</h2><p>Die Website verlinkt auf externe Datenquellen und andere Websites. Beim Öffnen eines externen Links gelten die Datenschutzbestimmungen des jeweiligen Anbieters. Die bloße Darstellung eines Links überträgt auf dieser Website noch keine zusätzlichen personenbezogenen Daten an das verlinkte Ziel; eine Verbindung entsteht erst durch den Aufruf des externen Angebots.</p><h2>5. Kontaktaufnahme</h2><p>Wenn Sie uns per E-Mail kontaktieren, verarbeiten wir die von Ihnen übermittelten Angaben zur Bearbeitung der Anfrage. Rechtsgrundlage ist je nach Inhalt der Anfrage Art. 6 Abs. 1 lit. b DSGVO oder Art. 6 Abs. 1 lit. f DSGVO.</p><h2>6. Ihre Rechte</h2><p>Sie haben nach Maßgabe der DSGVO insbesondere Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie Widerspruch gegen bestimmte Verarbeitungen. Außerdem besteht das Recht, sich bei einer zuständigen Datenschutzaufsichtsbehörde zu beschweren.</p><h2>7. Änderungen dieser Datenschutzerklärung</h2><p>Diese Erklärung wird angepasst, wenn sich Funktionen, Hosting, Analytics, Werbung, eingebundene Dienste oder die Rechtslage ändern.</p>`
  },
  es: {
    path: 'es', lang: 'es', legal: 'Información legal', imprintLabel: 'Aviso legal', privacyLabel: 'Privacidad', updated: 'Actualizado: 24 de agosto de 2026',
    imprintTitle: 'Aviso legal — World Discovery', imprintDescription: 'Información del proveedor y aviso legal de World Discovery.',
    imprintBody: `<div class="eyebrow">Información legal</div><h1>Aviso legal</h1><h2>Información del proveedor conforme al § 5 DDG (Alemania)</h2><p>${ownerBlock}</p><h2>Contacto</h2><p>Correo electrónico: ${emailLink}</p>`,
    privacyTitle: 'Privacidad — World Discovery', privacyDescription: 'Política de privacidad de World Discovery.',
    privacyBody: `<div class="eyebrow">Información legal</div><h1>Política de privacidad</h1><h2>1. Responsable</h2><p>${ownerBlock}<br>Correo electrónico: ${emailLink}</p><h2>2. Alojamiento y datos técnicos de acceso</h2><p>Este sitio web se ofrece mediante GitHub Pages. Al acceder al sitio, la infraestructura de alojamiento puede procesar los datos de conexión y acceso técnicamente necesarios, en particular la dirección IP, la hora de acceso, el recurso solicitado, información del navegador/dispositivo y datos técnicos de estado cuando sean necesarios para la entrega, la seguridad y el análisis de errores.</p><p>Cuando este tratamiento esté bajo nuestra responsabilidad, se basa en el art. 6, ap. 1, letra f del RGPD. Nuestro interés legítimo es el funcionamiento seguro, estable y técnicamente fiable del sitio. La información adicional sobre el tratamiento realizado por GitHub se encuentra en su información de privacidad.</p><h2>3. Cookies, analítica y seguimiento</h2><p>Actualmente World Discovery no utiliza cookies propias de publicidad, analítica o seguimiento ni integra analítica web. Si en el futuro se incorpora un servicio que requiera consentimiento, esta política se actualizará antes de su activación y se solicitará consentimiento cuando sea legalmente necesario.</p><h2>4. Enlaces externos y fuentes de datos</h2><p>El sitio enlaza a fuentes de datos externas y otros sitios web. Al abrir un enlace externo se aplican las políticas de privacidad del proveedor correspondiente. La mera presentación de un enlace en este sitio no transmite por sí sola datos personales adicionales al destino enlazado; la conexión se establece únicamente al abrir el servicio externo.</p><h2>5. Contacto por correo electrónico</h2><p>Si se pone en contacto con nosotros por correo electrónico, tratamos la información que nos facilite para atender la solicitud. Según su contenido, la base jurídica es el art. 6, ap. 1, letra b o letra f del RGPD.</p><h2>6. Sus derechos</h2><p>Conforme al RGPD, dispone entre otros de derechos de acceso, rectificación, supresión, limitación del tratamiento, portabilidad de los datos y oposición a determinados tratamientos. También puede presentar una reclamación ante una autoridad de control de protección de datos competente.</p><h2>7. Cambios en esta política</h2><p>Esta política se actualizará cuando cambien las funciones, el alojamiento, la analítica, la publicidad, los servicios integrados o la normativa aplicable.</p>`
  },
  fr: {
    path: 'fr', lang: 'fr', legal: 'Informations juridiques', imprintLabel: 'Mentions légales', privacyLabel: 'Confidentialité', updated: 'Mise à jour : 24 août 2026',
    imprintTitle: 'Mentions légales — World Discovery', imprintDescription: 'Identification du fournisseur et mentions légales de World Discovery.',
    imprintBody: `<div class="eyebrow">Informations juridiques</div><h1>Mentions légales</h1><h2>Informations sur le fournisseur conformément au § 5 DDG (Allemagne)</h2><p>${ownerBlock}</p><h2>Contact</h2><p>E-mail : ${emailLink}</p>`,
    privacyTitle: 'Confidentialité — World Discovery', privacyDescription: 'Politique de confidentialité de World Discovery.',
    privacyBody: `<div class="eyebrow">Informations juridiques</div><h1>Politique de confidentialité</h1><h2>1. Responsable du traitement</h2><p>${ownerBlock}<br>E-mail : ${emailLink}</p><h2>2. Hébergement et données techniques d’accès</h2><p>Ce site est fourni via GitHub Pages. Lors de l’accès au site, l’infrastructure d’hébergement peut traiter les données de connexion et d’accès techniquement nécessaires, notamment l’adresse IP, l’heure d’accès, la ressource demandée, les informations relatives au navigateur/appareil et les données techniques d’état lorsque cela est nécessaire à la diffusion, à la sécurité et à l’analyse des erreurs.</p><p>Lorsque ce traitement relève de notre responsabilité, il repose sur l’art. 6, par. 1, point f du RGPD. Notre intérêt légitime est d’assurer un fonctionnement sûr, stable et techniquement fiable du site. Des informations complémentaires sur les traitements effectués par GitHub figurent dans les informations de confidentialité de GitHub.</p><h2>3. Cookies, analyse et suivi</h2><p>World Discovery n’utilise actuellement aucun cookie propre à des fins publicitaires, analytiques ou de suivi et n’intègre aucune solution d’analyse web. Si un service nécessitant un consentement est ajouté ultérieurement, cette politique sera mise à jour avant son activation et le consentement sera recueilli lorsque la loi l’exige.</p><h2>4. Liens externes et sources de données</h2><p>Le site contient des liens vers des sources de données externes et d’autres sites web. Les règles de confidentialité du fournisseur concerné s’appliquent lorsqu’un lien externe est ouvert. Le simple affichage d’un lien sur ce site ne transmet pas en lui-même de données personnelles supplémentaires à la destination liée ; une connexion n’est établie que lorsque le service externe est ouvert.</p><h2>5. Contact par e-mail</h2><p>Si vous nous contactez par e-mail, nous traitons les informations fournies afin de répondre à votre demande. Selon son contenu, la base juridique est l’art. 6, par. 1, point b ou f du RGPD.</p><h2>6. Vos droits</h2><p>Dans les conditions prévues par le RGPD, vous disposez notamment de droits d’accès, de rectification, d’effacement, de limitation du traitement, de portabilité des données et d’opposition à certains traitements. Vous avez également le droit d’introduire une réclamation auprès d’une autorité de contrôle compétente en matière de protection des données.</p><h2>7. Modifications de cette politique</h2><p>Cette politique est mise à jour lorsque les fonctionnalités, l’hébergement, l’analyse, la publicité, les services intégrés ou le droit applicable évoluent.</p>`
  },
  'zh-hans': {
    path: 'zh-hans', lang: 'zh-Hans', legal: '法律信息', imprintLabel: '法律声明', privacyLabel: '隐私', updated: '更新日期：2026年8月24日',
    imprintTitle: '法律声明 — World Discovery', imprintDescription: 'World Discovery 的提供者信息与法律声明。',
    imprintBody: `<div class="eyebrow">法律信息</div><h1>法律声明</h1><h2>依据德国《数字服务法》(DDG) 第5条的提供者信息</h2><p>${ownerBlock}</p><h2>联系方式</h2><p>电子邮箱：${emailLink}</p>`,
    privacyTitle: '隐私政策 — World Discovery', privacyDescription: 'World Discovery 隐私政策。',
    privacyBody: `<div class="eyebrow">法律信息</div><h1>隐私政策</h1><h2>1. 数据处理责任方</h2><p>${ownerBlock}<br>电子邮箱：${emailLink}</p><h2>2. 托管与技术访问数据</h2><p>本网站通过 GitHub Pages 提供。访问网站时，托管基础设施可能会处理提供网站所必需的连接与访问数据，尤其包括 IP 地址、访问时间、请求的资源、浏览器/设备信息以及为网站交付、安全和错误分析所需的技术状态数据。</p><p>在相关处理属于我们责任范围的情况下，法律依据为《通用数据保护条例》(GDPR) 第6条第1款(f)项。我们的合法利益在于确保网站安全、稳定并在技术上可靠运行。有关 GitHub 数据处理的更多信息，请参阅 GitHub 的隐私说明。</p><h2>3. Cookie、分析与跟踪</h2><p>World Discovery 目前不使用自有的广告、分析或跟踪 Cookie，也未嵌入网站分析服务。如果未来启用需要同意的服务，我们将在启用前更新本政策，并在法律要求的情况下取得同意。</p><h2>4. 外部链接与数据来源</h2><p>本网站会链接到外部数据来源和其他网站。打开外部链接后，适用相应提供者的隐私政策。仅在本网站显示链接本身不会向链接目标额外传输个人数据；只有在打开外部服务时才会建立连接。</p><h2>5. 通过电子邮件联系我们</h2><p>如果您通过电子邮件联系我们，我们会处理您提供的信息以处理相关请求。根据请求内容，法律依据为 GDPR 第6条第1款(b)项或(f)项。</p><h2>6. 您的权利</h2><p>根据 GDPR，您依法享有访问、更正、删除、限制处理、数据可携带以及反对特定处理等权利。您也有权向有管辖权的数据保护监管机构投诉。</p><h2>7. 本政策的变更</h2><p>当网站功能、托管、分析、广告、集成服务或适用法律发生变化时，本政策将相应更新。</p>`
  }
};

function canonicalFor(cfg, slug) {
  return `${baseUrl}/${cfg.path ? `${cfg.path}/` : ''}${slug}/`;
}

function page({ cfg, title, description, canonical, body }) {
  const home = cfg.path ? `/${cfg.path}/` : '/';
  return `<!doctype html><html lang="${cfg.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="${description}"><link rel="canonical" href="${canonical}"><link rel="stylesheet" href="/styles.css"></head><body><header class="topbar"><div class="wrap"><div class="brand"><a href="${home}">World Discovery</a></div></div></header><main><section class="section"><div class="wrap">${body}<p class="muted">${cfg.updated}</p></div></section></main><footer class="footer"><div class="wrap">World Discovery · ${cfg.legal}</div></footer></body></html>`;
}

async function writePage(path, content) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, 'utf8');
}

function hrefFrom(file, targetDir) {
  const from = dirname(file);
  const target = resolve(root, targetDir, 'index.html');
  let href = relative(from, target).split(sep).join('/');
  if (!href.startsWith('.')) href = `./${href}`;
  return href;
}

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(path));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}

async function injectLegalFooter() {
  for (const file of await htmlFiles(root)) {
    let html = await readFile(file, 'utf8');
    const relativeFile = relative(root, file).split(sep).join('/');
    const locale = relativeFile.split('/')[0];
    const cfg = locales[locale] ?? locales.en;
    const localizedRoot = cfg.path || '';
    const imprintHref = hrefFrom(file, localizedRoot ? `${localizedRoot}/impressum` : 'impressum');
    const privacyHref = hrefFrom(file, localizedRoot ? `${localizedRoot}/datenschutz` : 'datenschutz');
    const legal = ` · <a href="${imprintHref}">${cfg.imprintLabel}</a> · <a href="${privacyHref}">${cfg.privacyLabel}</a>`;
    if (html.includes(`>${cfg.imprintLabel}</a>`) && html.includes(`>${cfg.privacyLabel}</a>`)) continue;
    if (/<footer\b[^>]*>[\s\S]*?<\/footer>/i.test(html)) {
      html = html.replace(/(<footer\b[^>]*>[\s\S]*?)(<\/footer>)/i, `$1${legal}$2`);
    } else {
      html = html.replace(/<\/body>/i, `<footer class="footer"><div class="wrap">World Discovery${legal}</div></footer></body>`);
    }
    await writeFile(file, html, 'utf8');
  }
}

async function ensureSitemap() {
  const path = resolve(root, 'sitemap.xml');
  let xml = await readFile(path, 'utf8');
  for (const cfg of Object.values(locales)) {
    for (const slug of ['impressum', 'datenschutz']) {
      const url = canonicalFor(cfg, slug);
      if (xml.includes(`<loc>${url}</loc>`)) continue;
      xml = xml.replace(/<\/urlset>\s*$/i, `  <url><loc>${url}</loc></url>\n</urlset>\n`);
    }
  }
  await writeFile(path, xml, 'utf8');
}

for (const cfg of Object.values(locales)) {
  const localeRoot = cfg.path ? resolve(root, cfg.path) : root;
  await writePage(resolve(localeRoot, 'impressum', 'index.html'), page({ cfg, title: cfg.imprintTitle, description: cfg.imprintDescription, canonical: canonicalFor(cfg, 'impressum'), body: cfg.imprintBody }));
  await writePage(resolve(localeRoot, 'datenschutz', 'index.html'), page({ cfg, title: cfg.privacyTitle, description: cfg.privacyDescription, canonical: canonicalFor(cfg, 'datenschutz'), body: cfg.privacyBody }));
}
await injectLegalFooter();
await ensureSitemap();
console.log('Built localized legal pages and injected locale-aware legal links across HTML pages.');
