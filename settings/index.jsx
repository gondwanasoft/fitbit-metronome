import { DUR_MIN, DUR_MAX } from '../companion/common'
import { TEMPO_MIN, TEMPO_MAX, SIG_MIN, SIG_MAX } from '../common/common'

const DUR_RANGE = `⚠ Duration must be between ${DUR_MIN} and ${DUR_MAX}`
const TEMPO_RANGE = `⚠ Tempo must be between ${TEMPO_MIN} and ${TEMPO_MAX}`
const SIG_RANGE = `⚠ Signature must be between ${SIG_MIN} and ${SIG_MAX}`

function mySettings(props) {
  function rangeCheck(value, min, max, invalidKey) {
    // value: onChange arg
    // min, max: range of allowable values (Number)
    // invalidKey: Settings key of element to display if out of range (String)
    const nbr = Number(value.name)
    const isValid = Number.isInteger(nbr) && nbr>=min && nbr<=max
    props.settingsStorage.setItem(invalidKey, isValid?'false':'true')
  }

  return (
    <Page>
      <Section title={<Text bold align="center">SESSION TIMER</Text>}>
        <TextInput
          label='Duration (minutes)'
          type='number'
          settingsKey='sessionDur'
          onChange = {value => rangeCheck(value, DUR_MIN, DUR_MAX, 'showInvalidDur')}
        />
        {props.settings.showInvalidDur !== 'true' ? null : (
          <Text bold>{DUR_RANGE}</Text>
        )}
        <Toggle
          settingsKey="down"
          label="Count down to 0"
        />
      </Section>
      <Section title={<Text bold align="center">METRONOME DISPLAY</Text>}>
        <Toggle
          settingsKey="flash"
          label="Flash"
        />
        <Toggle
          settingsKey="durInMetro"
          label="Show session timer"
        />
      </Section>
      <Section title={<Text bold align="center">METRONOME VIBRATION</Text>}>
        <Toggle
          settingsKey="vib"
          label="Vibrate"
        />
        <Toggle
          settingsKey="shortVib"
          label="Always use strongest vibration"
        />
      </Section>
      <Section title={<Text bold align="center">METRONOME PRESET 1</Text>}>
        <TextInput
          label='Label'
          settingsKey='label0'
        />
        <TextInput
          label='Tempo (beats per minute)'
          type='number'
          settingsKey='tempo0'
          onChange = {value => rangeCheck(value, TEMPO_MIN, TEMPO_MAX, 'showInvalidTempo0')}
        />
        {props.settings.showInvalidTempo0 !== 'true' ? null : (
          <Text bold>{TEMPO_RANGE}</Text>
        )}
        <TextInput
          label='Time signature (beats per bar)'
          type='number'
          settingsKey='sig0'
          onChange = {value => rangeCheck(value, SIG_MIN, SIG_MAX, 'showInvalidSig0')}
        />
        {props.settings.showInvalidSig0 !== 'true' ? null : (
          <Text bold>{SIG_RANGE}</Text>
        )}
      </Section>
      <Section title={<Text bold align="center">METRONOME PRESET 2</Text>}>
        <TextInput
          label='Label'
          settingsKey='label1'
        />
        <TextInput
          label='Tempo (beats per minute)'
          type='number'
          settingsKey='tempo1'
          onChange = {value => rangeCheck(value, TEMPO_MIN, TEMPO_MAX, 'showInvalidTempo1')}
        />
        {props.settings.showInvalidTempo1 !== 'true' ? null : (
          <Text bold>{TEMPO_RANGE}</Text>
        )}
        <TextInput
          label='Time signature (beats per bar)'
          type='number'
          settingsKey='sig1'
          onChange = {value => rangeCheck(value, SIG_MIN, SIG_MAX, 'showInvalidSig1')}
        />
        {props.settings.showInvalidSig1 !== 'true' ? null : (
          <Text bold>{SIG_RANGE}</Text>
        )}
      </Section>
      <Section title={<Text bold align="center">METRONOME PRESET 3</Text>}>
        <TextInput
          label='Label'
          settingsKey='label2'
        />
        <TextInput
          label='Tempo (beats per minute)'
          type='number'
          settingsKey='tempo2'
          onChange = {value => rangeCheck(value, TEMPO_MIN, TEMPO_MAX, 'showInvalidTempo2')}
        />
        {props.settings.showInvalidTempo2 !== 'true' ? null : (
          <Text bold>{TEMPO_RANGE}</Text>
        )}
        <TextInput
          label='Time signature (beats per bar)'
          type='number'
          settingsKey='sig2'
          onChange = {value => rangeCheck(value, SIG_MIN, SIG_MAX, 'showInvalidSig2')}
        />
        {props.settings.showInvalidSig2 !== 'true' ? null : (
          <Text bold>{SIG_RANGE}</Text>
        )}
      </Section>
      <Section title={<Text bold align="center">HELP</Text>}>
        <Text>See <Link source="https://gondwanasoftware.au/fitbit/products/metronome">Metronome’s web page</Link>.</Text>
      </Section>
    </Page>
  )
}

registerSettingsPage(mySettings)