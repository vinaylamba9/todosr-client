import React, { useState } from 'react';
import { useAppStore } from '../store';
import { getRequestBody } from '../utils';

const Dialog = ({ onSave, closeDialog }) => {
  const [taskDescription, setTaskDescription] = useState('');

  const userID = useAppStore((state) => state.user._id)
  const addTodayTask = useAppStore((state) => state.addTodayTask)

  const createTask = async () => {
    const URL = import.meta.env.VITE_BASE_SERVER_URL + '/create-task'
    const fetchOptions = getRequestBody('POST', {taskDescription, userID, completed: false, dateCreated: new Date().toDateString()})
    const response = await fetch(URL, fetchOptions);
    if(response.status === 200) {
      const data = await response.json();
      if(data && data.task) {
        addTodayTask(data.task)
        setTaskDescription('')
      }
    }
    closeDialog(false)
  }

  return (
    <div onClick={() => closeDialog(false)} className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div onClick={(e) => e.stopPropagation()} className="bg-white w-11/12 md:w-2/3 px-6 py-4 sm:px-12 sm:py-8 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-base sm:text-lg font-bold mb-2">Task</label>
          <input
            type="text"
            value={taskDescription}
            placeholder='Create a task'
            onChange={(e) => setTaskDescription(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm sm:text-base"
          />
        </div>

        <div className="flex justify-end">
          <button
            className="bg-nightblack hover:bg-[#333] text-white px-4 py-1 rounded mr-2 text-sm sm:text-base"
            onClick={createTask}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
