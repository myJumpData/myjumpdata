import { useEffect } from "react";
import undraw_terms from "../assets/undraw_terms_re_6ak4.svg";
import { setRoute } from "../redux/route.action";
import { TermsSection, TermsText } from "./TermsScreen";

export default function LegalScreen() {
  useEffect(() => {
    setRoute("");
  }, []);

  return (
    <>
      <Jumbotron />
      <Main />
    </>
  );

  function Jumbotron() {
    return (
      <div className="container mx-auto flex flex-col flex-wrap items-center px-3 md:flex-row">
        <div className="flex w-full flex-col items-start justify-center text-center md:w-3/5 md:text-left">
          <p className="tracking-loose w-full">Trust & Legal</p>
          <h1 className="my-4 w-full text-2xl font-bold leading-tight lg:text-4xl">
            Legal Notice
          </h1>
        </div>
        <div className="w-full text-center md:w-2/5">
          <img src={undraw_terms} alt="Terms" />
        </div>
      </div>
    );
  }

  function Main() {
    return (
      <div>
        <TermsText>Stand: 21. Januar 2022</TermsText>
        <TermsSection heading="Information according to § 5 TMG">
          <TermsText>
            Marko Fediv
            <br />
            Cranachstr. 12i
            <br />
            63452 Hanau
          </TermsText>
        </TermsSection>
        <TermsSection heading="Contact">
          <TermsText>
            Phone: <a href="tel:017682763899">017682763899</a>
            <br />
            Email:{" "}
            <a href="mailto:marko.fediv@gmail.com">marko.fediv@gmail.com</a>
          </TermsText>
        </TermsSection>
        <TermsSection heading="Einleitung">
          <TermsText>
            Mit der folgenden Datenschutzerklärung möchten wir Sie darüber
            aufklären, welche Arten Ihrer personenbezogenen Daten (nachfolgend
            auch kurz als "Daten“ bezeichnet) wir zu welchen Zwecken und in
            welchem Umfang im Rahmen der Bereitstellung unserer Applikation
            verarbeiten.
          </TermsText>
          <TermsText>
            Die verwendeten Begriffe sind nicht geschlechtsspezifisch.
          </TermsText>
        </TermsSection>
        <TermsSection heading="Übersicht der Verarbeitungen">
          <TermsText>
            Die nachfolgende Übersicht fasst die Arten der verarbeiteten Daten
            und die Zwecke ihrer Verarbeitung zusammen und verweist auf die
            betroffenen Personen.
          </TermsText>
        </TermsSection>
        <TermsSection heading="Arten der verarbeiteten Daten">
          <TermsText>
            - Bestandsdaten.
            <br /> - Kontaktdaten.
            <br /> - Inhaltsdaten.
            <br /> - Nutzungsdaten.
            <br /> - Meta-/Kommunikationsdaten.
          </TermsText>
        </TermsSection>
        <TermsSection heading="Kategorien betroffener Personen">
          <TermsText>Nutzer</TermsText>
        </TermsSection>
        <TermsSection heading="Zwecke der Verarbeitung">
          <TermsText>
            <ul>
              <li>Erbringung vertraglicher Leistungen und Kundenservice.</li>
              <li>.</li>
              <li>Verwaltung und Beantwortung von Anfragen.</li>
              <li>
                Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit.
              </li>
            </ul>
          </TermsText>
        </TermsSection>
        <TermsSection heading="Maßgebliche Rechtsgrundlagen">
          <TermsText>
            Im Folgenden erhalten Sie eine Übersicht der Rechtsgrundlagen der
            DSGVO, auf deren Basis wir personenbezogene Daten verarbeiten. Bitte
            nehmen Sie zur Kenntnis, dass neben den Regelungen der DSGVO
            nationale Datenschutzvorgaben in Ihrem bzw. unserem Wohn- oder
            Sitzland gelten können. Sollten ferner im Einzelfall speziellere
            Rechtsgrundlagen maßgeblich sein, teilen wir Ihnen diese in der
            Datenschutzerklärung mit.
          </TermsText>
          <ul>
            <li>
              <strong>
                Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S.
                1 lit. b. DSGVO)
              </strong>{" "}
              - Die Verarbeitung ist für die Erfüllung eines Vertrags, dessen
              Vertragspartei die betroffene Person ist, oder zur Durchführung
              vorvertraglicher Maßnahmen erforderlich, die auf Anfrage der
              betroffenen Person erfolgen.
            </li>
            <li>
              <strong>
                Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f. DSGVO)
              </strong>{" "}
              - Die Verarbeitung ist zur Wahrung der berechtigten Interessen des
              Verantwortlichen oder eines Dritten erforderlich, sofern nicht die
              Interessen oder Grundrechte und Grundfreiheiten der betroffenen
              Person, die den Schutz personenbezogener Daten erfordern,
              überwiegen.
            </li>
          </ul>
          <TermsText>
            Zusätzlich zu den Datenschutzregelungen der
            Datenschutz-Grundverordnung gelten nationale Regelungen zum
            Datenschutz in Deutschland. Hierzu gehört insbesondere das Gesetz
            zum Schutz vor Missbrauch personenbezogener Daten bei der
            Datenverarbeitung (Bundesdatenschutzgesetz – BDSG). Das BDSG enthält
            insbesondere Spezialregelungen zum Recht auf Auskunft, zum Recht auf
            Löschung, zum Widerspruchsrecht, zur Verarbeitung besonderer
            Kategorien personenbezogener Daten, zur Verarbeitung für andere
            Zwecke und zur Übermittlung sowie automatisierten
            Entscheidungsfindung im Einzelfall einschließlich Profiling. Des
            Weiteren regelt es die Datenverarbeitung für Zwecke des
            Beschäftigungsverhältnisses (§ 26 BDSG), insbesondere im Hinblick
            auf die Begründung, Durchführung oder Beendigung von
            Beschäftigungsverhältnissen sowie die Einwilligung von
            Beschäftigten. Ferner können Landesdatenschutzgesetze der einzelnen
            Bundesländer zur Anwendung gelangen.
          </TermsText>
        </TermsSection>
        <TermsSection heading="Sicherheitsmaßnahmen">
          <TermsText>
            Wir treffen nach Maßgabe der gesetzlichen Vorgaben unter
            Berücksichtigung des Stands der Technik, der Implementierungskosten
            und der Art, des Umfangs, der Umstände und der Zwecke der
            Verarbeitung sowie der unterschiedlichen
            Eintrittswahrscheinlichkeiten und des Ausmaßes der Bedrohung der
            Rechte und Freiheiten natürlicher Personen geeignete technische und
            organisatorische Maßnahmen, um ein dem Risiko angemessenes
            Schutzniveau zu gewährleisten.
          </TermsText>
          <TermsText>
            Zu den Maßnahmen gehören insbesondere die Sicherung der
            Vertraulichkeit, Integrität und Verfügbarkeit von Daten durch
            Kontrolle des physischen und elektronischen Zugangs zu den Daten als
            auch des sie betreffenden Zugriffs, der Eingabe, der Weitergabe, der
            Sicherung der Verfügbarkeit und ihrer Trennung. Des Weiteren haben
            wir Verfahren eingerichtet, die eine Wahrnehmung von
            Betroffenenrechten, die Löschung von Daten und Reaktionen auf die
            Gefährdung der Daten gewährleisten. Ferner berücksichtigen wir den
            Schutz personenbezogener Daten bereits bei der Entwicklung bzw.
            Auswahl von Hardware, Software sowie Verfahren entsprechend dem
            Prinzip des Datenschutzes, durch Technikgestaltung und durch
            datenschutzfreundliche Voreinstellungen.
          </TermsText>
          <TermsText>
            SSL-Verschlüsselung (https): Um Ihre via unserem Online-Angebot
            übermittelten Daten zu schützen, nutzen wir eine
            SSL-Verschlüsselung. Sie erkennen derart verschlüsselte Verbindungen
            an dem Präfix https:// in der Adresszeile Ihres Browsers.
          </TermsText>
        </TermsSection>
        <TermsSection heading="Löschung von Daten">
          <TermsText>
            Die von uns verarbeiteten Daten werden nach Maßgabe der gesetzlichen
            Vorgaben gelöscht, sobald deren zur Verarbeitung erlaubten
            Einwilligungen widerrufen werden oder sonstige Erlaubnisse entfallen
            (z.B. wenn der Zweck der Verarbeitung dieser Daten entfallen ist
            oder sie für den Zweck nicht erforderlich sind).
          </TermsText>
          <TermsText>
            Sofern die Daten nicht gelöscht werden, weil sie für andere und
            gesetzlich zulässige Zwecke erforderlich sind, wird deren
            Verarbeitung auf diese Zwecke beschränkt. D.h., die Daten werden
            gesperrt und nicht für andere Zwecke verarbeitet. Das gilt z.B. für
            Daten, die aus handels- oder steuerrechtlichen Gründen aufbewahrt
            werden müssen oder deren Speicherung zur Geltendmachung, Ausübung
            oder Verteidigung von Rechtsansprüchen oder zum Schutz der Rechte
            einer anderen natürlichen oder juristischen Person erforderlich ist.
          </TermsText>
          <TermsText>
            Unsere Datenschutzhinweise können ferner weitere Angaben zu der
            Aufbewahrung und Löschung von Daten beinhalten, die für die
            jeweiligen Verarbeitungen vorrangig gelten.
          </TermsText>
        </TermsSection>
        <TermsSection heading="Bereitstellung des Onlineangebotes und Webhosting">
          <TermsText>
            Um unser Onlineangebot sicher und effizient bereitstellen zu können,
            nehmen wir die Leistungen von einem oder mehreren
            Webhosting-Anbietern in Anspruch, von deren Servern (bzw. von ihnen
            verwalteten Servern) das Onlineangebot abgerufen werden kann. Zu
            diesen Zwecken können wir Infrastruktur- und
            Plattformdienstleistungen, Rechenkapazität, Speicherplatz und
            Datenbankdienste sowie Sicherheitsleistungen und technische
            Wartungsleistungen in Anspruch nehmen.
          </TermsText>
          <TermsText>
            Zu den im Rahmen der Bereitstellung des Hostingangebotes
            verarbeiteten Daten können alle die Nutzer unseres Onlineangebotes
            betreffenden Angaben gehören, die im Rahmen der Nutzung und der
            Kommunikation anfallen. Hierzu gehören regelmäßig die IP-Adresse,
            die notwendig ist, um die Inhalte von Onlineangeboten an Browser
            ausliefern zu können, und alle innerhalb unseres Onlineangebotes
            oder von Webseiten getätigten Eingaben.
          </TermsText>
          <ul className="m-elements">
            <li>
              <strong>Verarbeitete Datenarten:</strong> Inhaltsdaten (z.B.
              Eingaben in Onlineformularen); Nutzungsdaten (z.B. besuchte
              Webseiten, Interesse an Inhalten, Zugriffszeiten);
              Meta-/Kommunikationsdaten (z.B. Geräte-Informationen,
              IP-Adressen).
            </li>
            <li>
              <strong>Betroffene Personen:</strong> Nutzer (z.B.
              Webseitenbesucher, Nutzer von Onlinediensten).
            </li>
            <li>
              <strong>Zwecke der Verarbeitung:</strong> Bereitstellung unseres
              Onlineangebotes und Nutzerfreundlichkeit.
            </li>
            <li>
              <strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (Art. 6
              Abs. 1 S. 1 lit. f. DSGVO).
            </li>
          </ul>
          <TermsText>
            <strong>
              Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und
              Diensten:
            </strong>
          </TermsText>
          <ul className="m-elements">
            <li>
              <strong>Erhebung von Zugriffsdaten und Logfiles: </strong>Wir
              selbst (bzw. unser Webhostinganbieter) erheben Daten zu jedem
              Zugriff auf den Server (sogenannte Serverlogfiles). Zu den
              Serverlogfiles können die Adresse und Name der abgerufenen
              Webseiten und Dateien, Datum und Uhrzeit des Abrufs, übertragene
              Datenmengen, Meldung über erfolgreichen Abruf, Browsertyp nebst
              Version, das Betriebssystem des Nutzers, Referrer URL (die zuvor
              besuchte Seite) und im Regelfall IP-Adressen und der anfragende
              Provider gehören. Die Serverlogfiles können zum einen zu Zwecken
              der Sicherheit eingesetzt werden, z.B., um eine Überlastung der
              Server zu vermeiden (insbesondere im Fall von missbräuchlichen
              Angriffen, sogenannten DDoS-Attacken) und zum anderen, um die
              Auslastung der Server und ihre Stabilität sicherzustellen;{" "}
              <strong>Löschung von Daten:</strong> Logfile-Informationen werden
              für die Dauer von maximal 30 Tagen gespeichert und danach gelöscht
              oder anonymisiert. Daten, deren weitere Aufbewahrung zu
              Beweiszwecken erforderlich ist, sind bis zur endgültigen Klärung
              des jeweiligen Vorfalls von der Löschung ausgenommen.
            </li>
          </ul>
        </TermsSection>
        <TermsSection heading="Registrierung, Anmeldung und Nutzerkonto">
          <TermsText>
            Nutzer können ein Nutzerkonto anlegen. Im Rahmen der Registrierung
            werden den Nutzern die erforderlichen Pflichtangaben mitgeteilt und
            zu Zwecken der Bereitstellung des Nutzerkontos auf Grundlage
            vertraglicher Pflichterfüllung verarbeitet. Zu den verarbeiteten
            Daten gehören insbesondere die Login-Informationen (Nutzername,
            Passwort sowie eine E-Mail-Adresse).
          </TermsText>
          <TermsText>
            Im Rahmen der Inanspruchnahme unserer Registrierungs- und
            Anmeldefunktionen sowie der Nutzung des Nutzerkontos speichern wir
            die IP-Adresse und den Zeitpunkt der jeweiligen Nutzerhandlung. Die
            Speicherung erfolgt auf Grundlage unserer berechtigten Interessen
            als auch jener der Nutzer an einem Schutz vor Missbrauch und
            sonstiger unbefugter Nutzung. Eine Weitergabe dieser Daten an Dritte
            erfolgt grundsätzlich nicht, es sei denn, sie ist zur Verfolgung
            unserer Ansprüche erforderlich oder es besteht eine gesetzliche
            Verpflichtung hierzu.
          </TermsText>
          <TermsText>
            Die Nutzer können über Vorgänge, die für deren Nutzerkonto relevant
            sind, wie z.B. technische Änderungen, per E-Mail informiert werden.
          </TermsText>
          <ul className="m-elements">
            <li>
              <strong>Verarbeitete Datenarten:</strong> Bestandsdaten (z.B.
              Namen, Adressen); Kontaktdaten (z.B. E-Mail, Telefonnummern);
              Inhaltsdaten (z.B. Eingaben in Onlineformularen);
              Meta-/Kommunikationsdaten (z.B. Geräte-Informationen,
              IP-Adressen).
            </li>
            <li>
              <strong>Betroffene Personen:</strong> Nutzer (z.B.
              Webseitenbesucher, Nutzer von Onlinediensten).
            </li>
            <li>
              <strong>Zwecke der Verarbeitung:</strong> Erbringung vertraglicher
              Leistungen und Kundenservice; Sicherheitsmaßnahmen; Verwaltung und
              Beantwortung von Anfragen.
            </li>
            <li>
              <strong>Rechtsgrundlagen:</strong> Vertragserfüllung und
              vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b. DSGVO);
              Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f. DSGVO).
            </li>
          </ul>
          <TermsText>
            <strong>
              Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und
              Diensten:
            </strong>
          </TermsText>
          <ul className="m-elements">
            <li>
              <strong>Registrierung mit Klarnamen: </strong>Aufgrund der Natur
              unserer Community bitten wir die Nutzer unser Angebot nur unter
              Verwendung von Klarnamen zu nutzen. D.h. die Nutzung von
              Pseudonymen ist nicht zulässig.
            </li>
            <li>
              <strong>Löschung von Daten nach Kündigung: </strong>Wenn Nutzer
              ihr Nutzerkonto gekündigt haben, werden deren Daten im Hinblick
              auf das Nutzerkonto, vorbehaltlich einer gesetzlichen Erlaubnis,
              Pflicht oder Einwilligung der Nutzer, gelöscht.
            </li>
            <li>
              <strong>Keine Aufbewahrungspflicht für Daten: </strong>Es obliegt
              den Nutzern, ihre Daten bei erfolgter Kündigung vor dem
              Vertragsende zu sichern. Wir sind berechtigt, sämtliche während
              der Vertragsdauer gespeicherte Daten des Nutzers unwiederbringlich
              zu löschen.
            </li>
          </ul>
        </TermsSection>
        <TermsSection heading="Änderung und Aktualisierung der Datenschutzerklärung">
          <TermsText>
            Wir bitten Sie, sich regelmäßig über den Inhalt unserer
            Datenschutzerklärung zu informieren. Wir passen die
            Datenschutzerklärung an, sobald die Änderungen der von uns
            durchgeführten Datenverarbeitungen dies erforderlich machen. Wir
            informieren Sie, sobald durch die Änderungen eine
            Mitwirkungshandlung Ihrerseits (z.B. Einwilligung) oder eine
            sonstige individuelle Benachrichtigung erforderlich wird.
          </TermsText>
          <TermsText>
            Sofern wir in dieser Datenschutzerklärung Adressen und
            Kontaktinformationen von Unternehmen und Organisationen angeben,
            bitten wir zu beachten, dass die Adressen sich über die Zeit ändern
            können und bitten die Angaben vor Kontaktaufnahme zu prüfen.
          </TermsText>
        </TermsSection>
        <TermsSection heading="Rechte der betroffenen Personen">
          <TermsText>
            Ihnen stehen als Betroffene nach der DSGVO verschiedene Rechte zu,
            die sich insbesondere aus Art. 15 bis 21 DSGVO ergeben:
          </TermsText>
          <ul>
            <li>
              <strong>
                Widerspruchsrecht: Sie haben das Recht, aus Gründen, die sich
                aus Ihrer besonderen Situation ergeben, jederzeit gegen die
                Verarbeitung der Sie betreffenden personenbezogenen Daten, die
                aufgrund von Art. 6 Abs. 1 lit. e oder f DSGVO erfolgt,
                Widerspruch einzulegen; dies gilt auch für ein auf diese
                Bestimmungen gestütztes Profiling. Werden die Sie betreffenden
                personenbezogenen Daten verarbeitet, um Direktwerbung zu
                betreiben, haben Sie das Recht, jederzeit Widerspruch gegen die
                Verarbeitung der Sie betreffenden personenbezogenen Daten zum
                Zwecke derartiger Werbung einzulegen; dies gilt auch für das
                Profiling, soweit es mit solcher Direktwerbung in Verbindung
                steht.
              </strong>
            </li>
            <li>
              <strong>Widerrufsrecht bei Einwilligungen:</strong> Sie haben das
              Recht, erteilte Einwilligungen jederzeit zu widerrufen.
            </li>
            <li>
              <strong>Auskunftsrecht:</strong> Sie haben das Recht, eine
              Bestätigung darüber zu verlangen, ob betreffende Daten verarbeitet
              werden und auf Auskunft über diese Daten sowie auf weitere
              Informationen und Kopie der Daten entsprechend den gesetzlichen
              Vorgaben.
            </li>
            <li>
              <strong>Recht auf Berichtigung:</strong> Sie haben entsprechend
              den gesetzlichen Vorgaben das Recht, die Vervollständigung der Sie
              betreffenden Daten oder die Berichtigung der Sie betreffenden
              unrichtigen Daten zu verlangen.
            </li>
            <li>
              <strong>
                Recht auf Löschung und Einschränkung der Verarbeitung:
              </strong>{" "}
              Sie haben nach Maßgabe der gesetzlichen Vorgaben das Recht, zu
              verlangen, dass Sie betreffende Daten unverzüglich gelöscht
              werden, bzw. alternativ nach Maßgabe der gesetzlichen Vorgaben
              eine Einschränkung der Verarbeitung der Daten zu verlangen.
            </li>
            <li>
              <strong>Recht auf Datenübertragbarkeit:</strong> Sie haben das
              Recht, Sie betreffende Daten, die Sie uns bereitgestellt haben,
              nach Maßgabe der gesetzlichen Vorgaben in einem strukturierten,
              gängigen und maschinenlesbaren Format zu erhalten oder deren
              Übermittlung an einen anderen Verantwortlichen zu fordern.
            </li>
            <li>
              <strong>Beschwerde bei Aufsichtsbehörde:</strong> Sie haben
              unbeschadet eines anderweitigen verwaltungsrechtlichen oder
              gerichtlichen Rechtsbehelfs das Recht auf Beschwerde bei einer
              Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres
              gewöhnlichen Aufenthaltsorts, ihres Arbeitsplatzes oder des Orts
              des mutmaßlichen Verstoßes, wenn Sie der Ansicht sind, dass die
              Verarbeitung der Sie betreffenden personenbezogenen Daten gegen
              die Vorgaben der DSGVO verstößt.
            </li>
          </ul>
        </TermsSection>
        <TermsSection heading="Begriffsdefinitionen">
          <TermsText>
            In diesem Abschnitt erhalten Sie eine Übersicht über die in dieser
            Datenschutzerklärung verwendeten Begrifflichkeiten. Viele der
            Begriffe sind dem Gesetz entnommen und vor allem im Art. 4 DSGVO
            definiert. Die gesetzlichen Definitionen sind verbindlich. Die
            nachfolgenden Erläuterungen sollen dagegen vor allem dem Verständnis
            dienen. Die Begriffe sind alphabetisch sortiert.
          </TermsText>
          <TermsText>
            <li>
              <strong>Personenbezogene Daten:</strong> "Personenbezogene Daten“
              sind alle Informationen, die sich auf eine identifizierte oder
              identifizierbare natürliche Person (im Folgenden "betroffene
              Person“) beziehen; als identifizierbar wird eine natürliche Person
              angesehen, die direkt oder indirekt, insbesondere mittels
              Zuordnung zu einer Kennung wie einem Namen, zu einer Kennnummer,
              zu Standortdaten, zu einer Online-Kennung (z.B. Cookie) oder zu
              einem oder mehreren besonderen Merkmalen identifiziert werden
              kann, die Ausdruck der physischen, physiologischen, genetischen,
              psychischen, wirtschaftlichen, kulturellen oder sozialen Identität
              dieser natürlichen Person sind.{" "}
            </li>
            <li>
              <strong>Verantwortlicher:</strong> Als "Verantwortlicher“ wird die
              natürliche oder juristische Person, Behörde, Einrichtung oder
              andere Stelle, die allein oder gemeinsam mit anderen über die
              Zwecke und Mittel der Verarbeitung von personenbezogenen Daten
              entscheidet, bezeichnet.{" "}
            </li>
            <li>
              <strong>Verarbeitung:</strong> "Verarbeitung" ist jeder mit oder
              ohne Hilfe automatisierter Verfahren ausgeführte Vorgang oder jede
              solche Vorgangsreihe im Zusammenhang mit personenbezogenen Daten.
              Der Begriff reicht weit und umfasst praktisch jeden Umgang mit
              Daten, sei es das Erheben, das Auswerten, das Speichern, das
              Übermitteln oder das Löschen.
            </li>
          </TermsText>
        </TermsSection>
        <TermsSection heading="">
          <TermsText>
            <a
              href="https://datenschutz-generator.de/"
              title="Rechtstext von Dr. Schwenke - für weitere Informationen bitte anklicken."
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              Erstellt mit kostenlosem Datenschutz-Generator.de von Dr. Thomas
              Schwenke
            </a>
          </TermsText>
        </TermsSection>
      </div>
    );
  }
}
