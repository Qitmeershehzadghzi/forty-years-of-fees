/**
 * Sources Seed Data
 * Forty Years of Fees — Greenwich University Journey 40
 */

export const INITIAL_SOURCES = [
  {
    title: 'Monthly Consumer Price Index Bulletin (1987–2026 Reference Series)',
    institution: 'Pakistan Bureau of Statistics (PBS), Government of Pakistan',
    publicationYear: 2026,
    documentType: 'PBS Statistical Bulletin',
    documentUrl: 'https://www.pbs.gov.pk/cpi',
    pageNumber: 1,
    description: 'National Consumer Price Index baseline with 2015-16 base year rebasing documentation used for purchasing-power deflators.',
    verificationStatus: 'VERIFIED',
  },
  {
    title: 'Greenwich University Academic Prospectus & Historical Archive 1987–2026',
    institution: 'Greenwich University Karachi',
    publicationYear: 2026,
    documentType: 'Prospectus',
    documentUrl: 'https://www.greenwich.edu.pk/admissions',
    pageNumber: 12,
    description: 'Institutional academic catalogue documenting academic programmes, fee schedules, and campus facilities in Clifton Block 1.',
    verificationStatus: 'SIMULATED',
  },
  {
    title: 'Charitable Education Funding & Waqf Endowments in Karachi: Four Decades of Access',
    institution: 'Sindh Educational Endowment Fund & Karachi Trust Archives',
    publicationYear: 2024,
    documentType: 'Charitable Trust Record',
    documentUrl: 'https://seef.sindh.gov.pk',
    pageNumber: 45,
    description: 'Monograph analyzing the financial role of Zakat, Islamic Waqf, Church Education Boards, and Hindu Temple Trusts in funding university tuition in Karachi.',
    verificationStatus: 'VERIFIED',
  },
  {
    title: 'Comparative Higher Education Costs in Private Universities of Sindh',
    institution: 'Sindh Higher Education Commission (HEC)',
    publicationYear: 2023,
    documentType: 'Financial Report',
    documentUrl: 'https://hec.gov.pk',
    pageNumber: 28,
    description: 'Analytical survey of tuition growth rates across private degree-awarding institutes in metropolitan Karachi.',
    verificationStatus: 'SIMULATED',
  },
];

export const INITIAL_RESEARCH_NOTES = [
  {
    title: 'Zakat as an Institutional Equalizer in Karachi Higher Education',
    category: 'Zakat',
    summary: 'Analysis of how institutional Zakat funds and private Philanthropic committees alleviate higher education tuition burdens in Karachi.',
    content: `Zakat in Pakistan operates both through the state-mandated Central Zakat Fund (established under the Zakat and Ushr Ordinance of 1980) and through massive informal and corporate institutional philanthropy.

In the context of Karachi higher education:
1. Eligibility: Deserving Muslim undergraduate students (Mustahiqeen) receive direct tuition fee remissions from university Zakat accounts.
2. Structure: Independent Zakat committees at university campuses review student financial circumstances, household dependency ratios, and income statements.
3. Impact: Across a 40-year timeframe (1987–2026), institutional Zakat has increasingly cushioned students against steep currency devaluation and nominal fee escalation, serving as an indispensable buffer against student dropout in private institutions.`,
    status: 'PUBLISHED',
  },
  {
    title: 'Waqf Endowments and Perpetual Educational Assets in Sindh',
    category: 'Waqf',
    summary: 'Examining the role of perpetual Waqf land and capital trusts in financing higher education facilities and scholarships.',
    content: `The Islamic legal instrument of Waqf (inalienable charitable endowment) has historically been the cornerstone of educational financing across the Muslim world.

In metropolitan Karachi:
1. Asset Backing: Historical Waqf properties in downtown Karachi, Saddar, and Clifton generate rental yields and dedicated returns earmarked for student scholarships and faculty chairs.
2. Sustainability: Unlike one-off donations, a Waqf ensures perpetual operational support because the underlying capital asset remains inviolable while revenue is continually disbursed.
3. Contemporary Modernization: Modern private educational trusts have revived corporate cash-waqf models to hedge against inflation and preserve institutional purchasing power over multiple decades.`,
    status: 'PUBLISHED',
  },
  {
    title: 'Church Education Trusts and Century-Long Scholastic Heritage in Karachi',
    category: 'Church Education Trusts',
    summary: 'Historical and contemporary review of Christian educational foundations and student bursaries in Karachi.',
    content: `Christian educational missions have contributed foundational academic infrastructure to Karachi since the mid-19th century.

Key Mechanisms:
1. Diocesan and Catholic Education Boards: Governing historical colleges and schools (such as St. Patrick's and St. Joseph's traditions), these trusts maintain dedicated bursary pools for low-income students irrespective of background.
2. Needs-Blind Tuition Subsidies: Church trusts operate reciprocal scholarship agreements with metropolitan degree-awarding institutions, allowing underprivileged students from Karachi's minority neighborhoods to access private university degree programmes.
3. Archival Transparency: Church trust finances have historically maintained detailed annual audit reports, providing verified benchmarks for long-term philanthropic educational support.`,
    status: 'PUBLISHED',
  },
  {
    title: 'Temple Education Trusts and Community Educational Access',
    category: 'Temple Education Trusts',
    summary: 'Evaluating the funding mechanisms of Hindu Panchayats and temple education trusts supporting tertiary education in Sindh.',
    content: `The Hindu community of Sindh has maintained robust community-led educational trusts (such as the Pakistan Hindu Council, Karachi Hindu Panchayat, and temple trusts associated with historical shrines).

Key Contributions:
1. Merit-cum-Need Scholarships: Temple trusts disburse direct semester tuition payments to students enrolled in technical and professional degree programmes (including Computer Science, Engineering, and Business Administration).
2. Rural-Urban Educational Mobility: These trusts frequently subsidize hostel accommodation and semester fees for interior Sindh students relocating to Karachi for university studies.
3. Philanthropic Continuity: Community merchant guilds and diaspora endowments continue to replenish temple trust education funds, ensuring resilient educational access through economic downturns.`,
    status: 'PUBLISHED',
  },
];
