# discord-coin-ticker
### mix of nodejs, python, and idk

I made a very complicated discord bot which is very similar to [discord-stock-sticker](https://github.com/rssnyder/discord-stock-ticker) (it uses Go language).

I wanted to replicate the project clearly so I came up with a sphagetti ahh code. I dont even know what im doing but atleast it worked lmao

So I combined two languages (NodeJS and Python) where one language would serve as the backend of the other. To start using it, discord.js requires `16.6.0` or greater node version.

> To use discord.js, you'll need to install Node.js. discord.js v13 requires Node v16.6.0 or higher.

We would also need to have python installed.


Module requirements for each language:
1. Python
    - flask
```
pip install flask
```

2. NodeJS
    - axios
    - discord.js
```
npm i axios discord.js
```

After installing all essential modules, we are now ready to run the `main.py`:
```
python main.py
```



By doing this the server (flask) inside the `main.py` file will start to look for HTTP requests, forever. Also, take note that you should have a password in your `.env` or environment variable to make the server secured, somehow lol.

After turning on the server/running `main.py`, we can make a POST HTTP request to, like give a handshake, to our server The data to send to the POST request will include the coin (to tick), currency, and other discord server/bot info.



The POST Request details:

- URL:
    ```
    http://localhost/getCoin
    ```


- POST body/data:
    ```
    // an example only
    {
    "currency": "php",                                             // currency of your choice
    "coin_id": "bitcoin",                                          // coin to tick, must be a Coingecko coin/api id
    "currency_symbol": "₱",                                        // currency symbol of your choice
    "frequency": 5,                                                // amount of minutes the bot should tick
    "server_id": "xxxxxxxxxxxxxxxxxx",                             // id of the discord server you want the bot to tick on
    "token": "xxxxxxxxxx.xxxxxxxxxxxxx.xxxxxxxxxxxxxxx.xxxxxxxxx", // discord bot token
    "password": "something"                                        // password to be validated by main.py server
    }
    ```

Then after that, main.py should do its magic and you should see your bot alive and ticking in the server you wanted it to be!!