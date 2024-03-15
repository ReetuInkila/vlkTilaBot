require('dotenv').config()
const axios = require("axios")
const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.command('start', ctx => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, 'Tervetuloa valkeakosken tila telegram bottiin.\nLähettämällä /help saat näkyviin käytössä olevat komennot', {})
})

bot.command('help', ctx => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, `Käytettävissä olevat komennot.
    /help
    /voimailusali`, {})
})

bot.command('voimailusali', ctx => {
    console.log(ctx.from)
    axios.get(`https://valkeakoski.tilamisu.fi/fi/locations/852/reservations.json?from=2024-03-14&to=2024-03-15`)
    .then(response => {
        console.log(response.data)
        const calendar = makeCalendar(response.data)
        bot.telegram.sendMessage(ctx.chat.id, calendar, {})
    })
})

function makeCalendar(data){
    const date = new Date(data[0].start_date).toLocaleDateString()
    let reservationInfo = `${data[0].location_name}\n${date}`

    // Loop through the reservations
    data.forEach(reservation => {
        const startDate = new Date(reservation.start_date)
        const endDate = new Date(reservation.end_date)
        
        const startTime = `${startDate.getHours()}:${(startDate.getMinutes()<10?'0':'') + startDate.getMinutes()}`
        const endTime = `${endDate.getHours()}:${(endDate.getMinutes()<10?'0':'') + endDate.getMinutes()}`
        // Concatenate the start date, end date, and user group name to the string
        reservationInfo += `\n\n${startTime} - ${endTime}\n${reservation.text}`
    })

    return reservationInfo
}

bot.launch()