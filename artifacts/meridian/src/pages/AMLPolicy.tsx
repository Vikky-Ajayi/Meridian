function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[20px] font-bold text-[#000B2D] mb-3">{num}. {title}</h2>
      {children}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 mt-3">
      {items.map(item => (
        <li key={item} className="flex items-start gap-2 text-[15px] text-[#272626]">
          <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#272626] flex-shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function AMLPolicy() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-[#0F61E9] text-white px-6 py-16 lg:px-20 lg:py-20">
        <div className="max-w-4xl">
          <h1 className="text-[40px] lg:text-[52px] font-semibold leading-[1.1] tracking-[-0.04em] mb-5">AML Policy</h1>
          <p className="text-base lg:text-[17px] text-white/80 font-medium leading-relaxed max-w-3xl">
            At Meridian we are committed to preventing money laundering, terrorist financing, and financial crime. Our AML Policy ensures
            compliance with international and local regulatory requirements, while providing secure, discreet, and high-quality service
            to our clients.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white px-6 py-16 lg:px-20">
        <div className="max-w-4xl space-y-10 text-[#272626] text-[15px] leading-relaxed">

          <Section num="1" title="Purpose">
            <p>The purpose of this policy is to:</p>
            <Bullets items={[
              'Prevent the use of Meridian for money laundering or terrorist financing.',
              'Ensure full compliance with applicable laws, regulations, and industry best practices.',
              'Protect our clients, our platform, and our reputation.',
            ]} />
          </Section>

          <Section num="2" title="Scope">
            <p>This policy applies to:</p>
            <Bullets items={[
              'All employees, contractors, and representatives of Meridian.',
              'All clients using Meridian services, including high-net-worth individuals, family offices, and institutions.',
              'All transactions, including cross-border fund transfers and related advisory services.',
            ]} />
          </Section>

          <Section num="3" title="Client Due Diligence (CDD)">
            <p>Meridian performs rigorous due diligence on all clients, including:</p>
            <Bullets items={[
              'Verification of identity using government-issued documents (passport, ID, proof of address).',
              'Assessment of source of funds and wealth to ensure legitimacy.',
              'Screening against sanctions lists, politically exposed persons (PEPs), and adverse media.',
              'Risk-based categorisation of clients to determine ongoing monitoring levels.',
            ]} />
          </Section>

          <Section num="4" title="Enhanced Due Diligence (EDD)">
            <p>For high-risk clients or transactions, Meridian applies enhanced due diligence, including:</p>
            <Bullets items={[
              'Detailed verification of beneficial ownership.',
              'Scrutiny of transaction purpose, jurisdictions, and volume.',
              'Additional documentation or assurances to verify legitimacy.',
            ]} />
          </Section>

          <Section num="5" title="Transaction Monitoring">
            <p>All transactions are monitored for unusual or suspicious activity, including:</p>
            <Bullets items={[
              'Large or irregular fund transfers inconsistent with the client\'s profile.',
              'Transactions involving high-risk jurisdictions or entities.',
              'Structuring or splitting transactions to avoid reporting thresholds.',
            ]} />
            <p className="mt-3">Suspicious transactions are escalated immediately to our Compliance Officer.</p>
          </Section>

          <Section num="6" title="Reporting Obligations">
            <p>Meridian is committed to regulatory reporting:</p>
            <Bullets items={[
              'Suspicious activity is reported to relevant authorities in accordance with local laws.',
              'All regulatory obligations, including record-keeping and reporting thresholds, are strictly adhered to.',
            ]} />
          </Section>

          <Section num="7" title="Record-Keeping">
            <p>Meridian maintains secure records of:</p>
            <Bullets items={[
              'Client identification and verification documents.',
              'Transaction details.',
              'Compliance checks and risk assessments.',
            ]} />
            <p className="mt-3">Records are retained in accordance with all regulatory requirements and internal policies.</p>
          </Section>

          <Section num="8" title="Employee Training">
            <p>All Meridian personnel undergo mandatory AML training, including:</p>
            <Bullets items={[
              'Identification of suspicious activity.',
              'Procedures for client onboarding and enhanced due diligence.',
              'Awareness of applicable AML laws and regulations.',
            ]} />
          </Section>

          <Section num="9" title="Roles And Responsibilities">
            <Bullets items={[
              'Compliance Officer: Oversees implementation of the AML Policy, reporting, and ongoing monitoring.',
              'Employees: Required to comply with the policy, report suspicious activity, and maintain confidentiality.',
              'Management: Ensures adequate resources, training, and enforcement of AML standards.',
            ]} />
          </Section>

          <Section num="10" title="Review And Updates">
            <p>
              This policy is reviewed periodically to ensure alignment with current laws, regulations, and best practices. Updates are
              communicated to all personnel and applied immediately to Meridian operations.
            </p>
          </Section>

          <Section num="11" title="Contact And Reporting">
            <p className="font-medium text-[#000B2D]">Compliance Officer: Robert Tiji</p>
            <p>
              <a href="mailto:robert@yourmeridian.com" className="text-[#0F61E9] hover:underline">robert@yourmeridian.com</a>
            </p>
            <p>Phone: 07908909896</p>
          </Section>

        </div>
      </section>
    </div>
  );
}
