/* ============================================================
   KLR-Lernwebsite – Gemeinsames JavaScript
   Enthält: Navigation, Rechner, Quiz, Zuordnungsspiel
   ============================================================ */

/* ---- Aktive Navigation markieren ---- */
(function markActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ---- Hamburger-Menü ---- */
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    // Menü schließen bei Klick auf Link (Mobil)
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }
});

/* ============================================================
   DECKUNGSBEITRAGS- & BREAK-EVEN-RECHNER
   (verwendet auf praxis_beispiel.html)
   ============================================================ */
function initRechner() {
  const form    = document.getElementById('rechner-form');
  const result  = document.getElementById('rechner-result');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Eingaben lesen
    const vp  = parseFloat(document.getElementById('vp').value);   // Verkaufspreis
    const vk  = parseFloat(document.getElementById('vk').value);   // Variable Kosten
    const fk  = parseFloat(document.getElementById('fk').value);   // Fixe Kosten

    // Validierung
    if (isNaN(vp) || isNaN(vk) || isNaN(fk) || vp <= 0 || fk < 0 || vk < 0) {
      result.innerHTML = '<p style="color:var(--error);font-weight:600;">⚠️ Bitte alle Felder mit gültigen Zahlen (≥ 0) ausfüllen und Verkaufspreis > 0 setzen.</p>';
      result.style.display = 'block';
      return;
    }

    const db  = vp - vk;            // Deckungsbeitrag je Stück
    const dbr = (db / vp) * 100;   // Deckungsbeitragsrate
    const bem = db > 0 ? Math.ceil(fk / db) : null; // Break-even-Menge

    // Ergebnis-HTML aufbauen
    let html = `<div class="result-box">
      <h3>📊 Ergebnisse deiner Berechnung</h3>`;

    html += `
      <div class="result-row">
        <span class="result-label">Verkaufspreis je Stück</span>
        <span class="result-value">${fmt(vp)} €</span>
      </div>
      <div class="result-row">
        <span class="result-label">Variable Kosten je Stück</span>
        <span class="result-value">${fmt(vk)} €</span>
      </div>
      <div class="result-row">
        <span class="result-label">Deckungsbeitrag je Stück</span>
        <span class="result-value" style="${db >= 0 ? 'color:var(--amber)' : 'color:#f87171'}">${fmt(db)} €</span>
      </div>
      <div class="result-row">
        <span class="result-label">Deckungsbeitragsrate</span>
        <span class="result-value" style="${db >= 0 ? 'color:var(--amber)' : 'color:#f87171'}">${dbr.toFixed(2)} %</span>
      </div>
      <div class="result-row">
        <span class="result-label">Fixe Kosten pro Monat</span>
        <span class="result-value">${fmt(fk)} €</span>
      </div>
      <div class="result-row">
        <span class="result-label">Break-even-Menge</span>
        <span class="result-value">
          ${db > 0 ? `${bem.toLocaleString('de-DE')} Stück / Monat` : (db === 0 ? '∞ (DB = 0)' : '⚠️ Verlust (DB negativ)')}
        </span>
      </div>`;

    html += `</div>`;

    if (db < 0) {
      html += `<div class="info-banner" style="margin-top:.75rem; background:#fee2e2; border-color:#fca5a5; color:#dc2626;">
        <strong>Achtung:</strong> Der Deckungsbeitrag ist negativ. Das bedeutet, die variablen Kosten übersteigen den Verkaufspreis. Jede verkaufte Einheit erhöht den Verlust.
      </div>`;
    } else if (bem !== null) {
      html += `<div class="info-banner" style="margin-top:.75rem;">
        <strong>Interpretation:</strong> Ab <strong>${bem.toLocaleString('de-DE')} Bestellungen/Monat</strong> werden alle Fixkosten gedeckt – erst dann entsteht Gewinn.
      </div>`;
    }

    result.innerHTML = html;
    result.style.display = 'block';
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Reset-Button
  const resetBtn = document.getElementById('rechner-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      result.style.display = 'none';
    });
  }
}

