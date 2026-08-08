const intro = [
  'We understand that managing significant wealth requires more than traditional financial services. It requires trusted advice, discretion, access to the right global institutions, and expert guidance through complex cross-border processes.',
  'Aldric Private provides bespoke advisory services to help clients identify suitable private banking opportunities, establish relationships with reputable financial institutions, and explore solutions for moving substantial capital internationally.',
  'Our team combines expertise in international finance, private banking standards, wealth management practices, and cross-border regulations to deliver a personalised advisory experience. Whether clients are seeking private banking introductions, wealth structuring guidance, or support with international capital movement, we provide strategic solutions tailored to their individual objectives.',
  'Every engagement is handled with the highest standards of confidentiality, professionalism, and compliance. At Aldric Private, we serve as a trusted advisory partner, connecting clients with global financial opportunities and helping them navigate complex financial decisions with confidence and discretion.',
];

const process = [
  ['01', 'Private Consultation', 'Every engagement begins with a discreet consultation with our advisory team. We take the time to understand your objectives, financial requirements, jurisdictional considerations, and preferred outcomes, ensuring our approach is aligned with your personal and financial goals.', ['Understand your objectives and requirements', 'Assess relevant regulatory and jurisdictional considerations', 'Outline a preliminary advisory strategy']],
  ['02', 'Tailored Strategy & Advisory Plan', 'Following a detailed assessment, we develop a bespoke strategy designed around your specific circumstances. We provide guidance on suitable private banking opportunities, international financial pathways, timelines, and compliance considerations.', ['Develop a customised advisory strategy', 'Identify suitable banking and financial solutions', 'Provide clear guidance on process, requirements, and next steps']],
  ['03', 'Secure Execution & Ongoing Support', 'Once the strategy is approved, Aldric Private coordinates the next steps through trusted professional networks and vetted financial partners. We provide ongoing support throughout the process, ensuring each engagement is handled with discretion, transparency, and attention to detail.', ['Coordinate introductions and implementation steps', 'Monitor progress throughout the engagement', 'Provide confirmation and ongoing support with complete discretion']],
];

export default function About() {
  return (
    <div className="content-page">
      <section className="blue-panel">
        <div className="eyebrow">About Us</div>
        <h1>The Aldric Private Difference</h1>
        <p>
          Aldric Private is a premier global financial advisory firm dedicated to helping
          high-net-worth individuals, family offices, politically exposed persons,
          distinguished clients, and leading organisations access tailored private banking
          solutions and navigate complex international financial requirements.
        </p>
      </section>
      <main className="text-body">
        {intro.map((copy) => <p key={copy}>{copy}</p>)}
        <h2>Our Process</h2>
        {process.map(([num, title, copy, items]) => (
          <section className="process-block" key={num as string}>
            <div className="process-num">{num}</div>
            <h3>{title}</h3>
            <p>{copy}</p>
            <ul>
              {(items as string[]).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}
