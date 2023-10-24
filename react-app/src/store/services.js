// CRUD constants
const SET_SERVICE = "services/SET_SERVICE";
const READ_SERVICE = "services/READ_SERVICE";
const READ_SERVICES = "services/READ_SERVICES";
const UPDATE_SERVICE = "services/UPDATE_SERVICE";
const DELETE_SERVICE = "services/DELETE_SERVICE";

// Action creators

const setService = (serviceData) => ({
  //Should send service data from the form
  type: SET_SERVICE,
  serviceData,
});

const readService = (service) => ({
  type: READ_SERVICE,
  service,
});

const readServices = (services) => ({
  type: READ_SERVICES,
  services,
});

const updateService = (serviceData) => ({
  type: UPDATE_SERVICE,
  serviceData,
});

const removeService = () => ({
  type: DELETE_SERVICE,
});

// const getImage = (images) => ({
//   type: GET_IMAGE,
//   images,
// });

// Thunks
// !!! Data handling is different with flask, review with team
// !!! Review all thunks with team, still work in progress
// !!! Review how we are handling errors
export const createServiceThunk = (serviceData) => async (dispatch) => {
  const response = await fetch("/api/services/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serviceData),
  });

  if (response.ok) {
    const data = await response.json();
    // if (data.errors){
    //     return
    // }
    dispatch(setService(data));
    return data; //*** return something?
  } else {
    return "Error";
  }
};

export const getServiceThunk = (serviceId) => async (dispatch) => {
  const response = await fetch(`/api/services/${serviceId}`, {
    methods: "GET",
  });

  if (response.ok) {
    // !!! What does the flask data look like?
    const data = await response.json();
    dispatch(readService(data));
  } else {
    return "Error";
  }
};

export const getServicesThunk = () => async (dispatch) => {
  const response = await fetch("/api/services", {
    methods: "GET",
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(readServices(data));
    return data;
  } else {
    return "Error";
  }
};

export const updateServiceThunk =
  (serviceData, serviceId) => async (dispatch) => {
    const response = await fetch(`/api/services/${serviceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serviceData),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(updateService(data));
      return data;
    } else {
      return "Error";
    }
  };

export const deleteServiceThunk = (serviceId) => async (dispatch) => {
  // Send an id, should be deleted in backend
  const response = await fetch(`/service/${serviceId}`, {
    methods: "DELETE",
  });

  // Update the store with dispatch action
  if (response.ok) {
    dispatch(removeService(serviceId));
  } else {
    return "Error";
  }
};

export const getUserServicesThunk = () => async (dispatch) => {
  const response = await fetch("/api/services/my-services");

  if (response.ok) {
    const data = await response.json();
    dispatch(readServices(data));
    return data;
  }
};

// !!! What should our state be?
const initialState = { services: {}, singleService: {} };

// Reducer
export default function servicesReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case SET_SERVICE:
      newState = { ...state };
      newState.singleService = action.serviceData;
      return newState;
    case READ_SERVICE:
      newState = { ...state };
      newState.singleService = action.service;
      return newState;
    case READ_SERVICES:
      newState = { ...state };
      action.services.services.forEach((service) => {
        newState.services[service.id] = service;
      });
      return newState;
    case UPDATE_SERVICE:
      newState = { ...state };
      newState.services[action.serviceData.id] = action.serviceData;
      return newState;
    case DELETE_SERVICE:
      return newState;
    // case GET_IMAGE:
    //   newState = { ...state };
    //   console.log("IMAGE ACTION", action);
    //   action.images.images.forEach((image) => {
    //     newState.services.serviceImages[image.id] = image;
    //   });
    default:
      return state;
  }
}
