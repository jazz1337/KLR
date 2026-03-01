// Gemeinsame Logik: Aktive Navigation, Rechner und Lernspiele.
document.addEventListener('DOMContentLoaded', () => {
  highlightActiveNav();
  initDeckungsbeitragRechner();
  initQuiz();
  initZuordnungsspiel();
});

function highlightActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path) link.classList.add('active');
  });
}

function euro(value) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
}

function initDeckungsbeitragRechner() {
  const form = document.getElementById('db-form');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const preis = parseFloat(document.getElementById('verkaufspreis').value);
    const variableKosten = parseFloat(document.getElementById('variable-kosten').value);
    const fixeKosten = parseFloat(document.getElementById('fixe-kosten').value);
    const out = document.getElementById('db-result');

    if ([preis, variableKosten, fixeKosten].some(v => Number.isNaN(v) || v < 0)) {
      out.innerHTML = '<p class="feedback wrong">Bitte gib gültige, nicht negative Zahlen ein.</p>';
      return;
    }

    const db = preis - variableKosten;
    if (db <= 0 || preis === 0) {
      out.innerHTML = '<p class="feedback wrong">Der Deckungsbeitrag muss größer als 0 sein, damit ein Break-even berechnet werden kann.</p>';
      return;
    }

    const dbRate = (db / preis) * 100;
    const breakEven = Math.ceil(fixeKosten / db);

    out.innerHTML = `
      <p><strong>Deckungsbeitrag je Stück:</strong> ${euro(db)}</p>
      <p><strong>Deckungsbeitragsrate:</strong> ${dbRate.toFixed(2)} %</p>
      <p><strong>Break-even-Menge:</strong> ${breakEven} Stück</p>
    `;
  });
}

function initQuiz() {
  const quizContainer = document.getElementById('quiz-container');
  const quizBtn = document.getElementById('quiz-submit');
  if (!quizContainer || !quizBtn) return;

  const questions = [
    { q: 'Welche Aussage passt zur Finanzbuchhaltung?', options: ['Internes Rechnungswesen zur Planung', 'Erfasst Kosten und Leistungen je Produkt', 'Externes Rechnungswesen mit gesetzlichen Vorschriften', 'Nur für Marketing-Auswertungen'], answer: 2 },
    { q: 'Welche Aussage passt zur Kosten- und Leistungsrechnung?', options: ['Erstellt Bilanz und GuV für externe Adressaten', 'Erfasst Kosten und Leistungen für interne Steuerung', 'Beschäftigt sich nur mit Steuern', 'Ersetzt die Finanzbuchhaltung vollständig'], answer: 1 },
    { q: 'Was sind Kosten?', options: ['Privatausgaben der Geschäftsführung', 'In Geld bewerteter Verbrauch für die betriebliche Leistungserstellung', 'Nur Zahlungen an Lieferanten', 'Jeder Geldabfluss eines Unternehmens'], answer: 1 },
    { q: 'Was sind Leistungen?', options: ['Alle Einzahlungen auf dem Bankkonto', 'In Geld bewertete, betriebsbedingte Outputs', 'Nur Verkäufe im stationären Handel', 'Nur außerordentliche Erträge'], answer: 1 },
    { q: 'Was ist ein typisches Beispiel für fixe Kosten im E-Commerce?', options: ['Versandlabel pro Paket', 'Zahlungsgebühr pro Bestellung', 'Lager-Miete', 'Verpackung pro Bestellung'], answer: 2 },
    { q: 'Was ist ein typisches Beispiel für variable Kosten im E-Commerce?', options: ['Grundgebühr Shop-Software', 'Miete für Lager', 'Versandkosten pro Bestellung', 'Jahresabschlusskosten'], answer: 2 },
    { q: 'Welche Aufgabe hat die Kostenartenrechnung?', options: ['Verteilung auf Kostenstellen', 'Ermittlung der Kosten nach Art', 'Zuordnung zu Kostenträgern', 'Ermittlung der Bilanzsumme'], answer: 1 },
    { q: 'Was versteht man unter Betriebserfolg?', options: ['Differenz aus privaten Entnahmen und Einlagen', 'Differenz aus betrieblichen Leistungen und betrieblichen Kosten', 'Summe aller Umsätze inklusive Steuern', 'Anzahl der monatlichen Bestellungen'], answer: 1 }
  ];

  quizContainer.innerHTML = questions.map((item, index) => `
    <fieldset class="quiz-question">
      <legend><strong>${index + 1}. ${item.q}</strong></legend>
      ${item.options.map((option, optIndex) => `
        <label><input type="radio" name="q${index}" value="${optIndex}"> ${option}</label><br>
      `).join('')}
      <p class="feedback" id="quiz-feedback-${index}"></p>
    </fieldset>
  `).join('');

  quizBtn.addEventListener('click', () => {
    let score = 0;
    questions.forEach((item, index) => {
      const selected = document.querySelector(`input[name="q${index}"]:checked`);
      const feedback = document.getElementById(`quiz-feedback-${index}`);
      if (selected && Number(selected.value) === item.answer) {
        score++;
        feedback.textContent = 'Richtig.';
        feedback.className = 'feedback correct';
      } else {
        feedback.textContent = `Falsch. Richtig ist: ${item.options[item.answer]}.`;
        feedback.className = 'feedback wrong';
      }
    });

    const result = document.getElementById('quiz-result');
    const msg = score >= 6 ? 'Super, du beherrschst die Grundlagen!' : 'Schau dir nochmal die Grundlagen an.';
    result.innerHTML = `<strong>Ergebnis:</strong> ${score} von ${questions.length} Punkten. ${msg}`;
  });
}

