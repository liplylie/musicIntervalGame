import { combineReducers } from "redux";
import game from "./gameReducer.js";

const reducer = combineReducers({
  game: game
});

export default reducer;
