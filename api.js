// TEMPLATE OF https://github.com/cferreras/Cryptocurrency-Status-Discord-Bot
'use strict'

const axios = require('axios')
const fs = require('fs')
const Discord = require('discord.js')
const client = new Discord.Client({ intents: ["GUILDS"] })
const logo_path = `./logo`

const PREFERRED_CURRENCY = process.argv[2]
const COIN_ID = process.argv[3]
const SERVER_ID = process.argv[4]
const CURRENCY_SYMBOL = process.argv[5]
const MC_PING_FREQUENCY = parseInt(process.argv[6])
const DISCORD_TOKEN = process.argv[7]
let COIN_LOGO = null // to be updated later
let COIN_SYMBOL = null // to be updated later

const getLogo = async(url, id) => {
  if(!fs.existsSync(logo_path))
    fs.mkdirSync(logo_path)
    
  const path = `${logo_path}/${id}.webp`
  const writer = fs.createWriteStream(path)

  const response = await axios.get(url, {
    responseType: 'stream'
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

const getPrices = async() => {
	// API for price data.
	let res = await axios.get(`https://api.coingecko.com/api/v3/coins/${COIN_ID}`)
  res = res.data

  // If we got a valid response
  if(res && res.market_data) {
    COIN_LOGO = res.image.small
    
    let currentPrice_usd = res.market_data.current_price['usd'] || 0 // Default to zero
    let currentPrice_custom = res.market_data.current_price[PREFERRED_CURRENCY] || 0 // Default to zero
    let priceChange = res.market_data['price_change_percentage_24h'] || 0 // Default to zero
    let symbol = res.symbol || '?' // Default to "?"
    COIN_SYMBOL = symbol
    let arrow = priceChange > -1 ? "↑" : "↓"
    let presence_status = priceChange > -1 ? "online" : "dnd"

    // setPresence
    // Example: 5.54%  | BTC
    await client.user.setPresence({
      activities: [{
        name: `[ ${priceChange.toFixed(2)}% | ${symbol.toUpperCase()} ] - bot by FML`,
        type: 'WATCHING'
      }],
      status: presence_status
    })

    // set Nickname
    // Example: "₱1,550 ↑ $0.015"
    client.guilds.cache.find(guild => guild.id === SERVER_ID).me.setNickname(`${CURRENCY_SYMBOL}${(currentPrice_custom).toLocaleString()} ${arrow} \$${(currentPrice_usd).toLocaleString()}`)

    const date = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Manila'
    })

    console.log('Updated price to', currentPrice_custom, "on exactly", date)
  }
  else
    console.log('Error at api.coingecko.com data:', err)
}

// Runs when client connects to Discord.
client.on('ready', async() => {
	console.log('Logged in as', client.user.tag)

	await getPrices() // Ping server once on startup
	// Ping the server and set the new status message every x minutes. (Minimum of 1 minute)

  const image_uri = await getLogo(COIN_LOGO, COIN_SYMBOL) // download coing's logo image

  client.user.setAvatar(`${logo_path}/${COIN_SYMBOL}.webp`)
    .then(user => console.log("Avatar is set!"))
    .catch(console.error)
	setInterval(getPrices, Math.max(1, MC_PING_FREQUENCY || 1) * 60 * 1000)
})

// Login to Discord
client.login(DISCORD_TOKEN)
