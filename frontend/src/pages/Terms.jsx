import React from "react";
import { Link } from "react-router-dom";
import "./terms.css";

const Terms = () => {
  return (
    <div className="terms-page">
      <div className="terms-container">
        <div className="terms-content">
          <div className="terms-header">
            <h1>Terms and Conditions</h1>
            <p>Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="terms-body">
            <section>
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using the NL2SQL service, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2>2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of NL2SQL for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>
            </section>

            <section>
              <h2>3. Disclaimer</h2>
              <p>
                The materials on NL2SQL are provided on an 'as is' basis. NL2SQL makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2>4. Limitations</h2>
              <p>
                In no event shall NL2SQL or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on NL2SQL.
              </p>
            </section>

            <section>
              <h2>5. Accuracy of materials</h2>
              <p>
                The materials appearing on NL2SQL could include technical, typographical, or photographic errors. NL2SQL does not warrant that any of the materials on its website are accurate, complete or current.
              </p>
            </section>

            <section>
              <h2>6. Links</h2>
              <p>
                NL2SQL has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by NL2SQL of the site.
              </p>
            </section>

            <section>
              <h2>7. Modifications</h2>
              <p>
                NL2SQL may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2>8. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
              </p>
            </section>
          </div>

          <div className="terms-footer">
            <Link to="/" className="back-link">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