/* Hilfsfunktion: Zahlen auf 2 Nachkommastellen formatieren */
function fmt(n) {
  return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ============================================================
   QUIZ – Grundbegriffe der KLR (lernspiele.html)
   ============================================================ */
const quizData = [
  {
    q: 'Welche Aussage passt zur Finanzbuchhaltung (FiBu)?',
    options: [
      'Sie erfasst Kosten und Leistungen für interne Entscheidungen.',
      'Sie ist das externe Rechnungswesen und unterliegt gesetzlichen Vorschriften.',
      'Sie berechnet Deckungsbeiträge und Break-even-Punkte.',
      'Sie ist nur für große Unternehmen verpflichtend.'
    ],
    correct: 1,
    explain: 'Die FiBu ist das externe Rechnungswesen: Sie dokumentiert Geschäftsvorfälle gesetzeskonform und liefert die Grundlage für den Jahresabschluss (GuV/Bilanz).'
  },
  {
    q: 'Welche Aussage passt zur Kosten- und Leistungsrechnung (KLR)?',
    options: [
      'Sie ist gesetzlich vorgeschrieben und richtet sich an externe Adressaten.',
      'Sie dokumentiert ausschließlich Aufwand und Ertrag.',
      'Sie ist das interne Rechnungswesen zur Steuerung und Entscheidungsunterstützung.',
      'Sie erstellt immer einen Jahresabschluss.'
    ],
    correct: 2,
    explain: 'Die KLR ist das interne Rechnungswesen. Sie hilft bei Kalkulation, Kontrolle und Planung – also bei unternehmerischen Entscheidungen.'
  },
  {
    q: 'Was versteht man unter „Kosten" in der KLR?',
    options: [
      'Alle Ausgaben, die ein Unternehmen in einer Periode tätigt.',
      'Der in Geld bewertete Verbrauch von Gütern und Dienstleistungen für die betriebliche Leistungserstellung.',
      'Einnahmen abzüglich Steuern.',
      'Nur die Rohstoffkosten eines Produkts.'
    ],
    correct: 1,
    explain: 'Kosten = bewerteter betrieblicher Verbrauch. Nicht alle Ausgaben sind automatisch Kosten (z. B. Privatentnahmen oder neutrale Aufwendungen).'
  },
  {
    q: 'Was sind „Leistungen" in der KLR?',
    options: [
      'Gehaltsleistungen an Mitarbeitende.',
      'Subventionen vom Staat.',
      'In Geld bewertete, betriebsbedingte Outputs (erstellte Güter/Dienstleistungen) einer Periode.',
      'Steuererstattungen.'
    ],
    correct: 2,
    explain: 'Leistungen sind die betriebsbedingten Outputs – also das, was das Unternehmen produziert oder verkauft, z. B. ausgelieferte Waren oder Serviceleistungen.'
  },
  {
    q: 'Was ist ein typisches Beispiel für fixe Kosten im E-Commerce?',
    options: [
      'Versandlabel pro verschicktem Paket.',
      'Zahlungsgebühren pro Bestellung.',
      'Monatliche Miete für das Lager.',
      'Verpackungsmaterial pro Sendung.'
    ],
    correct: 2,
    explain: 'Fixe Kosten verändern sich kurzfristig nicht mit der Bestellmenge – z. B. Lagermiete, Grundgebühren für Software oder Abonnements.'
  },
  {
    q: 'Was ist ein typisches Beispiel für variable Kosten im E-Commerce?',
    options: [
      'Jahresgebühr für die Shop-Software.',
      'Versandkosten je Paket.',
      'Lohnkosten für Verwaltungspersonal.',
      'Monatliche Serverkosten (Flatrate).'
    ],
    correct: 1,
    explain: 'Variable Kosten steigen mit der Bestellmenge – z. B. Versand, Verpackung oder Zahlungsgebühren fallen pro Bestellung an.'
  },
  {
    q: 'Welche Aufgabe hat die Kostenartenrechnung?',
    options: [
      'Sie weist Kosten einzelnen Produkten zu.',
      'Sie ermittelt, wo im Unternehmen Kosten entstehen.',
      'Sie erfasst, welche Kosten (nach Art) insgesamt angefallen sind.',
      'Sie berechnet den Betriebserfolg.'
    ],
    correct: 2,
    explain: 'Die Kostenartenrechnung beantwortet die Frage „Welche Kosten?" – sie erfasst alle Kosten nach ihrer Art, z. B. Personalkosten, Materialkosten, Versandkosten.'
  },
  {
    q: 'Was versteht man unter „Betriebserfolg"?',
    options: [
      'Den Gewinn nach Steuern laut Steuererklärung.',
      'Die Differenz aus betrieblichen Leistungen und betrieblichen Kosten.',
      'Das gesamte Eigenkapital des Unternehmens.',
      'Den Umsatz minus Werbungskosten.'
    ],
    correct: 1,
    explain: 'Betriebserfolg = betriebliche Leistungen – betriebliche Kosten. Er zeigt, wie erfolgreich das operative Kerngeschäft in einer Periode war.'
  }
];

let quizState = { current: 0, score: 0, answered: [] };

function initQuiz() {
  const quizEl = document.getElementById('quiz-container');
  if (!quizEl) return;

  quizState = { current: 0, score: 0, answered: new Array(quizData.length).fill(null) };
  renderQuiz();
}

function renderQuiz() {
  const quizEl = document.getElementById('quiz-container');
  if (!quizEl) return;

  // Wenn alle Fragen beantwortet
  if (quizState.current >= quizData.length) {
    renderQuizResult();
    return;
  }

  const q     = quizData[quizState.current];
  const total = quizData.length;

  // Fortschritts-Dots
  let dots = quizState.answered.map((a, i) => {
    let cls = 'progress-dot';
    if (a === null && i === quizState.current) cls += ' active';
    else if (a === true)  cls += ' done-correct';
    else if (a === false) cls += ' done-wrong';
    return `<div class="${cls}" title="Frage ${i+1}"></div>`;
  }).join('');

  let optHtml = q.options.map((opt, i) =>
    `<button class="answer-btn" data-idx="${i}">${opt}</button>`
  ).join('');

  quizEl.innerHTML = `
    <div class="quiz-progress" role="status" aria-label="Fortschritt">${dots}</div>
    <div class="question-card">
      <div class="question-number">Frage ${quizState.current + 1} von ${total}</div>
      <div class="question-text">${q.q}</div>
      <div class="answer-options">${optHtml}</div>
      <div id="q-feedback" class="feedback-text" style="display:none;"></div>
    </div>
    <div id="next-wrap" style="display:none; margin-top:.75rem;">
      <button class="btn btn-primary" id="next-btn">
        ${quizState.current + 1 < total ? 'Nächste Frage →' : 'Ergebnis anzeigen →'}
      </button>
    </div>`;

  // Event: Antwort wählen
  quizEl.querySelectorAll('.answer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const chosen = parseInt(btn.dataset.idx);
      const correct = chosen === q.correct;

      if (correct) {
        quizState.score++;
        quizState.answered[quizState.current] = true;
        btn.classList.add('correct');
      } else {
        quizState.answered[quizState.current] = false;
        btn.classList.add('wrong');
        quizEl.querySelectorAll('.answer-btn')[q.correct].classList.add('correct');
      }

      // Alle Buttons deaktivieren
      quizEl.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);

      // Feedback anzeigen
      const fb = document.getElementById('q-feedback');
      fb.textContent = correct ? `✅ Richtig! ${q.explain}` : `❌ Leider falsch. ${q.explain}`;
      fb.className = `feedback-text ${correct ? 'correct' : 'wrong'}`;
      fb.style.display = 'block';

      document.getElementById('next-wrap').style.display = 'block';
    });
  });

  // Nächste Frage
  document.addEventListener('click', function onNext(e) {
    if (e.target && e.target.id === 'next-btn') {
      document.removeEventListener('click', onNext);
      quizState.current++;
      renderQuiz();
    }
  });
}

