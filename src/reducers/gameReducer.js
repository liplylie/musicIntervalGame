const initialState = {
    complete: true,
};

const game = (state = initialState, action) => {
    // console.log(action, "game reducer")
    switch (action.type) {
        case "complete": {
            return { ...state, complete: true };
        }
        default: {
            return state;
        }
    }
}

export default game;