import AppReducer from './AppReducer'
import { Dispatch, FC, ReactNode, createContext, useReducer} from 'react'

interface AppState {
    success_registration: boolean
}

interface AppProviderProps {
    children: ReactNode
}

type Action = 
    | { type: 'SUCCESS_REGISTRATION'; payload: { success_registration: boolean } }

export const AppContext = createContext<[AppState, Dispatch<Action>] | undefined>(undefined)

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
    const initialState = {
        success_registration: false
    }
    const [state, dispatch] = useReducer(AppReducer, initialState)
    return (
        <AppContext.Provider value={[state, dispatch]}>
            { children }
        </AppContext.Provider>
    )
}