function renderQuizResult() {
  const quizEl = document.getElementById('quiz-container');
  const score  = quizState.score;
  const total  = quizData.length;
  const pct    = Math.round((score / total) * 100);
  let emoji, msg;

  if (pct >= 87) {
    emoji = '🏆'; msg = 'Hervorragend! Du beherrschst die Grundlagen der KLR sehr gut.';
  } else if (pct >= 62) {
    emoji = '👍'; msg = 'Gut gemacht! Einige Konzepte solltest du nochmals vertiefen.';
  } else {
    emoji = '📚'; msg = 'Schau dir nochmal die Grundbegriffe und den Aufbau der KLR an – du schaffst das!';
  }

  quizEl.innerHTML = `
    <div class="score-card">
      <div style="font-size:3rem;">${emoji}</div>
      <div class="score-number">${score} / ${total}</div>
      <p><strong>${pct}% richtig</strong></p>
      <p>${msg}</p>
      <button class="btn btn-amber btn-lg" style="margin-top:1.5rem;" onclick="initQuiz()">
        🔄 Quiz wiederholen
      </button>
    </div>`;
}

/* ============================================================
   ZUORDNUNGSSPIEL – KLR-Aufbau (lernspiele.html)
   ============================================================ */
const matchingData = [
  {
    definition: 'Beantwortet die Frage: „Welche Kosten fallen an?" – erfasst alle Kosten nach ihrer Art.',
    answer: 'Kostenartenrechnung'
  },
  {
    definition: 'Beantwortet die Frage: „Wo fallen die Kosten an?" – verteilt Gemeinkosten auf Unternehmensbereiche.',
    answer: 'Kostenstellenrechnung'
  },
  {
    definition: 'Beantwortet die Frage: „Wofür fallen die Kosten an?" – ordnet Kosten einzelnen Produkten oder Aufträgen zu.',
    answer: 'Kostenträgerrechnung'
  },
  {
    definition: 'In Geld bewerteter betrieblicher Verbrauch von Gütern und Dienstleistungen in einer Periode.',
    answer: 'Kosten'
  },
  {
    definition: 'In Geld bewertete, betriebsbedingte Outputs (erstellte Güter/Dienstleistungen) eines Unternehmens in einer Periode.',
    answer: 'Leistungen'
  },
  {
    definition: 'Verkaufspreis minus variable Kosten je Stück – gibt an, wie viel zur Deckung der Fixkosten übrig bleibt.',
    answer: 'Deckungsbeitrag'
  },
  {
    definition: 'Die Absatzmenge, bei der Erlöse und Gesamtkosten gleich hoch sind – kein Gewinn, kein Verlust.',
    answer: 'Break-even'
  }
];

