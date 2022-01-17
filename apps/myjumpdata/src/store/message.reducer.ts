export interface MessageType {
  text: string;
  design?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  icon?: boolean;
}
const messageReducer = (
  state: MessageType = { text: '', design: 'primary', icon: true },
  action: any
) => {
  if (action.type === 'setMessage') {
    if (action.payload.text) {
      state.text = action.payload.text;
    }
    if (action.payload.design) {
      state.design = action.payload.design;
    }
    if (action.payload.icon) {
      state.icon = action.payload.icon;
    }
    return state;
  }
  return state;
};

export default messageReducer;
