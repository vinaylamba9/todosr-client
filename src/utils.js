const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const getToday = () => {
    const dateObj = new Date()
    const day = daysOfWeek[dateObj.getDay()]
    const month = monthsOfYear[dateObj.getMonth()]
    const date = dateObj.getDate()
    return `${day}, ${month} ${date}`
}

export const getRequestBody = (methodType, reqBody) => {
    return {
        method: methodType,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody)
      }
}