const matchingTerms = ['Kostenartenrechnung','Kostenstellenrechnung','Kostenträgerrechnung','Kosten','Leistungen','Deckungsbeitrag','Break-even'];

function initMatching() {
  const container = document.getElementById('matching-container');
  if (!container) return;

  let html = matchingData.map((item, i) => {
    let options = ['– bitte wählen –', ...matchingTerms]
      .map(t => `<option value="${t}">${t}</option>`)
      .join('');
    return `
      <div class="matching-item" id="match-${i}">
        <div class="matching-definition">${item.definition}</div>
        <select class="matching-select" id="sel-${i}" aria-label="Begriff für Definition ${i+1}">
          ${options}
        </select>
      </div>`;
  }).join('');

  html += `
    <div style="margin-top:1.25rem; display:flex; gap:.75rem; flex-wrap:wrap;">
      <button class="btn btn-primary" id="matching-check">Auswerten ✓</button>
      <button class="btn btn-outline" id="matching-reset">Zurücksetzen</button>
    </div>
    <div id="matching-result" style="display:none; margin-top:1rem;"></div>`;

  container.innerHTML = html;

  document.getElementById('matching-check').addEventListener('click', checkMatching);
  document.getElementById('matching-reset').addEventListener('click', initMatching);
}

function checkMatching() {
  let correct = 0;
  matchingData.forEach((item, i) => {
    const sel  = document.getElementById(`sel-${i}`);
    const row  = document.getElementById(`match-${i}`);
    row.classList.remove('correct-match','wrong-match');
    if (sel.value === item.answer) {
      row.classList.add('correct-match');
      correct++;
    } else {
      row.classList.add('wrong-match');
    }
  });

  const total = matchingData.length;
  const pct   = Math.round((correct / total) * 100);
  const result = document.getElementById('matching-result');
  let msg = correct === total
    ? '🏆 Perfekt! Du hast alle Begriffe richtig zugeordnet.'
    : correct >= Math.ceil(total / 2)
      ? `👍 Gut! ${correct} von ${total} richtig. Schau dir die rot markierten Zeilen nochmals an.`
      : `📚 ${correct} von ${total} richtig. Wiederhole den Abschnitt über den Aufbau der KLR.`;

  result.innerHTML = `
    <div class="${correct === total ? 'score-card' : 'card'}">
      <strong>${msg}</strong>
      ${correct < total ? `<p style="margin-top:.5rem; font-size:.88rem;">Die richtigen Antworten sind in den rot markierten Feldern noch sichtbar, nachdem du das Spiel zurücksetzt.</p>` : ''}
    </div>`;
  result.style.display = 'block';
}

/* initRechner, initQuiz, initMatching und initAccordions
   werden am Ende der Datei gemeinsam initialisiert. */

/* ============================================================
   AKKORDEON
   ============================================================ */
function initAccordions() {
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const content  = trigger.nextElementSibling;
      const isOpen   = trigger.getAttribute('aria-expanded') === 'true';

      // Alle schließen (optional: nur ein offenes erlauben)
      // document.querySelectorAll('.accordion-trigger').forEach(t => {
      //   t.setAttribute('aria-expanded','false');
      //   t.nextElementSibling.classList.remove('open');
      // });

      trigger.setAttribute('aria-expanded', !isOpen);
      content.classList.toggle('open', !isOpen);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initRechner();
  initQuiz();
  initMatching();
  initAccordions();
});
