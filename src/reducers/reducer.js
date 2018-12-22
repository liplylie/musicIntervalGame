import { combineReducers } from "redux";
import game from "./gameReducer.js";
import alarm from "./alarmReducer.js";


const reducer = combineReducers({
  alarm,
  game
});

export default reducer;
