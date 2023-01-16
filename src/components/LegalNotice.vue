<template>
  <v-card>
    <v-card-text class="mt-6">
      <h2 class="mb-4">Impressum</h2>
      <p>
        Die Regierung hat am 6. April 2021 die Verordnung zum VI.-Nachtrag Energiegesetz verabschiedet. Der
        Vollzugsbeginn ist der 1. Juli 2021. In der Verordnung werden u.a. die Einzelheiten zu der Vereinbarung über die
        Gewährleistung von Biogas oder Bioöl durch den Energielieferanten gemäss Art. 12e Bst. c des Energiegesetzes,
        sowie zur Ersatzabgabe für die Eigenstromerzeugung bei Neubauten gemäss Art. 5c des Energiegesetzes geregelt.
        Die Regelungen sehen unter anderem vor, dass die einzureichenden Daten vom Gesuchsteller in digitaler Form
        erfasst, in einem Bericht gedruckt und unterschrieben dem Baugesuch beizulegen sind. Dabei sollen die erfassten
        Angaben auch in digitaler Form gespeichert und den Gemeinden zur Prüfung übermittelt werden. Bewilligte Gesuche
        werden an den Kanton weitergeleitet und stehen für den weiteren Vollzug zur Verfügung. Mit dieser Webapplikation
        wird dies umgesetzt.
      </p>
      <p>
        Inhalt, Betrieb und Weiterentwicklung: Energiefachstelle des Kantons St.Gallen<br/>
        Umsetzung: <a href="https://sbkh.ch" target="_blank">Small Business Know How GmbH</a> / <a href="https://goelditechnology.ch" target="_blank">goeldi technology</a><br/>
        Beratung: <a href="https://sbkh.ch" target="_blank">Small Business Know How GmbH</a><br/>
        Technische Infrastruktur: <a href="https://abraxas.ch" target="_blank">Abraxas Informatik AG</a>
      </p>
      <h3 class="pb-2">Haftungshinweis</h3>
      <p>
        Der Kanton St.Gallen stellt den Gemeinden die Inhalte und Funktionen dieser Applikation kostenlos zur Verfügung.
        Er übernimmt keine Haftung für Richtigkeit und Vollständigkeit der Informationen und Daten; diese stellen
        insbesondere keine rechtsverbindliche Auskunft des Kantons St.Gallen dar. Werden aufgrund dieser Informationen
        dennoch Dispositionen getroffen, erfolgt dies auf eigene Verantwortung. Der Kanton St.Gallen übernimmt keine
        Haftung dafür, dass die Funktionen der Webapplikation fehlerlos sind, dass Fehler behoben werden oder dass diese
        Webapplikation bzw. der jeweilige Server frei ist von schädlichen Bestandteilen. Diese Webapplikation kann
        Verbindungen oder Bezüge (Links) zu anderen Websites aufweisen und greift auf externe Daten zu, die von Dritten
        in eigener Verantwortung eingerichtet wurden und betrieben bzw. gepflegt werden.
        <br/>
        Die Verfügbarkeit der Webapplikation erfolgt nach best-effort. Aufgrund von Wartungen oder Fehlern kann die
        Verfügbarkeit unterbrochen sein. Für die Pflege der Daten und die Richtigkeit der Datensätze sind die einzelnen
        Gemeinden verantwortlich.
        <br/>
        Der Kanton St.Gallen übernimmt keine Haftung für direkte oder indirekte Schäden materieller oder ideeller Art,
        die durch Nichtverfügbarkeit der Webapplikation, den Zugriff auf diese Webapplikation und ihre Inhalte bzw.
        darin verlinkte andere Websites und deren Inhalte sowie durch die Nutzung oder Nichtnutzung dieser Informationen
        bzw. durch die Nutzung fehlerhafter und unvollständiger Informationen und Daten auf dieser Webapplikation bzw.
        auf darin verlinkten anderen Websites verursacht werden.
      </p>
      <h3 class="pb-2">Sicherheitshinweis</h3>
      <p>
        Die Inhalte dieser Webapplikationen können falsch oder unvollständig übertragen werden. Der Kanton St.Gallen
        leistet keine Gewähr für Vertraulichkeit und Integrität der über diese Website ausgetauschten Daten sowie für
        die ständige und unbeschränkte Verfügbarkeit der Inhalte. Er behält sich das Recht vor, die Inhalte jederzeit
        ohne Begründung oder Vorankündigung zu ändern oder zu löschen.
      </p>
      <h3 class="pb-2">Datenschutz</h3>
      <p>
        Der grundsätzliche Zugriff auf die Webapplikation beschränkt sich auf die verantwortlichen Mitarbeiter des
        Kanton St.Gallen und die Mitarbeiter der Gemeinden des Kanton St.Gallen. Jede Gemeinde hat nur Zugriff auf die
        Daten, welche ihre Gemeinde betreffen. Die für die Webapplikation verantwortlichen Mitarbeiter des Kanton
        St.Gallen haben Zugriff auf alle Daten, welche in der Webapplikation erfasst sind.
        <br/>
        Die Aktivitäten innerhalb der Applikation werden zur Nachvollziehbarkeit von Änderungen vom System
        benutzerspezifisch erfasst und gespeichert. Auf Gemeindeebene kann das Aktivitäten-Protokoll ebenfalls
        eingesehen werden, wobei sich dann Aktivitäten ausschliesslich auf die eigene Gemeinde beschränken.
      </p>

      <h3 class="pb-2">Urheberrechte</h3>
      <p>
        Inhalt und Funktionalität dieser Webapplikation sind urheberrechtlich geschützt; alle Rechte sind vorbehalten.
        Das Copyright für auf dieser Webapplikation veröffentlichte, vom Kanton St.Gallen selbst erstellte Objekte
        bleiben allein beim Kanton St.Gallen.
      </p>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
          text
          @click="$emit('closeSheet')"
      >
        Schliessen
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'LegalNotice',
  props: [],
  components: {},
  data: function () {
    return {
      data: null
    }
  },
  mounted() {

  },
  watch: {},
  methods: {}
}
</script>

<style scoped>
</style>
