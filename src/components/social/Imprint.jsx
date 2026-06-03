// Imprint.jsx
import React from "react";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUserTie,
  FaBalanceScale,
} from "react-icons/fa";

const Imprint = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <FaBuilding className="text-gray-700 text-2xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Imprint / Impressum
          </h1>
          <p className="text-gray-600">
            Legal Information / Rechtliche Informationen
          </p>
        </div>

        {/* Company Information Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaBuilding className="text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Company Information
            </h2>
          </div>

          <div className="space-y-6 text-gray-700">
            <div>
              <p className="font-medium mb-2">
                Responsible for the content of the service / Verantwortlich für
                den Inhalt des Service ist:
              </p>
              <p className="text-lg font-bold text-gray-800">
                Spark Networks GmbH
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <FaMapMarkerAlt className="text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">Business address:</p>
                    <p>Correspondence address
225 B, Woodgrange Drive, Southend-On-Sea, Essex, England, SS1 2SG</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <FaMapMarkerAlt className="text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">Registered seat / Sitz:</p>
                    <p>Munich / München</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaBalanceScale className="text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">Registered at:</p>
                    <p>
                      Munich District Court – Register Court / Amtsgericht
                      München - Registergericht
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <p className="font-medium">
                    Corporate registration nr. / Handelsregisternummer:
                  </p>
                  <p className="font-bold">HRB 293266</p>
                </div>

                <div className="mb-4">
                  <p className="font-medium">VAT ID / USt ID:</p>
                  <p className="font-bold">DE316294650</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Managing Directors Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FaUserTie className="text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Managing directors / Geschäftsführer
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium text-gray-800">Adam Medros</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium text-gray-800">Dane Joella</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium text-gray-800">Tobias Plaputta</p>
            </div>
          </div>
        </div>

        {/* Page 2 Content - S */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-3 rounded-lg">
              <FaPhone className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              Contact Information
            </h2>
          </div>

          <div className="space-y-6 text-gray-700">
            <div className="flex items-start gap-3">
              <FaPhone className="text-gray-500 mt-1" />
              <div>
                <p className="font-medium">Phone:</p>
                <p className="font-bold">+49 89 208 043 957</p>
                <p className="text-sm text-gray-500 mt-1">
                  (voicemail only, no phone support / Anrufbeantworter, kein
                  telefonischer Support)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaEnvelope className="text-gray-500 mt-1" />
              <div>
                <p className="font-medium">Email:</p>
                <p className="font-bold">https://support.intentionalconnections.app</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-bold text-gray-800 mb-2">
                Preferred contact / Bevorzugte Kontaktaufnahme:
              </h3>
              <p className="mb-3">
                Dear customer, in order to ensure that you receive a prompt
                reply, we strongly encourage you to first contact us via our
                contact form. If you contact us via regular mail, please keep in
                mind there may be a delay in our response time.
              </p>
              <p className="text-gray-600">
                Sehr geehrter Kunde, um sicherzustellen, dass Sie eine zeitnahe
                Antwort auf Ihre Anfrage erhalten, empfehlen wir Ihnen,
                vorrangig über unser Kontaktformular mit uns in Verbindung zu
                treten. Insofern Sie uns bevorzugt auf dem Postweg kontaktieren,
                haben Sie bitte Verständnis dafür, dass es hierbei zu einer
                längeren Bearbeitungszeit kommen kann.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Forms Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Contact forms / Kontaktformulare
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: "EliteSingles", email: "https://support.intentionalconnections.app" },
              { name: "SilverSingles", email: "support[at]silversingles.com" },
              { name: "eDarling", email: "support[at]edarling.com" },
              { name: "Zoosk", email: "support[at]zoosk.com" },
              { name: "Jdate", email: "support[at]jdate.com" },
              {
                name: "Christian Mingle",
                email: "support[at]christianmingle.com",
              },
              { name: "Spark App", email: "support[at]sparkapp.com" },
              { name: "LDS Singles", email: "support[at]ldssingles.com" },
              { name: "Jswipe", email: "support[at]jswipeapp.com" },
              { name: "Crosspath App", email: "support[at]crosspathsapp.com" },
            ].map((service, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium text-gray-800 mb-1">
                  {service.name}
                </h3>
                <p className="text-blue-600">{service.email}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Notice Section */}
        <div className="bg-gray-100 rounded-xl p-6 md:p-8 border border-gray-300">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Legal Information
          </h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <p className="font-medium mb-2">
                In accordance with Article 14(1) ODR-VO:
              </p>
              <p>
                The European Commission provides a platform for Online Dispute
                Resolution (ODR) for EU consumers at{" "}
                <a
                  href="https://support.intentionalconnections.app"
                  className="text-blue-600 hover:text-blue-800 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                https://support.intentionalconnections.app
                </a>
                .
              </p>
            </div>

            <div>
              <p className="font-medium mb-2">
                We are not obliged nor willing to participate in a dispute
                settlement procedure before a consumer arbitration body.
              </p>
              <p className="text-gray-600">
                Online-Streitbeilegung gemäß Art. 14 Abs. 1 ODR-VO: Die
                Europäische Kommission stellt eine Plattform zur
                Online-Streitbeilegung (OS) für EU-Verbraucher unter
                http://ec.europa.eu/consumers/odr/ bereit.
              </p>
              <p className="text-gray-600 mt-2">
                Wir weisen darauf hin, dass wir nicht bereit und nicht
                verpflichtet sind, an Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Imprint;
