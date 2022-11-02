

const initialState = {
  firstName: "",
  lastName:"",
}

export default (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        firstName:action.payload.firstName,
        lastName: action.payload.lastName,
      };
    
    default:
      return state;
  }
};