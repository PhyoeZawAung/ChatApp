

const initialState = {
  firstName: "",
  lastName: "",
  nameAdded:false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        firstName:action.payload.firstName,
        lastName: action.payload.lastName,
        nameAdded:action.payload.nameAdded,
      };
    
    default:
      return state;
  }
};