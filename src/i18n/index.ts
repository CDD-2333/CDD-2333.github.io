/**
 * Client-side UI translation module.
 *
 * Only translates interface copy marked with `data-i18n="key"` attributes.
 * Blog post content & other auto-generated page titles are left untouched.
 */

export type Lang = 'zh' | 'en' | 'es'

export const LANGS: { code: Lang; label: string }[] = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' }
]

type Dict = Record<string, string>

export const translations: Record<Lang, Dict> = {
  en: {
    // Header
    'nav.blog': 'Blog',
    'nav.about': 'About',
    'nav.search': 'Search',
    // Home
    'home.location': 'Beijing, China',
    'home.source': 'Source code',
    'home.section.undergrad': 'CS Undergraduate',
    'home.more.about': 'More about me',
    'home.section.posts': 'Posts',
    'home.more.posts': 'More posts',
    'home.section.education': 'Education',
    'home.section.skills': 'Skills',
    'home.skills.tech': 'Tech Stack',
    'home.quote': 'Be the change you wish to see in the world.',
    // Skills
    'skill.familiar': 'Familiar',
    'skill.exploring': 'Exploring',
    'skill.beginner': 'Beginner',
    // Counter
    'counter.pageViews': 'Views:',
    'counter.siteViews': 'Site Views:',
    'counter.siteUV': 'Visitors:',
    'counter.comments': 'comments',
    // Footer
    'footer.policy': 'Site Policy',
    'footer.powered': 'theme powered',
    // About
    'about.title': 'About',
    'about.contact': 'Contact Information',
    'about.education': 'Education',
    'about.tech': 'Tech Stack',
    'about.research': 'Research Interest',
    'about.blog': 'About Blog',
    'about.intro1': 'Coderdiao, B.S. Candidate',
    'about.intro2': 'Yuanpei College, Peking University',
    'about.motto': 'Motto: Stay hungry, Stay foolish.',
    'about.contact.name': 'Name:',
    'about.contact.nameVal': 'Coderdiao, B.S. Candidate',
    'about.contact.institution': 'Institution:',
    'about.contact.institutionVal': 'Yuanpei College, Peking University',
    'about.contact.address': 'Address:',
    'about.contact.addressVal': 'No.5 Yiheyuan Rd., Haidian District, Beijing, China',
    'about.contact.email': 'Email:',
    'about.contact.postal': 'Postal Code:',
    'about.research.line': 'Exploring...',
    'about.research.papersLabel': 'Research Papers:',
    'about.research.papersVal': 'To be filled...',
    'about.blog.history': 'Website history:',
    'about.blog.thanks':
      'The smooth operation and personalized customization of website also rely on the resources and technical support provided by the following excellent projects/service providers:'
  },
  zh: {
    // Header
    'nav.blog': '博客',
    'nav.about': '关于',
    'nav.search': '搜索',
    // Home
    'home.location': '中国·北京',
    'home.source': '源代码',
    'home.section.undergrad': '计算机科学本科',
    'home.more.about': '了解更多',
    'home.section.posts': '文章',
    'home.more.posts': '更多文章',
    'home.section.education': '教育经历',
    'home.section.skills': '技能',
    'home.skills.tech': '技术栈',
    'home.quote': '成为你希望在这世界上看到的改变。',
    // Skills
    'skill.familiar': '熟练',
    'skill.exploring': '学习中',
    'skill.beginner': '入门',
    // Counter
    'counter.pageViews': '浏览量：',
    'counter.siteViews': '站点访问量：',
    'counter.siteUV': '访客数：',
    'counter.comments': '条评论',
    // Footer
    'footer.policy': '网站条款',
    'footer.powered': '主题驱动',
    // About
    'about.title': '关于',
    'about.contact': '联系方式',
    'about.education': '教育经历',
    'about.tech': '技术栈',
    'about.research': '研究方向',
    'about.blog': '关于博客',
    'about.intro1': 'Coderdiao，理学学士在读',
    'about.intro2': '北京大学元培学院',
    'about.motto': '座右铭：Stay hungry, Stay foolish.',
    'about.contact.name': '姓名：',
    'about.contact.nameVal': 'Coderdiao，理学学士在读',
    'about.contact.institution': '学校：',
    'about.contact.institutionVal': '北京大学元培学院',
    'about.contact.address': '地址：',
    'about.contact.addressVal': '北京市海淀区颐和园路5号',
    'about.contact.email': '邮箱：',
    'about.contact.postal': '邮政编码：',
    'about.research.line': '探索中……',
    'about.research.papersLabel': '研究论文：',
    'about.research.papersVal': '待补充……',
    'about.blog.history': '网站历史：',
    'about.blog.thanks':
      '网站的稳定运行与个性化定制，同样离不开以下优秀项目与服务商提供的资源与技术支撑：'
  },
  es: {
    // Header
    'nav.blog': 'Blog',
    'nav.about': 'Acerca de',
    'nav.search': 'Buscar',
    // Home
    'home.location': 'Pekín, China',
    'home.source': 'Código fuente',
    'home.section.undergrad': 'Grado en Informática',
    'home.more.about': 'Más sobre mí',
    'home.section.posts': 'Artículos',
    'home.more.posts': 'Más artículos',
    'home.section.education': 'Educación',
    'home.section.skills': 'Habilidades',
    'home.skills.tech': 'Tecnologías',
    'home.quote': 'Sé el cambio que deseas ver en el mundo.',
    // Skills
    'skill.familiar': 'Familiar',
    'skill.exploring': 'Explorando',
    'skill.beginner': 'Principiante',
    // Counter
    'counter.pageViews': 'Vistas:',
    'counter.siteViews': 'Visitas del sitio:',
    'counter.siteUV': 'Visitantes:',
    'counter.comments': 'comentarios',
    // Footer
    'footer.policy': 'Política del sitio',
    'footer.powered': 'tema impulsado',
    // About
    'about.title': 'Acerca de',
    'about.contact': 'Información de contacto',
    'about.education': 'Educación',
    'about.tech': 'Tecnologías',
    'about.research': 'Interés de investigación',
    'about.blog': 'Sobre el blog',
    'about.intro1': 'Coderdiao, candidato a licenciatura',
    'about.intro2': 'Colegio Yuanpei, Universidad de Pekín',
    'about.motto': 'Lema: Mantente hambriento, mantente humilde.',
    'about.contact.name': 'Nombre:',
    'about.contact.nameVal': 'Coderdiao, candidato a licenciatura',
    'about.contact.institution': 'Institución:',
    'about.contact.institutionVal': 'Colegio Yuanpei, Universidad de Pekín',
    'about.contact.address': 'Dirección:',
    'about.contact.addressVal': 'Calle Yiheyuan n.º 5, distrito de Haidian, Pekín, China',
    'about.contact.email': 'Correo electrónico:',
    'about.contact.postal': 'Código postal:',
    'about.research.line': 'Explorando...',
    'about.research.papersLabel': 'Artículos de investigación:',
    'about.research.papersVal': 'Por completar...',
    'about.blog.history': 'Historia del sitio:',
    'about.blog.thanks':
      'El buen funcionamiento y la personalización del sitio también dependen de los recursos y el soporte técnico de los siguientes excelentes proyectos y proveedores:'
  }
}

/** TOC (table of contents) sidebar items are rendered by the theme component, so they can't carry `data-i18n`.
 *  They are matched back to the article headings by slug instead. */
const tocKeyBySlug: Record<string, string> = {
  'contact-information': 'about.contact',
  'education': 'about.education',
  'tech-stack': 'about.tech',
  'research-interest': 'about.research',
  'about-blog': 'about.blog'
}

export function getLang(): Lang {
  const saved = localStorage.getItem('lang')
  return saved === 'zh' || saved === 'en' || saved === 'es' ? saved : 'en'
}

export function applyTranslations(lang: Lang = getLang()): void {
  const dict = translations[lang]
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang

  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n')
    if (key && dict[key]) el.textContent = dict[key]
  })

  // Translate the sidebar TOC items by their heading slug
  document.querySelectorAll<HTMLAnchorElement>('toc-heading a[href^="#"]').forEach((link) => {
    const slug = link.getAttribute('href')?.substring(1)
    const key = slug && tocKeyBySlug[slug]
    if (key && dict[key]) link.textContent = dict[key]
  })

  document.dispatchEvent(new CustomEvent('i18n-change', { detail: { lang } }))
}
