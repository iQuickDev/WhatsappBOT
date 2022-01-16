module.exports = class GameManager
{
    client
    moduleName
    moduleDescription
    commands
    games

    constructor(client)
    {
        this.client = client
        this.moduleName = "Games"
        this.moduleDescription = "Game related commands"
        this.commands = [this.guess, this.hangman, this.tictactoe, this.guessthenumber]
        this.games = []
        console.log("GameManager loaded!")
    }

    hangman(message, info)
    {
        let game = new HangMan(this.client, message, info, 0)
        this.games.push(game)
    }

    guess(message, info)
    {
        console.log("Entered GM guess")
        this.games[0].guess(message, info)
    }

    tictactoe(message, info)
    {

    }

    guessthenumber(message, info)
    {

    }
}

class HangMan
{
    client
    id
    host
    secretWord
    showedWord
    errors
    maxErrors
    
    constructor(client, message, info, id)
    {
        this.client = client
        this.id = id
        this.host = message.from
        this.secretWord = info.args[0].toLowerCase()
        this.showedWord = []
        this.errors = 0
        this.maxErrors = 7

        for (let i = 0; i < this.secretWord.length; i++)
            this.showedWord.push("_")
    }

    guess(message, info)
    {
        console.log("Entered HM guess")
        // if (message.from == this.host)
        // {
        //     message.reply("The host can't guess!")
        //     return
        // }

        if (info.args[0].length != 1)
        {
            message.reply("You can only guess one letter or the whole word!")
            return
        }

        if (info.args[0].length == this.secretWord.length && info.args[0] == this.secretWord)
        {
            message.reply("GG, you guessed the right word!")
            return
        }
        else if (info.args[0].length == this.secretWord.length && info.args[0] != this.secretWord)
        {
            message.reply("You guessed the wrong word!")
            this.errors++
            this.checkErrors()
            return
        }

        if (this.secretWord.includes(info.args[0]))
        {
            let letter = info.args[0].toLowerCase()

            message.reply("Nice one, the letter is in the word!")

            for (let i = 0; i < this.secretWord.length; i++)
            {
                if (this.secretWord[i] == letter)
                    this.showedWord[i] = letter
            }
        }
        else if (!this.secretWord.includes(info.args[0]))
        {
            message.reply("The letter is not in the word!")
            this.errors++
            this.checkErrors()
        }

        this.gameInfoMessage(message, info)
    }

    gameInfoMessage(message, info)
    {
        message.reply(`*Word:* ${this.showedWord.toString()}\n*Errors:* ${this.errors} / ${this.maxErrors}`)
    }

    checkErrors()
    {
        if (this.errors == this.maxErrors)
        {
            message.reply("You lost, the word was: " + this.secretWord)
            return
        }
    }
}

class TicTacToe
{

}

class GuessTheNumber
{

}