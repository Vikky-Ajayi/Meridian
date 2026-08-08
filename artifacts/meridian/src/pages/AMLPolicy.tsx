const sections = [
  ['Purpose', ['Prevent the use of Aldric Private for money laundering or terrorist financing.', 'Ensure full compliance with applicable laws, regulations, and industry best practices.', 'Protect our clients, our platform, and our reputation.']],
  ['Scope', ['All employees, contractors, and representatives of Aldric Private.', 'All clients using Aldric Private services, including high-net-worth individuals, family offices, and institutions.', 'All transactions, including cross-border fund transfers and related advisory services.']],
  ['Client Due Diligence (CDD)', ['Verification of identity using government-issued documents.', 'Assessment of source of funds and wealth to ensure legitimacy.', 'Screening against sanctions lists, politically exposed persons, and adverse media.', 'Risk-based categorization of clients to determine ongoing monitoring levels.']],
  ['Enhanced Due Diligence (EDD)', ['Detailed verification of beneficial ownership.', 'Scrutiny of transaction purpose, jurisdiction, and volume.', 'Additional documentation or assurances to verify legitimacy.']],
  ['Transaction Monitoring', ['Large or irregular fund transfers inconsistent with the client profile.', 'Transactions involving high-risk jurisdictions or entities.', 'Structuring or splitting transactions to avoid reporting thresholds.']],
  ['Reporting Obligations', ['Suspicious activity is reported to relevant authorities in accordance with local laws.', 'All regulatory obligations, including record-keeping and reporting thresholds, are strictly adhered to.']],
  ['Record-Keeping', ['Client identification and verification documents.', 'Transaction details.', 'Compliance checks and risk assessments.']],
  ['Employee Training', ['Identification of suspicious activity.', 'Procedures for client onboarding and enhanced due diligence.', 'Awareness of applicable AML laws and regulations.']],
  ['Roles And Responsibilities', ['Compliance Officer: Oversees implementation of the AML Policy, reporting, and ongoing monitoring.', 'Employees: Required to comply with the policy, report suspicious activity, and maintain confidentiality.', 'Management: Ensures adequate resources, training, and enforcement of AML standards.']],
  ['Review And Updates', ['This policy is reviewed periodically to ensure alignment with current laws, regulations, and best practices. Updates are communicated to all personnel and applied immediately to Aldric Private operations.']],
];

export default function AMLPolicy() {
  return (
    <div className="content-page policy-page">
      <section className="blue-panel">
        <h1>AML Policy</h1>
        <p>
          At Aldric Private we are committed to preventing money laundering, terrorist financing,
          and financial crime. Our AML Policy ensures compliance with international and local
          regulatory requirements, while providing secure, discreet, and high-quality service
          to our clients
        </p>
      </section>
      <main className="text-body">
        {sections.map(([title, items], index) => (
          <section className="policy-block" key={title as string}>
            <h2>{index + 1}. {title}</h2>
            <p>{index === 0 ? 'The purpose of this policy is to:' : index === 1 ? 'This policy applies to:' : 'Aldric Private maintains rigorous standards, including:'}</p>
            <ul>
              {(items as string[]).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        ))}
        <section className="policy-block">
          <h2>11. Contact And Reporting</h2>
          <p>
            Compliance Officer: Robert Tigi<br />
            Email: <span className="blue-link">roberttigi@yourmeidian.com</span><br />
            Phone: 07393908896
          </p>
        </section>
      </main>
    </div>
  );
}
