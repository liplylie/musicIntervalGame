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
                      console.log(action.payload, "titty")
                      alarm.active = action.payload.active;
                  }
                  return alarm;
              }) };
      }
      case "deleteAlarm": {
          return {
              ...state, alarms: state.alarms.filter(alarm => {
                  if (alarm.id !== action.payload.id) {
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
