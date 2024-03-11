import { useEffect, useState } from 'react'
import './App.css'
import { getRequestBody, getToday } from './utils'
import Task from './components/Task'
import Dialog from './components/Dialog'
import { useAppStore } from './store'
import login from './assets/login.png';

function App() {
  const [openDialog, setOpenDialog] = useState(false)
  const todayTasks =  useAppStore((state) => state.todayTasks)
  const spacedRepetitionTasks = useAppStore((state) => state.spacedRepetitionTasks)
  const user = useAppStore((state) => state.user)
  const updateUser = useAppStore((state) => state.updateUser)
  const updateTodayTasks = useAppStore((state) => state.updateTodayTasks)
  const updateSpacedRepetitionsTasks = useAppStore((state) => state.updateSpacedRepetitionsTasks)
  const [username, setUsername] = useState('')
  const [isMobileTablet, setIsMobileTablet] = useState(window.innerWidth <= 768);

  useEffect(() => {
    if(user) {
        getSpacedRepetitionTasks();
        getTodayTasks();
    }
  }, [JSON.stringify(user)])

  useEffect(() => {
      const handleResize = () => {
          setIsMobileTablet(window.innerWidth <= 768);
      };
      window.addEventListener('resize', handleResize);
      return () => {
          window.removeEventListener('resize', handleResize);
      };
    }, [])

  const getSpacedRepetitionTasks = async () => {
    const queryParams = {
      userID: user._id,
      timeZoneOffset: new Date().getTimezoneOffset()
    }
    const url = new URL(import.meta.env.VITE_BASE_SERVER_URL + '/get-spaced-repetition')
    url.search = new URLSearchParams(queryParams).toString()
    const response = await fetch(url);
    if(response.status == 200) {
      const data = await response.json();
      if(data.tasks) {
        updateSpacedRepetitionsTasks(data.tasks)
      }
    }
  }
  
  const getTodayTasks = async () => {
    const queryParams = {
      userID: user._id,
      timeZoneOffset: new Date().getTimezoneOffset()
    }
    const url = new URL(import.meta.env.VITE_BASE_SERVER_URL + '/get-today-tasks')
    url.search = new URLSearchParams(queryParams).toString()
    const response = await fetch(url);
    if(response.status == 200) {
      const data = await response.json();
      if(data.tasks) {
        updateTodayTasks(data.tasks)
      }
    }
  }

  const createUser = async () => {
    const URL = import.meta.env.VITE_BASE_SERVER_URL + '/create-user'
    const fetchOptions = getRequestBody('POST', {username})
    const response = await fetch(URL, fetchOptions);
    const data = await response.json();
    if(data && data.user) {
      localStorage.setItem('todosr_user', JSON.stringify(data.user))
      updateUser(data.user)
      setUsername('')
    }
  }



  return (
    <>
      <main>
        <nav className='mb-2'>
        <h3 className='w-full text-center text-xl sm:text-2xl md:text-3xl mt-3 pb-1 border-b-nightblack border-b-2 font-sans'>{getToday()}</h3>
        </nav>
        {user && 
          <>
            {spacedRepetitionTasks.length > 0 &&
              <section className='flex flex-col items-center'>
                <section className='w-11/12 sm:w-5/6 md:w-2/3'>
                  <h4 className='self-start text-xl md:text-2xl border-l-4 border-l-lime-400 pl-2 mt-2'>Spaced Repetition</h4>
                  {isMobileTablet && <span className='text-xs pl-4 text-red-400'><i>Swipe Right on a Task to Delete</i></span>}
                  {spacedRepetitionTasks.map(item => (
                    <section key={item._id} className='flex justify-center'>
                      <Task task={item.task} taskStatus={item.completed} taskID={item._id} isMobileTablet={isMobileTablet}/>  
                    </section>
                  ))}
                </section>
                </section>
              }
            
              <section className='flex flex-col items-center'>
              <section className='w-11/12 sm:w-5/6 md:w-2/3'>
                <h4 className='self-start border-l-4 border-l-rose-400 pl-2 mt-2 text-xl md:text-2xl'>What I did - Today</h4>
                {isMobileTablet && <span className='text-xs pl-4 text-red-400'><i>Swipe Right on a Task to Delete</i></span>}
                {todayTasks.length > 0 
                  ? 
                    <>
                      {todayTasks.map(item => (
                        <section key={item._id} className='flex justify-center'>
                          <Task task={item.task} taskStatus={item.completed} taskID={item._id} isMobileTablet={isMobileTablet}/>  
                        </section>
                      ))}
                    </>
                  : 
                  <h6 className='italic text-sm md:text-base ml-4'>No tasks available...</h6>}
                <button 
                  className='bg-carrot px-2 py-1 mt-[1rem] text-sm sm:text-base rounded-md cursor-pointer'
                  onClick={() => setOpenDialog(true)}
                  >
                  Create Task
                </button>
                  </section>
              </section>
            
            {openDialog && <Dialog closeDialog={setOpenDialog} />}
          </>
        }
        {!user && 
          <section className='flex flex-col h-96 items-center justify-center'>
            <div className='flex'>
            <div className='flex flex-col items-center justify-center'>
              <label>Enter Username</label>
              <input onChange={(e) => setUsername(e.target.value)} value={username} className='border-2 mt-2 px-2 py-1 border-black rounded-md' placeholder='Username' />
              </div>
             <button onClick={createUser} className='bg-carrot ml-3 w-11 rounded-md self-end px-2 py-1 hover:bg-[#ffa54f]'><img src={login} /></button>
          </div>
          </section>
        }
      </main>        
    </>
  )
}

export default App
