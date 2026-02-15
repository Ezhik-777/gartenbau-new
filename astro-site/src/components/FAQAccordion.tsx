import { useState } from 'react';
import './FAQAccordion.css';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    id: 1,
    question: 'Welche Dienstleistungen bietet Gartenbau Z.M. an?',
    answer: 'Wir bieten ein umfassendes Spektrum an Gartenbau-Dienstleistungen: Professionelle Gartengestaltung und -planung, hochwertige Natursteinarbeiten, Terrassenbau, Pflasterarbeiten für Wege und Zufahrten, Hausmeisterservice, Sichtschutz-Installation, Erdarbeiten sowie Rollrasen-Verlegung. Alle Arbeiten führen wir in Remseck, Stuttgart, Ludwigsburg, Waiblingen und der gesamten Region aus.'
  },
  {
    id: 2,
    question: 'In welchen Regionen sind Sie tätig?',
    answer: 'Unser Hauptarbeitsgebiet umfasst Remseck am Neckar, Stuttgart, Ludwigsburg, Waiblingen, Kornwestheim, Fellbach, Esslingen, Böblingen und Backnang. Wir bedienen die gesamte Region Stuttgart und den Rems-Murr-Kreis. Für größere Projekte sind wir auch in Baden-Württemberg darüber hinaus tätig.'
  },
  {
    id: 3,
    question: 'Bieten Sie kostenlose Beratung und Kostenvoranschläge an?',
    answer: 'Ja, wir bieten kostenlose Erstberatung vor Ort an. Dabei besichtigen wir Ihr Grundstück, besprechen Ihre Wünsche und Vorstellungen und erstellen anschließend einen detaillierten, unverbindlichen Kostenvoranschlag. Kontaktieren Sie uns telefonisch unter +49 178 2747470 oder per WhatsApp, um einen Termin zu vereinbaren.'
  },
  {
    id: 4,
    question: 'Wie lange dauert ein typisches Gartenbau-Projekt?',
    answer: 'Die Projektdauer variiert je nach Umfang: Kleinere Arbeiten wie Rollrasen-Verlegung oder Pflanzungen können 1-3 Tage dauern. Terrassenbau und Pflasterarbeiten benötigen typischerweise 3-7 Tage. Komplette Gartenumgestaltungen mit Natursteinarbeiten, Terrassen und Bepflanzung können 2-4 Wochen in Anspruch nehmen. Bei der Erstberatung geben wir Ihnen eine genaue Zeitplanung.'
  },
  {
    id: 5,
    question: 'Welche Materialien verwenden Sie für Natursteinarbeiten?',
    answer: 'Wir arbeiten mit hochwertigen Natursteinen wie Granit, Sandstein, Muschelkalk, Basalt und Porphyr sowie mit modernen Betonsteinen. Die Materialauswahl erfolgt individuell nach Ihren Wünschen, dem Projektbudget und der vorgesehenen Verwendung. Wir beraten Sie ausführlich zu den Eigenschaften, Vor- und Nachteilen der verschiedenen Materialien und zeigen Ihnen Mustersteine.'
  },
  {
    id: 6,
    question: 'Übernehmen Sie auch Wartung und Pflege nach Projektabschluss?',
    answer: 'Ja, wir bieten umfassende Gartenpflege und Hausmeisterservice an. Nach Abschluss Ihres Projekts können wir regelmäßige Pflegearbeiten wie Rasenmähen, Heckenschnitt, Unkrautbekämpfung und Laubbeseitigung übernehmen. Wir erstellen gerne einen individuellen Pflegeplan, der zu Ihrem Garten und Budget passt.'
  },
  {
    id: 7,
    question: 'Welche Zahlungsmöglichkeiten bieten Sie an?',
    answer: 'Wir akzeptieren Barzahlung und Banküberweisung. Die Zahlungsmodalitäten werden individuell vereinbart – typischerweise eine Anzahlung bei Projektbeginn, Teilzahlungen bei größeren Projekten und die Restzahlung nach erfolgreicher Fertigstellung. Alle Details werden transparent im Kostenvoranschlag und Vertrag festgehalten.'
  }
];

export default function FAQAccordion() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="faq-accordion">
      {faqs.map((faq) => (
        <div
          key={faq.id}
          className={`faq-item ${openId === faq.id ? 'active' : ''}`}
        >
          <button
            className="faq-question"
            onClick={() => toggleFAQ(faq.id)}
            aria-expanded={openId === faq.id}
            aria-controls={`faq-answer-${faq.id}`}
          >
            <h3>{faq.question}</h3>
            <span className="faq-icon" aria-hidden="true">
              {openId === faq.id ? '−' : '+'}
            </span>
          </button>

          <div
            id={`faq-answer-${faq.id}`}
            className="faq-answer"
            role="region"
            aria-labelledby={`faq-question-${faq.id}`}
          >
            <div className="faq-answer-content">
              <p>{faq.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
