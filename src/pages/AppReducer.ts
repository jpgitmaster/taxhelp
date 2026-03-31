interface AppState {
    success_registration: boolean
}

type Action = 
    | { type: 'SUCCESS_REGISTRATION'; payload: { success_registration: boolean } }

const AppReducer = (state: AppState, action: Action) => {
    switch (action.type) {
        case 'SUCCESS_REGISTRATION':
            const { success_registration } = action.payload
            return {
                ...state,
                success_registration: success_registration
            }
        default:
            return state
    }
}

export default AppReducer