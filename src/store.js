
import {create} from 'zustand'

export const useAppStore = create((set) => ({
    spacedRepetitionTasks: [],
    todayTasks: [],
    user: JSON.parse(localStorage.getItem('todosr_user')),

    updateUser: (user) => set(() => ({user})),
    updateTodayTasks: (tasks) => set(() => ({todayTasks: tasks})),
    addTodayTask: (task) => set((state) => ({todayTasks: [...state.todayTasks, task]})),
    updateSpacedRepetitionsTasks: (tasks) => set(() => ({spacedRepetitionTasks: tasks})),
    updateTask: ({completed, task, taskID}) => set((state) => {
        const updatedTodayTasks = state.todayTasks.map(item => {
            if(item._id === taskID) {
                return {...item, completed, task}
            }
            return item;
        })
        const updatedSRTasks = state.spacedRepetitionTasks.map(item => {
            if(item._id === taskID) {
                return {...item, completed, task}
            }
            return item;
        })
        return {todayTasks: updatedTodayTasks, spacedRepetitionTasks: updatedSRTasks}
    })
}))
