import { BrowserRouter, Routes, Route } from 'react-router-dom'
import axios from './config/axios'
import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import NavBar from './components/NavBar'
import NewPoll from './components/NewPoll'
import MyPolls from './components/MyPolls'
import PollShow from'./components/PollShow'
import userReducer from './reducers/user-reducer'
import pollsReducer from './reducers/polls-reducer'
import { useReducer, createContext, useEffect } from 'react'
import SinglePoll from './components/SinglePoll'

export const UserContext = createContext()
export const PollsContext = createContext()

export function App(){ 
    const [userState, userDispatch] = useReducer(userReducer, { user: {}, myPolls: [], myVotes: []})
    console.log('user state', userState)
    const [pollsState, pollsDispatch] = useReducer(pollsReducer, { activePolls: []})

    useEffect(() => {
        if(localStorage.getItem('token')) { // handling page reload
            (async () => {
                try {
                    const response = await axios.get('/api/users/account', {
                        headers: {
                            'Authorization' : localStorage.getItem('token')
                        }
                    })
                    userDispatch({ type: 'USER_LOGIN', payload: response.data })

                    const pollsResponse = await axios.get('/api/polls/mypolls', {
                        headers: {
                            'Authorization' : localStorage.getItem('token')
                        }
                    })
                    userDispatch({ type: 'SET_MY_POLLS', payload: pollsResponse.data})

                    const votesResponse = await axios.get('/api/votes/myvotes', {
                        headers: {
                            'Authorization': localStorage.getItem('token')
                        }
                    })
                    userDispatch({ type: 'SET_MY_VOTES', payload: votesResponse.data })
                } catch(e){
                    alert(e.message)
                }
            })()
        }

        (async () => {
            try {
                const pollsResponse = await axios.get('/api/polls/active') 
                const result = pollsResponse.data 
                pollsDispatch({ type: 'SET_ACTIVE_POLLS', payload: result })
            } catch(e) {
                alert(e.message)
            }
        })()

    }, [])
    
    return (
        <BrowserRouter>
            <UserContext.Provider value={{userState, userDispatch }}>
                <PollsContext.Provider value={{ pollsState, pollsDispatch}}>
                    <div>
                        <h1>Polling App</h1>
                        <NavBar />

                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route path='/dashboard' element={<Dashboard />} />
                            <Route path="/polls/new" element={<NewPoll />} />
                            <Route path='/polls/my-polls' element={<MyPolls />} />
                            <Route path="/mypolls/:id" element={<PollShow />} />
                            <Route path="/polls/:id" element={<SinglePoll />} />
                        </Routes>
                    </div>
                </PollsContext.Provider>
            </UserContext.Provider>
        </BrowserRouter>
    )
}


/*
    poor | below average | average | above average | expentional 
*/