function initZuordnungsspiel() {
  const container = document.getElementById('match-game');
  const btn = document.getElementById('match-submit');
  if (!container || !btn) return;

  const items = [
    { label: 'Kostenartenrechnung', def: 'Erfassung der Kosten nach Art (z. B. Personal, Material, Versand).'},
    { label: 'Kostenstellenrechnung', def: 'Verteilung der Gemeinkosten auf Bereiche wie Lager oder Kundenservice.'},
    { label: 'Kostenträgerrechnung', def: 'Zuordnung der Kosten zu Produkten, Aufträgen oder Produktgruppen.'},
    { label: 'Kosten', def: 'In Geld bewerteter Verbrauch für die betriebliche Leistungserstellung.'},
    { label: 'Leistungen', def: 'In Geld bewertete betriebsbedingte Outputs des Unternehmens.'},
    { label: 'Deckungsbeitrag', def: 'Differenz aus Verkaufspreis und variablen Kosten je Stück.'},
    { label: 'Break-even', def: 'Menge, bei der Erlöse und Gesamtkosten gleich hoch sind.'}
  ];

  container.innerHTML = items.map((item, index) => `
    <div class="match-row">
      <p><strong>${index + 1}.</strong> ${item.def}</p>
      <label for="match-${index}" class="visually-hidden">Begriff auswählen</label>
      <select id="match-${index}" data-answer="${item.label}">
        <option value="">Bitte wählen</option>
        ${items.map(opt => `<option value="${opt.label}">${opt.label}</option>`).join('')}
      </select>
      <p class="feedback" id="match-feedback-${index}"></p>
    </div>
  `).join('');

  btn.addEventListener('click', () => {
    let correct = 0;
    items.forEach((item, index) => {
      const select = document.getElementById(`match-${index}`);
      const feedback = document.getElementById(`match-feedback-${index}`);
      if (select.value === item.label) {
        correct++;
        feedback.textContent = 'Richtig zugeordnet.';
        feedback.className = 'feedback correct';
      } else {
        feedback.textContent = `Nicht korrekt. Richtige Zuordnung: ${item.label}.`;
        feedback.className = 'feedback wrong';
      }
    });
    document.getElementById('match-result').innerHTML = `<strong>Ergebnis:</strong> ${correct} von ${items.length} Zuordnungen korrekt.`;
  });
}
