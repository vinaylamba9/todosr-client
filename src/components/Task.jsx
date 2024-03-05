import React, { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../store'
import { getRequestBody } from '../utils'

const Task = ({task, taskStatus, taskID}) => {
    const [isEditing, setIsEditing] = useState(false)
    const [currentTaskValue, setCurrentTaskValue] = useState(task)

    const updateTask = useAppStore((state) => state.updateTask)
    const inputRef = useRef()

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
          }
    }, [isEditing])

    const updateTaskStatus = async (completed = taskStatus, taskTitle = task) => {
        const URL = import.meta.env.VITE_BASE_SERVER_URL + '/update-task'
        const fetchOptions = getRequestBody('PUT', {completed, taskID, taskTitle})
        const response = await fetch(URL, fetchOptions);
        if(response.status === 200) {
            const updated = {
                completed,
                task: taskTitle,
                taskID
            }
            updateTask(updated)
        }
    }
    
  return (
        <div className="w-full flex my-2">
        {isEditing ? (
        <input type='text' 
            ref={inputRef} 
            className={`focus:outline-none ml-[1rem] text-sm md:text-base focus:border-b w-11/12`} 
            onChange={(e) => setCurrentTaskValue(e.target.value)}
            onBlur={() => {
                setIsEditing(false)
                updateTaskStatus(taskStatus, currentTaskValue)
            }}
            value={currentTaskValue}
        />
        ) : (
            <label onClick={() => {
                if(taskStatus) return;
                setIsEditing(true)
            }}
                className={`inline-block ml-[1rem] text-sm md:text-base w-11/12 ${taskStatus && 'line-through'}`}>
                {currentTaskValue}
            </label>
        )}
        <button 
            onClick={() => updateTaskStatus(true)} 
            className={`${!taskStatus ? 'bg-carrot py-1' : 'bg-green-600'} text-sm md:text-base px-2 ml-2 h-fit self-center ${taskStatus && 'text-babypowder'} rounded-md`}
            >
            {!taskStatus ? 'Done' : '\u2713'}
        </button>
        {taskStatus && <button onClick={() => updateTaskStatus(false)} className='bg-nightblack px-2 ml-2 text-sm md:text-base h-fit self-center text-babypowder rounded-md'>&#8617;</button>}
        </div>
  )
}

export default Task