export default function About() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-[#0F61E9] text-white px-6 py-16 lg:px-20 lg:py-20">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/70 mb-4">About Us</p>
          <h1 className="text-[40px] lg:text-[52px] font-semibold leading-[1.1] tracking-[-0.04em] mb-6">
            The Meridian Difference
          </h1>
          <p className="text-base lg:text-[17px] text-white/80 font-medium leading-relaxed max-w-3xl">
            Meridian is a premier global financial advisory firm dedicated to helping high-net-worth individuals, family offices,
            politically exposed persons, distinguished clients, and leading organisations access tailored private banking solutions and
            navigate complex international financial requirements.
          </p>
        </div>
      </section>

      {/* Body paragraphs */}
      <section className="bg-white px-6 py-16 lg:px-20">
        <div className="max-w-4xl space-y-6 text-[#272626] text-[16px] leading-[1.65]">
          <p>
            We understand that managing significant wealth requires more than traditional financial services. It requires trusted advice,
            discretion, access to the right global institutions, and expert guidance through complex cross-border processes.
          </p>
          <p>
            Meridian provides bespoke advisory services to help clients identify suitable private banking opportunities, establish
            relationships with reputable financial institutions, and explore solutions for moving substantial capital internationally.
          </p>
          <p>
            Our team combines expertise in international finance, private banking standards, wealth management practices, and
            cross-border regulations to deliver a personalised advisory experience. Whether clients are seeking private banking
            introductions, wealth structuring guidance, or support with international capital movement, we provide strategic solutions
            tailored to their individual objectives.
          </p>
          <p>
            Every engagement is handled with the highest standards of confidentiality, professionalism, and compliance. At Meridian,
            we serve as a trusted advisory partner, connecting clients with global financial opportunities and helping them navigate
            complex financial decisions with confidence and discretion.
          </p>
        </div>
      </section>

      {/* Our Process */}
      <section className="bg-white px-6 pb-24 lg:px-20">
        <div className="max-w-4xl">
          <h2 className="text-[22px] font-semibold text-[#000B2D] mb-14">Our Process</h2>

          <div className="space-y-16">
            {/* Step 01 */}
            <div>
              <p className="text-[13px] font-semibold text-[#272626] mb-2">01</p>
              <h3 className="text-[36px] lg:text-[44px] font-semibold text-[#000B2D] leading-[1.1] tracking-[-0.04em] mb-4">
                Private Consultation
              </h3>
              <p className="text-[16px] text-[#272626] leading-relaxed mb-5 max-w-3xl">
                Every engagement begins with a discreet consultation with our advisory team. We take the time to understand your
                objectives, financial requirements, jurisdictional considerations, and preferred outcomes, ensuring our approach is
                aligned with your personal and financial goals.
              </p>
              <ul className="space-y-2">
                {[
                  'Understand your objectives and requirements',
                  'Assess relevant regulatory and jurisdictional considerations',
                  'Outline a preliminary advisory strategy',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-[15px] text-[#272626]">
                    <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#272626] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Step 02 */}
            <div>
              <p className="text-[13px] font-semibold text-[#272626] mb-2">02</p>
              <h3 className="text-[36px] lg:text-[44px] font-semibold text-[#000B2D] leading-[1.1] tracking-[-0.04em] mb-4">
                Tailored Strategy &amp; Advisory Plan
              </h3>
              <p className="text-[16px] text-[#272626] leading-relaxed mb-5 max-w-3xl">
                Following a detailed assessment, we develop a bespoke strategy designed around your specific circumstances. We provide
                guidance on suitable private banking opportunities, international financial pathways, timelines, and compliance
                considerations.
              </p>
              <ul className="space-y-2">
                {[
                  'Develop a customised advisory strategy',
                  'Identify suitable banking and financial solutions',
                  'Provide clear guidance on process, requirements, and next steps',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-[15px] text-[#272626]">
                    <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#272626] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Step 03 */}
            <div>
              <p className="text-[13px] font-semibold text-[#272626] mb-2">03</p>
              <h3 className="text-[36px] lg:text-[44px] font-semibold text-[#000B2D] leading-[1.1] tracking-[-0.04em] mb-4">
                Secure Execution &amp; Ongoing Support
              </h3>
              <p className="text-[16px] text-[#272626] leading-relaxed mb-5 max-w-3xl">
                Once the strategy is approved, Meridian coordinates the next steps through trusted professional networks and vetted
                financial partners. We provide ongoing support throughout the process, ensuring each engagement is handled with
                discretion, transparency, and attention to detail.
              </p>
              <ul className="space-y-2">
                {[
                  'Coordinate introductions and implementation steps',
                  'Monitor progress throughout the engagement',
                  'Provide confirmation and ongoing support with complete discretion',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-[15px] text-[#272626]">
                    <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#272626] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
