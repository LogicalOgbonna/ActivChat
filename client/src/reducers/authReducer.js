import { SET_CURRENT_USER } from "../actions/types";
import _ from "lodash";

const initialState = {
  isAuthenticated: false,
  users: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !_.isEmpty(action.payload),
        user: action.payload
      };
    default:
      return state;
  }
}
