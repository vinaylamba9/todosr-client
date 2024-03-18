import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAppStore } from '../store'
import { getRequestBody } from '../utils'
import { useSwipeable } from 'react-swipeable'

const Task = ({task, taskStatus, dateCreated, taskID, isMobileTablet}) => {
    const [isEditing, setIsEditing] = useState(false)
    const [currentTaskValue, setCurrentTaskValue] = useState(task)
    const [isDeleteVisible, setIsDeleteVisible] = useState(false)

    const updateTask = useAppStore((state) => state.updateTask)
    const deleteTask = useAppStore((state) => state.deleteTask)
    const inputRef = useRef()

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
          }
    }, [isEditing])

    const updateTaskStatus = async (completed = taskStatus, taskTitle = task) => {
        const URL = import.meta.env.VITE_BASE_SERVER_URL + '/update-task'
        if(taskTitle === '') {
            setCurrentTaskValue(task)
            return;
        }
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

    const removeTask = async () => {
        const URL = import.meta.env.VITE_BASE_SERVER_URL + '/delete-task'
        const fetchOptions = getRequestBody('DELETE', {taskID})
        const response = await fetch(URL, fetchOptions);
        if(response.status === 200) {
            deleteTask(taskID)
        }
        setIsDeleteVisible(false)
    }

    const handlers = useSwipeable({
        onSwipedRight: () => setIsDeleteVisible(true),
        onSwipedLeft: () => setIsDeleteVisible(false),
        preventDefaultTouchmoveEvent: true,
        // trackMouse: true,
    });

  return (
        <div className="w-full flex my-2 relative transition-transform ease-in-out duration-300 transform" {...handlers}>
            <button onClick={() => removeTask()} className={`bg-babypowder px-2 py-1 text-sm md:text-base h-fit self-center border-2 border-red-600
            text-nightblack rounded-md ${isDeleteVisible ? '' : 'absolute top-0 right-0 bottom-0 hidden'}`}>Delete</button>
            <div className='flex flex-col flex-1'>
                {dateCreated && <label className='text-xs ml-[1rem] text-gray-500'>{dateCreated}</label>}
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
                        className={`inline-block ml-[1rem] pt-1 text-sm md:text-base w-11/12 rounded-sm ${taskStatus && 'line-through bg-green-300'}`}>
                        {currentTaskValue}
                    </label>
                )}
            </div>
            {!taskStatus && <button
                    onClick={() => updateTaskStatus(true)} 
                    className='bg-carrot border-2 border-carrot py-1 text-sm md:text-base px-2 ml-2 h-fit self-center rounded-md'
                    >
                    Done
                </button>
            }
            {taskStatus && <button onClick={() => updateTaskStatus(false)} className='bg-nightblack px-2 ml-2 py-1 border-2 border-nightblack text-sm md:text-base h-fit self-center text-babypowder rounded-md'>Revert</button>}
            {!isMobileTablet && <button onClick={() => removeTask()} className='bg-babypowder border-2 border-red-600 px-2 ml-2 py-1 text-sm md:text-base h-fit self-center text-nightblack rounded-md'>DEL</button>}
        </div>
  )
}

export default Task