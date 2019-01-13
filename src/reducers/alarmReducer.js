const initialState = {
  alarms: []
};

const alarm = (state = initialState, action) => {
  switch (action.type) {
    case "addAlarm": {
      return { ...state, alarms: [...state.alarms, action.payload] };
    }
      case "activateAlarm": {
          return {
              ...state, alarms: state.alarms.map(alarm => {
                  if (alarm.id == action.payload.id) {
                      alarm.active = action.payload.active;
                  }
                  return alarm;
              }) };
      }
      case "editAlarm": {
          return {
              ...state, alarms: state.alarms.map(alarm => {
                  if (alarm.id == action.payload.id) {
                      alarm = action.payload;
                  }
                  return alarm;
              })
          };
      }
      case "deleteAlarm": {
          return {
              ...state, alarms: state.alarms.filter(alarm => {
                  if (alarm.id != action.payload.id) {
                      return alarm;
                  }
              })
          };
      }
    default: {
      return state;
    }
  }
};

export default alarm;
