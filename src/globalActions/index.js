import EventBus, { ACTIONS } from '../events/index'

export const showSnack = message => {
  EventBus.$emit(ACTIONS.SNACKBAR, message)
}
