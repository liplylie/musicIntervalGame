const initialState = {
  alarms: []
};

const alarm = (state = initialState, action) => {
  switch (action.type) {
    case "addAlarm": {
      return { ...state, alarms: [...state.alarms, action.payload] };
    }
      case "editAlarm": {
          return {
              ...state, alarms: state.alarms.map(alarm => {
                  if (alarm.id === action.payload.id) {
                      alarm.activate = !alarm.activate;
                  }
                  return alarm;
              }) };
      }
    default: {
      return state;
    }
  }
};

export default alarm;
