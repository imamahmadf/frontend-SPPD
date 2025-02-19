import userTypes from "./Types/userTypes";

const init_state = {
  id: "",
  email: "",
  emailVerified: "",
  firebaseProviderId: "",
  amprahanOpen: 0,
  profileId: 0,
  //   TenantId: 0,
  //   TenantName: "",
  ProfileName: "",
  ProfilePic: "",
};

export default (state = init_state, action) => {
  switch (action.type) {
    case userTypes.Redux:
      console.log("Action diterima:", action);
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
