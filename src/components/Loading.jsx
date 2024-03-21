import React from 'react'

const Loading = ({color = 'white'}) => {
  return (
    <div className='flex items-center justify-center h-full'>
        <div class={`animate-spin rounded-full h-6 w-6 border-t-4 border-${color} border-solid`}></div>
    </div>
  )
}

export default Loading