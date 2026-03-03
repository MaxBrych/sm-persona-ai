import type { PersonaData } from "./types";

const IMG = "https://tepsrntcystsvvtraruc.supabase.co/storage/v1/object/public/images";

export const SEED_PERSONAS: {
  name: string;
  type: string;
  category: string;
  image_url: string;
  data: PersonaData;
}[] = [
  {
    name: "Niklas",
    type: "Neokultureller",
    category: "Digital-stark & einordnungsaffin",
    image_url: `${IMG}/Niklas.png`,
    data: {
      kurzprofil: {
        alter: 43,
        geschlecht: "männlich",
        familie: "ledig, keine Kinder",
        bildung: "Fachhochschulabschluss in Wirtschaftsinformatik",
        beruf: "IT im Gesundheitswesen (80% remote)",
        eigenschaften: [
          "Zugezogen",
          "E-Auto",
          "Hohe Technikaffinität",
          "Digital affin, diskussionsfreudig, trend- & wissensorientiert",
          "Nutzt News morgens & abends als feste Routine",
          "Viele Abos, hoher Medienkonsum",
        ],
      },
      markentreue: [
        { marke: "Nordkurier", wohnort: "Schwerin", einkommen: "3.500 € brutto" },
        { marke: "Schwäbische", wohnort: "Reutlingen", einkommen: "4.200 € brutto" },
      ],
      zitat: "Verstehen, was zählt – kompetent und auf den Punkt.",
      beduerfnisseMotive: [
        "Informiert sein – ohne Zeit zu verlieren",
        "Politik, Wirtschaft & Kultur einordnen können",
        "Trends & Entwicklungen früh erkennen",
        "Diskussionsstoff & Meinungsbildung",
        "Wunsch nach kuratierter Tiefe statt Informationsflut",
      ],
      kerneigenschaften: [
        { name: "News-Interesse", wert: 4 },
        { name: "Medien-Devices", wert: 5 },
        { name: "Anzahl Abos", wert: 4 },
        { name: "Social Media Aktivität", wert: 4 },
        { name: "Regionale Verbundenheit", wert: 3 },
      ],
      emotionaleTreiber: [
        "Trendkompetenz – am Puls der Zeit sein",
        "Flexible soziale Verbindung – Austausch ohne Verpflichtungsdruck",
        "Zugehörigkeit – Teil relevanter Diskurse sein",
        "Sicherheit durch Wissen – Orientierung in komplexen Zeiten",
      ],
      emotionaleSegmente: {
        hauptsegment: "Leistungsorientierung",
        sekundaereSegmente: "Verständnis, Wandel",
        kurzbegruendung: "Will Trends früh erkennen, kompetent sein, Diskurs führen",
      },
      produktFit: [
        {
          produkt: "\"Mein Tag\" (Produkt)",
          typ: "Produkt",
          beschreibung: [
            "Personalisierte Tagesagenda",
            "Politik + Wirtschaft + Kultur",
            "Kompakte Morgen- & Abendstruktur",
            "Relevanz- und Priorisierungslogik",
            "Debattenüberblick",
            "Kuratierte Tiefe statt News-Überflutung",
            "Strukturierte, interaktive & datenbasierte News-Aufbereitung",
          ],
        },
        {
          produkt: "Push / Follow (Touchpoint)",
          typ: "Touchpoint",
          beschreibung: [
            "Themen-Follow (Wirtschaft, Politik, Trends)",
            "Smarte Relevanz-Pushes",
            "Debatten- & Trendhinweise",
            "Personalisierte Alerts",
          ],
        },
      ],
    },
  },
  {
    name: "Arne",
    type: "Ambitionierter",
    category: "Digital-stark & einordnungsaffin",
    image_url: `${IMG}/Arne.png`,
    data: {
      kurzprofil: {
        alter: 38,
        geschlecht: "männlich",
        familie: "verheiratet, 2 Kinder",
        bildung: "Fachhochschulabschluss (Elektrotechnik)",
        beruf: "Elektroanlagenmonteur",
        eigenschaften: [
          "Einheimischer und Mitglied in der freiwilligen Feuerwehr",
          "Hundebesitzer",
          "Ambitionierter Macher-Typ mit Führungsanspruch",
          "Datengetrieben, leistungsorientiert, strukturiert, sportbegeistert",
          "Hohe Geräte- & Abo-Affinität",
          'News-Nutzung: morgens & „always on"',
        ],
      },
      markentreue: [
        { marke: "Nordkurier", wohnort: "Güstrow", einkommen: "3.000 € brutto" },
        { marke: "Schwäbische", wohnort: "Messtetten", einkommen: "3.900 € brutto" },
      ],
      zitat: "Schnell live dabei - in meiner Region.",
      beduerfnisseMotive: [
        "Überblick trotz hoher Arbeitsbelastung",
        "Live-Informationen bei relevanten Entwicklungen",
        "Regionale News: Sport, Verkehr und Veranstaltungen",
        "Wirtschaft & Politik",
      ],
      kerneigenschaften: [
        { name: "News-Interesse", wert: 4 },
        { name: "Medien-Devices", wert: 4 },
        { name: "Anzahl Abos", wert: 4 },
        { name: "Social Media Aktivität", wert: 4 },
        { name: "Regionale Verbundenheit", wert: 4 },
      ],
      emotionaleTreiber: [
        "Kontrolle & Struktur – auch bei vielen parallelen Projekten den Überblick behalten",
        "Effizienz unter Druck – schnell informiert sein, ohne zusätzlichen Aufwand",
        "Verantwortung & Stabilität – Sicherheit für Familie schaffen",
        "Preis-Leistungs-Bewusstsein – maximaler Informationswert für ein faires Budget",
      ],
      emotionaleSegmente: {
        hauptsegment: "Unmittelbarkeit",
        sekundaereSegmente: "Leistungsorientierung, Gemeinschaft",
        kurzbegruendung: "Braucht schnellen Überblick, Effizienz, Verantwortung",
      },
      produktFit: [
        {
          produkt: "Classic App (Produkt)",
          typ: "Produkt",
          beschreibung: [
            "Personalisierte Startseite",
            "Live-Ticker & Kurz-Updates",
            "Monitoring relevanter Themen",
            "Kuratierte Abend-Zusammenfassung",
            "Strukturierte, komprimierte und leistungsorientierte Formate",
          ],
        },
        {
          produkt: "Push / Follow (Touchpoint)",
          typ: "Touchpoint",
          beschreibung: [
            "Wirtschaft, Großprojekte, Lokalpolitik",
            "Breaking-News",
            "Projekt- & Branchenrelevante Alerts",
            '„Nicht verpassen"-Mechanismus',
          ],
        },
        {
          produkt: "Social Media (Touchpoint)",
          typ: "Touchpoint",
          beschreibung: [
            "Artikel-Sharing",
            "Debatten verfolgen",
            "Schnelle Impulse zwischendurch",
          ],
        },
      ],
    },
  },
  {
    name: "Steffi",
    type: "Selbstgenügsame",
    category: "Selten, aber gezielt",
    image_url: `${IMG}/Steffi.png`,
    data: {
      kurzprofil: {
        alter: 40,
        geschlecht: "weiblich",
        familie: "Single, keine Kinder",
        bildung: "Fachhochschule",
        beruf: "Chemielaborantin",
        eigenschaften: [
          "Wissensorientiert, reflektiert, eher introvertiert",
          "2 Katzen",
          "Liest gerne ausführlich (\"Lesen\" ist explizite Stärke)",
          "Sozial eher selektiv, kein Smalltalk-Typ",
          "Hohe inhaltliche Kompetenz, geringes Bedürfnis nach Selbstdarstellung",
          "Liebt ihre Pflanzen und dekoriert gerne ihre Mietwohnung",
        ],
      },
      markentreue: [
        { marke: "Nordkurier", wohnort: "Neubrandenburg", einkommen: "3.100 € brutto" },
        { marke: "Schwäbische", wohnort: "Ulm", einkommen: "3.800 € brutto" },
      ],
      zitat: "Ich wachse mit dem Wissen, das ich lese.",
      beduerfnisseMotive: [
        "Wissen vertiefen, Themen verstehen, DIY-Anleitungen",
        "Überblick über gesellschaftliche Entwicklungen",
        '„Thema des Tages": Überregional, Wetter, Streaming-Tipps',
        "Gezielte Suche statt Dauerbeschallung",
      ],
      kerneigenschaften: [
        { name: "News-Interesse", wert: 3 },
        { name: "Medien-Devices", wert: 3 },
        { name: "Anzahl Abos", wert: 2 },
        { name: "Social Media Aktivität", wert: 2 },
        { name: "Regionale Verbundenheit", wert: 2 },
      ],
      emotionaleTreiber: [
        "Trendkompetenz – am Puls der Zeit sein",
        "Flexible soziale Verbindung – Austausch ohne Verpflichtungsdruck",
        "Zugehörigkeit – Teil relevanter Diskurse sein",
        "Sicherheit durch Wissen – Orientierung in komplexen Zeiten",
      ],
      emotionaleSegmente: {
        hauptsegment: "Verständnis",
        sekundaereSegmente: "Qualität, Komfort",
        kurzbegruendung: "Sucht Tiefe, Struktur, ruhiges Verstehen",
      },
      produktFit: [
        {
          produkt: "Classic App (Produkt)",
          typ: "Produkt",
          beschreibung: [
            "Ruhige, strukturierte Startseite",
            '„Thema des Tages"',
            "Reportagen & Hintergrund",
            "Merkliste / Nachlesen",
            "Gezielte Suchfunktion",
            "Tiefe, vielfältige und differenzierte Aufbereitung",
          ],
        },
        {
          produkt: "Newsletter (Touchpoint)",
          typ: "Touchpoint",
          beschreibung: [
            "Kuratierte Themenauswahl",
            "Dossier-Hinweise",
            "True-Crime / Podcast-Empfehlungen",
            "Kein Breaking-News-Druck",
          ],
        },
      ],
    },
  },
  {
    name: "Vanessa",
    type: "Vereinfachende",
    category: "Selten, aber gezielt",
    image_url: `${IMG}/Vanessa.png`,
    data: {
      kurzprofil: {
        alter: 32,
        geschlecht: "weiblich",
        familie: "verlobt, keine Kinder",
        bildung: "Mittlere Reife",
        beruf: "Bankkauffrau",
        eigenschaften: [
          "Lebensfroh, pragmatisch, stark alltagsgetrieben",
          "2 Katzen",
          "Wenig Zeit, hoher Wunsch nach schneller Orientierung",
          "Social-affin, aber nicht politisch tief interessiert",
          "Mag klare, einfache Inhalte",
          "Spielt im Musikverein Klarinette, Hobby-Influencerin für Supplements, Fitnessstudio-Gängerin",
        ],
      },
      markentreue: [
        { marke: "Nordkurier", wohnort: "Rügen", einkommen: "3.200 € brutto" },
        { marke: "Schwäbische", wohnort: "Ehingen", einkommen: "3.700 € brutto" },
      ],
      zitat: "Immer up to date – auch hier bei uns.",
      beduerfnisseMotive: [
        "Schnell verstehen, was wichtig ist",
        "Kurze, visuelle Inhalte",
        "Alltagsrelevanz statt Tiefenanalyse",
        "Orientierung im regionalen Geschehen",
        "Trend- & Gesprächsthemen mitbekommen",
      ],
      kerneigenschaften: [
        { name: "News-Interesse", wert: 3 },
        { name: "Medien-Devices", wert: 4 },
        { name: "Anzahl Abos", wert: 2 },
        { name: "Social Media Aktivität", wert: 4 },
        { name: "Regionale Verbundenheit", wert: 3 },
      ],
      emotionaleTreiber: [
        "Trendanschluss – mitbekommen, was gerade wichtig ist",
        "Gesprächssicherheit – souverän mitreden können",
        "Soziale Orientierung – wissen, worüber andere sprechen",
        "Finanzielle Stabilität – informiert bleiben, um klug zu entscheiden",
      ],
      emotionaleSegmente: {
        hauptsegment: "Relevanz / Trendstatus",
        sekundaereSegmente: "Aufmerksamkeit, Gemeinschaft",
        kurzbegruendung: "Will wissen, worüber andere reden, Themenanschluss",
      },
      produktFit: [
        {
          produkt: "Newsletter (Produkt)",
          typ: "Produkt",
          beschreibung: [
            "Kompakte Zusammenfassung (\"Das Wichtigste heute\")",
            "Kurze Teaser mit klarer Einordnung",
            "Service-, Freizeit- & Verbraucherthemen",
            "Alltagstipps & regionale Highlights",
            "Visuelle Elemente / Snippets",
            "Bequeme, schnelle und leicht konsumierbare News-Aufbereitung",
          ],
        },
        {
          produkt: "Website (Touchpoint)",
          typ: "Touchpoint",
          beschreibung: [
            "Schneller Zugriff auf einzelne Themen",
            "Überschneidungen",
            '„In Kürze"-Formate',
            "Regionale Service-Inhalte",
          ],
        },
        {
          produkt: "Social Media (Touchpoint)",
          typ: "Touchpoint",
          beschreibung: [
            "Reels / kurze Videos",
            "Snackable Content",
            "Trend- & Community-Bezug",
            "Teilen & Speichern",
          ],
        },
      ],
    },
  },
  {
    name: "Sabine",
    type: "Sicherheitsorientierte",
    category: "Selten, aber gezielt",
    image_url: `${IMG}/Sabine.png`,
    data: {
      kurzprofil: {
        alter: 53,
        geschlecht: "weiblich",
        familie: "verheiratet",
        bildung: "Fachhochschulreife",
        beruf: "Pflegehelferin als Teilzeit",
        eigenschaften: [
          "Strukturiert, fürsorglich, familienorientiert",
          "Stark regional verwurzelt",
          "Verbringt viel Zeit im Garten und achtet auf ihre Gesundheit",
          "Frischgebackene Großmutter",
          "Kulturinteressiert",
        ],
      },
      markentreue: [
        { marke: "Nordkurier", wohnort: "Malchow", einkommen: "1.600 € brutto" },
        { marke: "Schwäbische", wohnort: "Ummendorf", einkommen: "2.200 € brutto" },
      ],
      zitat: "Ich kenne meinen Ort - und bin mittendrin.",
      beduerfnisseMotive: [
        '„Alles an einem Fleck" finden',
        "Regional und lokal gut informiert sein – ohne Überforderung",
        "Saisonale & alltagsnahe Themen: Garten, Heimwerken, Kochen, Veranstaltungen",
        "Bestätigung & Orientierung in unsicheren Zeiten",
      ],
      kerneigenschaften: [
        { name: "News-Interesse", wert: 3 },
        { name: "Medien-Devices", wert: 2 },
        { name: "Anzahl Abos", wert: 2 },
        { name: "Social Media Aktivität", wert: 2 },
        { name: "Regionale Verbundenheit", wert: 5 },
      ],
      emotionaleTreiber: [
        "Struktur & Ordnung – ein klar organisierter Alltag gibt Sicherheit",
        "Familiäre Verbundenheit – Nähe und Austausch mit Familie aktiv pflegen",
        "Stabilität & Übersicht – Orientierung statt Chaos",
        "Verlässliche Routinen – feste Abläufe geben Halt",
      ],
      emotionaleSegmente: {
        hauptsegment: "Sicherheit",
        sekundaereSegmente: "Komfort, Gemeinschaft",
        kurzbegruendung: "Struktur, Stabilität, vertraute Umgebung",
      },
      produktFit: [
        {
          produkt: "Website (Produkt)",
          typ: "Produkt",
          beschreibung: [
            "Klassische Navigation",
            "Lokale Berichte & Vereinsnews",
            "Veranstaltungskalender",
            "Service- & Ratgeberthemen",
            "Saisonale Inhalte (Garten, Rezepte, Spar-Tipps)",
            "Keine technische Überforderung",
            "Bequeme, klar strukturierte und positive News-Aufbereitung",
          ],
        },
        {
          produkt: "Classic App (zukünftig)",
          typ: "Produkt",
          beschreibung: [
            "Reduzierte Startseite",
            "Klare Struktur",
            "Wenige, relevante Pushes",
            "Sanfte Einführung in mobile Nutzung",
          ],
        },
      ],
    },
  },
  {
    name: "Theodor-Konstantin",
    type: "Traditionsbewusst",
    category: "Linear-nah & ruhig",
    image_url: `${IMG}/Theodor-Konstantin.png`,
    data: {
      kurzprofil: {
        alter: 65,
        geschlecht: "männlich",
        familie: "verheiratet, 4 Kinder, 9 Enkel",
        bildung: "Pensionär, Oberstleutnant a.D.",
        beruf: "Pensionär",
        eigenschaften: [
          "Strukturiert, pflichtbewusst, hierarchieorientiert",
          "Stark lokal vernetzt (Verein, Ehrenamt, Vorstand)",
          "Familienmensch, gesellig, heimatverbunden",
          "Mag klare Meinungen & sachliche Kommentare",
        ],
      },
      markentreue: [
        { marke: "Nordkurier", wohnort: "Hagenow", einkommen: "4.900 € brutto" },
        { marke: "Schwäbische", wohnort: "Wangen", einkommen: "4.900 € brutto" },
      ],
      zitat: "Meine Heimat - in gedruckter Form.",
      beduerfnisseMotive: [
        "Feste Lesezeit & Gewohnheit",
        "Lokale Vereins- & Gemeindethemen, Sport",
        "Heimatinfos & amtliche Mitteilungen",
        "Wetterinfos",
        "Tagesbriefing / Auto- & Regionalthemen",
        "Sachliche Kommentare & klare Haltung",
      ],
      kerneigenschaften: [
        { name: "News-Interesse", wert: 4 },
        { name: "Medien-Devices", wert: 2 },
        { name: "Anzahl Abos", wert: 4 },
        { name: "Social Media Aktivität", wert: 1 },
        { name: "Regionale Verbundenheit", wert: 5 },
      ],
      emotionaleTreiber: [
        "Selbstbestimmung – Technik soll unterstützen, nicht bestimmen",
        "Anerkennung & Respekt – gehört und ernst genommen werden",
        "Bedeutung & Verantwortung – aktiv gebraucht werden und Einfluss behalten",
        "Sachlicher Diskurs – klare, respektvolle und fundierte Diskussionen führen",
      ],
      emotionaleSegmente: {
        hauptsegment: "Gemeinschaft",
        sekundaereSegmente: "Qualität, Relevanz / Trendstatus",
        kurzbegruendung: "Lokale Verbundenheit, Diskurs, Haltung",
      },
      produktFit: [
        {
          produkt: "Zeitung (Produkt)",
          typ: "Produkt",
          beschreibung: [
            "Gedruckte Struktur & Ritual",
            "Lokale Berichte & Vereinsnews",
            "Leserbriefe & Kommentare",
            "Wetter, Regionalwirtschaft, Gemeinde",
            "Haptik & Gewohnheit als Mehrwert",
            "Strukturierte, klassische und meinungsstarke News-Aufbereitung",
          ],
        },
      ],
    },
  },
  {
    name: "Vera",
    type: "Verantwortungsvolle",
    category: "Linear-nah & ruhig",
    image_url: `${IMG}/Vera.png`,
    data: {
      kurzprofil: {
        alter: 61,
        geschlecht: "weiblich",
        familie: "verheiratet",
        bildung: "Hauptschulabschluss",
        beruf: "Facharbeiterin in der Textiltechnik",
        eigenschaften: [
          "2 Töchter, 1 Enkelkind",
          "Lebt mit Mann (gerade Renteneintritt) und jüngerer Tochter in einer Mietwohnung",
          "Pflichtbewusst, familiär, vorsichtig im Digitalen",
          "Hilfsbereit, empathisch, strukturorientiert",
          'Möchte „mithalten", aber ohne Überforderung',
          "Ist im Heimatverein für Näharbeiten beschäftigt",
        ],
      },
      markentreue: [
        { marke: "Nordkurier", wohnort: "Teterow", einkommen: "3.100 € brutto" },
        { marke: "Schwäbische", wohnort: "Ehingen", einkommen: "3.900 € brutto" },
      ],
      zitat: "Lokal verbunden – ganz in meinem Tempo.",
      beduerfnisseMotive: [
        "Zeitung in gewohnter Struktur lesen",
        "Regionale und lokale Nachrichten am Morgen und Abend",
        "Themen für Familie & Enkel",
        "Ratgeber (Gesundheit, DIY, Kochen, Veranstaltungen Alltag, Wetter, TV-Tipps, Promis)",
      ],
      kerneigenschaften: [
        { name: "News-Interesse", wert: 4 },
        { name: "Medien-Devices", wert: 2 },
        { name: "Anzahl Abos", wert: 3 },
        { name: "Social Media Aktivität", wert: 1 },
        { name: "Regionale Verbundenheit", wert: 5 },
      ],
      emotionaleTreiber: [
        "Digitale Sicherheit – neue Anwendungen Schritt für Schritt verstehen",
        "Vertrauensgefühl – sich online geschützt und gut aufgehoben fühlen",
        "Überschaubarkeit – klare, einfache digitale Strukturen",
        "Selbstständigkeit bewahren – eigenständig informiert und handlungsfähig bleiben",
      ],
      emotionaleSegmente: {
        hauptsegment: "Komfort",
        sekundaereSegmente: "Sicherheit, Verständnis",
        kurzbegruendung: "Stressfreie Nutzung, Schritt-für-Schritt-Orientierung",
      },
      produktFit: [
        {
          produkt: "E-Paper (Produkt)",
          typ: "Produkt",
          beschreibung: [
            "Gewohnte Zeitungsstruktur (wie Print)",
            "Feste Lesezeit",
            "Übersichtliche Seiten",
            "Großes Schriftbild",
            "Sicherheit durch Bekanntheit",
            "Rätsel, Quiz und Prospekte",
            "Vertrauensvolle, klare und unterstützende News-Aufbereitung",
          ],
        },
        {
          produkt: "Classic App (zukünftig)",
          typ: "Produkt",
          beschreibung: [
            "Ergänzend für aktuelle Meldungen",
            "Wenige, klare Pushes",
            "Einfache Navigation",
            "Regionale Inhalte priorisiert",
          ],
        },
      ],
    },
  },
];
