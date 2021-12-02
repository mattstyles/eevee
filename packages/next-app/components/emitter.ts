import EventEmitter from 'eventemitter3'

// Global singleton, this is a hacky solution that should be handled by core
// to pass messages and respond etc
export default new EventEmitter()
